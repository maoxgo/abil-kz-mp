<script>
	// app.js
	import {
		fetchUserInfo
	} from './api/my';
	import * as myInvitationApi from './api/myInvitation';
	import {
		listAllFont,
		listCate,
		listCustomTypesV2,
		fetchConfig
	} from './api/home';
	export default {
		data() {
			return {};
		},
		async onLaunch() {
			const token = uni.getStorageSync('access_token');
			this.globalData.accessToken = token; // 展示本地存储能力

			const logs = uni.getStorageSync('logs') || [];
			logs.unshift(Date.now());
			uni.setStorageSync('logs', logs);
			await this.globalData.fetchConfig();
			this.globalData.fetchCateList();
			await this.globalData.fetchInfo(); // 登录
			// wx.login().then(res => {
			//   console.log(res)
			//   return wx.getUserInfo({})
			// }).then(console.log).catch(err => {
			//   console.log(err)
			// })

			try {
				await this.globalData.listAllFont();
				await this.globalData.listCustomTypes();
			} catch (error) {
				console.error(error);
			}
		},
		globalData: {
			userInfo: null,
			accessToken: null,
			fonts: [],
			cates: [],
			customTypes: [],
			config: {},

			checkAuth() {
				if (this.accessToken) {
					return true;
				}

				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/my/login'
					});
				}, 100);
				return false;
			},

			async listAllFont() {
				const {
					rows
				} = await listAllFont();
				rows.forEach((item) => {
					item.code = 'tn-' + item.code;
					item.isLoad = 0;
				});
				this.fonts = rows;
			},

			async listCustomTypes() {
				const data = await listCustomTypesV2();

				if (data) {
					data.rows.forEach((row) => {
						if (row.options && typeof row.options === 'string') {
							try {
								row.options = JSON.parse(row.options)
							} catch (error) {
								row.options = []
							}
						}
					})
					this.customTypes = data.rows;
				}
			},

			loadFont(name) {
				console.log('load font: ' + name);

				if (!name && !name.startsWith('tn-')) {
					return;
				}

				const fonts = this.fonts;
				const font = fonts.find((item) => item.code === name);

				if (font && !font.isLoad) {
					console.log(font);
					uni.loadFontFace({
						global: true,
						family: font.code,
						source: `url("${font.fileUrl}")`,
						scopes: ['native', 'webview'],

						success(res) {
							console.log(res);
							font.isLoad = 1;
						},

						fail(err) {
							console.error(err);
							font.isLoad = 2;
						}
					});
				}

				return font;
			},

			loadFonts(page) {
				console.log(page);
				const fontSet = new Set();
				const fonts = [];
				page.elements.forEach((item) => {
					const commonStyle = item.commonStyle;

					if (commonStyle && commonStyle.fontFamily) {
						fontSet.add(commonStyle.fontFamily);
					}
				});

				for (const item of fontSet) {
					const font = this.loadFont(
					item); // const font = this.globalData.fonts.find(item => item.code === name)

					if (font) {
						fonts.push(font);
					}
				}

				return fonts;
			},

			fetchFonts(page) {
				const fontSet = new Set();
				const fonts = [];
				page.elements.forEach((item) => {
					const commonStyle = item.commonStyle;

					if (commonStyle && commonStyle.fontFamily) {
						fontSet.add(commonStyle.fontFamily);
					}
				});

				for (const name of fontSet) {
					const font = this.fonts.find((item) => item.code === name);

					if (font) {
						fonts.push(font);
					}
				}

				return fonts;
			},

			async fetchInfo() {
				try {
					const token = this.accessToken;

					if (token == null) {
						return false;
					}

					const data = await fetchUserInfo(); // console.log(data)

					this.userInfo = data;
					return data; // this.eventChannel.emit('update:userInfo', data)
				} catch (e) {
					console.error(e);
					this.accessToken = null;
					uni.setStorageSync('access_token', null);
				}
			},

			fetchCateList() {
				listCate({
						pageSize: 12
					})
					.then((data) => {
						// console.log(data)
						this.cates = data.rows;
					})
					.catch((err) => {
						console.error(err);
					});
			},

			filterInvitation(item) {
				if (item.price > 0 && item.payStatus != 40) {
					item.needPay = true;
				} else {
					item.needPay = false;
				}

				item.priceStr = (item.price / 100).toFixed(2);
				item.extendInfo = JSON.parse(item.extendInfo);
				const cate = this.cates.find((cate) => cate.id == item.cateId);

				if (cate) {
					item.cateName = cate.name;
				} else {
					item.cateName = '';
				}
			},

			checkInvitationPay: (item, cb) => {
				if (item.price <= 0) {
					return false;
				}

				if (item.payStatus == 40) {
					return false;
				}
				uni.navigateTo({
					url: "/pages/my/order/createInvitationOrder/createInvitationOrder"
				})
				return true
				uni.showModal({
					confirmText: '前往支付',
					showCancel: true,
					// title: '您需要付费后才能使用分享、印刷、保存请帖等功能，并去除请帖水印',
					// content: '￥'+ (item.price/100).toFixed(2),
					title: `请帖使用费￥${(item.price / 100).toFixed(2)}元(赠送50个积分)`,
					content: '付款后获得请帖使用权，会去除请帖水印',
					success: async (result) => {
						if (result.cancel) {
							return;
						}

						uni.showLoading({
							title: '生成订单中',
							mask: true
						});

						try {
							const [err, res1] = await uni.login();
							if (err) {
								throw err
							}
							const data = await myInvitationApi.createOrder({
								id: item.id,
								authCode: res1.code
							});
							console.log(data);
							uni.hideLoading({
								success: (res) => {}
							});
							const [err3, res3] = await uni.requestPayment({
								nonceStr: data.nonceStr,
								package: data.packageValue,
								paySign: data.paySign,
								timeStamp: data.timeStamp,
								signType: data.signType
							});
							if (err3) {
								throw err3
							}
							uni.showLoading({
								title: '订单处理中',
								mask: true
							});
							setTimeout(() => {
								uni.hideLoading({
									success: (res) => {}
								});

								if (cb) {
									cb();
								}
							}, 5000);
						} catch (err) {
							console.error(err);
							uni.hideLoading({
								success: (res) => {}
							});
							uni.showToast({
								title: '支付失败',
								icon: 'error'
							});
						}
					},
					fail: (res) => {},
					complete: (res) => {}
				});
				return true;
			},

			async fetchConfig() {
				const data = await fetchConfig({});
				console.log(data);

				if (data) {
					this.config = data;
				}

				return data;
			}
		}
	};
</script>
<style>
	@import './app.css';
</style>
