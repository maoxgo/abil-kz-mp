<template>
	<view class="page-main">
		<view class="title">
			Taklip nama 优惠券
		</view>
		<view class="coupon">
			<view class="coupon-main">
				<view class="coupon-main-top">
					<view class="coupon-main-top-left">
						<text style="font-size: 16px;">￥</text>
						<text style="font-size: 160rpx;">免</text>
					</view>
					<view class="coupon-main-top-right">
						<view style="font-size: 60rpx;">免单券</view>
						<view class="coupon-main-top-right-btn">免费制作</view>
					</view>
				</view>
				
			</view>
			<button class="coupon-btn" @click="handleGain">
				点击领取
				<!-- <text>点击领取</text> -->
			</button>
		</view>
		<view class="intro">
			<view class="intro-title">
				使用说明
			</view>
			<view class="intro-desc">
				本优惠券仅限于Toy Bazar小程序里制作婚礼电子请帖使用。付款时选择付款方式为优惠券，因操作失误导致优惠券无法使用本公司拒不承担任何责任。本公司从新疆各地招募合作伙伴，赠送免单券，联系方式：18116838227 （微信同号）。
			</view>
		</view>
	</view>
</template>

<script>
	import * as couponApi from '@/api/couponApi.js'
	const app = getApp();
	
	export default {
		data() {
			return {
				couponId: null,
				coupon: null
			}
		},
		onLoad(params) {
			console.log(params)
			this.couponId = params.couponId
			
			
		},
		onShow() {
			this.fetchInfo()
		},
		methods: {
			async fetchInfo() {
				try{
					const data = await couponApi.fetchById({ couponId: this.couponId })
					this.coupon = data
					if (data == null || data.status != 10) {
						throw new Error('优惠券已失效！')
					}
				}catch(e){
					console.error(e)
					// uni.showModal({
					// 	showCancel: false,
					// 	title: e.message,
					// 	confirmText: '返回首页',
					// 	success: () => {
					// 		uni.switchTab({
					// 			url: '/pages/index/index'
					// 		})
					// 	}
					// })
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			},
			async handleGain() {
				if (!app.globalData.checkAuth()) {
				    return;
				}
				try{
					uni.showLoading({
						mask: true
					})
					const data = await couponApi.gain({ id: this.couponId })
					uni.hideLoading()
					uni.showModal({
						showCancel: false,
						title: '领取成功！',
						confirmText: '制作请帖',
						success: () => {
							uni.switchTab({
								url: '/pages/index/index'
							})
						}
					})
				}catch(e){
					console.error(e)
					// uni.hideLoading()
					
					uni.showToast({
						title: '领取失败',
						icon: 'error'
					})
				}
			}
		}
	}
</script>

<style scoped>
.page-main {
	height: 100vh;
	padding: 32rpx;
	background-image: url(https://cdn.taklipnama.com/static/coupon_bg.png);
	background-size: cover;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
}
.title {
	color: white;
	font-size: 32px;
	text-align: center;
}
.coupon {
	display: flex;
	flex-direction: row;
}
.coupon-main {
	width: 510rpx;
	height: 229rpx;
	background-image: url(https://cdn.taklipnama.com/static/coupon_bg2.png);
	background-size: cover;
	color: rgb(231, 29, 50);
	line-height: 1;
}
.coupon-main-top {
	height: 180rpx;
	display: flex;
	flex-direction: row;
}
.coupon-main-top-left {
	padding-left: 40rpx;
	padding-bottom: 10rpx;
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	font-weight: bold;
}
.coupon-main-top-right {
	padding-left: 40rpx;
	padding-top: 40rpx;
	display: flex;
	flex-direction: column;
}

.coupon-main-top-right-btn {
	padding: 8rpx;
	background-color: rgb(231, 29, 50);
	color: white;
	display: inline;
	font-size: 12px;
	width: fit-content;
	margin-top: 8rpx;
}
.coupon-btn {
	padding: 0;
	margin: 0;
	border: none;
	border-radius: 0;
	width: 160rpx;
	height: 229rpx;
	background-color: rgb(228, 28, 48);
	font-size: 60rpx;
	line-height: 1.2;
	color: white;
	text-align: center;
	align-items: center;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-content: center;
}

.intro {
	color: white;
	font-size: 16px;
}
.intro-title {
	font-size: 20px;
	text-align: center;
	
}


</style>
