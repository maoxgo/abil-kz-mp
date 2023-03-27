<template>
	<view v-if="invitation" class="container">
		<van-card
		    :title="extendInfo.PARTY_NAME || extendInfo.BOTH_NAME || ''"
		    :thumb="invitation.imageUrl"
			:price="invitation.price > 0 ? invitation.priceStr : ''"
		    thumb-mode="aspectFill"
		    :tag="invitation.cateName"
		>
		    <view class="van-card__desc" slot="desc">
		        <view style="cloor: grey" class="">
		            <mp-icon icon="location" type="outline" color="grey" size="14"></mp-icon>
		            {{ extendInfo.WEDDING_ADDRESS }}
		        </view>
		
		        <view style="color: grey" class="">
		            <mp-icon icon="time" type="outline" color="grey" size="14"></mp-icon>
		            {{ extendInfo.WEDDING_TIME }}
		        </view>
		    </view>
		</van-card>
		<van-cell-group title="项目">
		  <van-cell title="请帖使用费" value-class="item-value" :value="invitation.price | priceFormat" />
		</van-cell-group>
		<van-cell-group title="优惠券">
		  <van-cell v-if="currCoupon" :title="currCoupon.title" value-class="item-value" :value="currCoupon.discountAmount | priceFormat" clickable is-link @click="() => showChooseCoupon=true" />
		</van-cell-group>
		<van-submit-bar :price="finnalAmount" button-text="提交订单" @submit="onSubmitV2" />
		<van-action-sheet 
			:show="showChooseCoupon"
			title="选择优惠券" 
			@close="showChooseCoupon=false"
			@cancel="handleCouponCancel"
			cancel-text="不使用优惠券"
		>
			<van-cell-group inset>
				<van-cell 
					v-for="item in coupons" 
					:key="item.id"
					:title="item.title"
					size="large"
					clickable
					@click="handleCouponSelect(item)"
				>
					<view class="item-value">
						<block v-if="item.couponType == 1">
							<text v-if="item.discount != 0">{{ item.discountStr }} 折</text>
							<text v-else>免单</text>
						</block>
						<block v-else>
							<text>{{ item.amountStr }} 元</text>
						</block>
						
					</view>
					<view style="margin-left: 8rpx;" slot="right-icon">
						<van-checkbox :value="couponId==item.id"></van-checkbox>
					</view>
				</van-cell>
			</van-cell-group>
		</van-action-sheet>
	</view>
</template>

<script>
import * as myInvitationApi from '@/api/myInvitation';	
import * as myCouponApi from '@/api/myCoupon';
import * as orderApi from '@/api/orderApi.js'
import moment from 'moment';

export default {
	data() {
		return {
			invitationId: null,
			invitation: null,
			extendInfo: {},
			coupons: [],
			couponId: null,
			showChooseCoupon: false
		};
	},
	computed: {
		finnalAmount() {
			if (!this.invitation) {
				return 0
			}
			if (this.currCoupon) {
				return this.invitation.price+this.currCoupon.discountAmount
			}
			return this.invitation.price
		},
		currCoupon() {
			
			if (this.couponId == null) {
				return {
					id: null,
					title: '无',
					discountAmount: 0
				}
			} else {
				
				const coupon = this.coupons.find(item => item.id==this.couponId)
				if (!coupon) {
					this.couponId = null
					return {
						id: null,
						title: '无',
						discountAmount: 0
					}
				}
				const res = {
					id: coupon.id,
					title: coupon.title,
					discountAmount: -coupon.amount
				}
				if (coupon.couponType == 1) {
					res.discountAmount = -Math.floor(this.invitation.price * (100-coupon.discount) / 100)
				}
				if (res.discountAmount+this.invitation.price < 0) {
					res.discountAmount = - this.invitation.price
				}
				return res
			}
		},
	},
	onLoad(options) {
		console.log(options);
		const { invitationId } = options;
		this.invitationId = invitationId;
		this.loadInfo()
	},
	methods: {
		async loadInfo() {
			try{
				uni.showLoading({
					title: '数据加载中',
					mask: true
				})
				await this.fetchInvitation();
				await this.fetchOrder()
				await this.fetchCouponList()
				uni.hideLoading()
			}catch(e){
				uni.hideLoading()
				//TODO handle the exception
				console.error(e)
				uni.showToast({
					title: '获取数据失败',
					icon: 'error',
					mask: true,
					complete: () => {
						uni.navigateBack()
					}
				})
			}

		},
		async fetchInvitation() {
		    
			const data = await myInvitationApi.fetchInvitation({
				id: this.invitationId
			});
	
			if (!data || !data.originData) {
				throw new Error('原始数据出错，该请帖无法使用');
			}
			
	
			const extendData = JSON.parse(data.extendData) || {};
			const originData = JSON.parse(data.originData) || {};
	
			if (originData == null || !originData.pages || originData.pages.length == 0) {
				throw new Error('原始数据出错，该请帖无法使用');
			}
	
			const extendInfo = JSON.parse(data.extendInfo);

			
	
			this.$helper.filterInvitation(data);
			this.setData({
				invitation: data,
				extendInfo: extendInfo || {
					femaleName: data.femaleName,
					maleName: data.maleName,
					weddingAddress: data.weddingAddress,
					weddingTime: data.weddingTime
				},
			});
				

		},
		async fetchCouponList() {
			const query = {
			    pageNum: 1,
			    pageSize: 20,
			    status: 1
			};
			
			const res = await myCouponApi.page({ ...query });
		
		
			res.rows.forEach((item) => {
				item.discountStr = (item.discount / 10).toFixed(1);
				item.amountStr = (item.amount / 100).toFixed(2);
				item.expiryTimeStr = moment(new Date(item.expiryTime)).format('yyyy-MM-DD HH:mm');
			});
		
			this.coupons = res.rows
		
			return res;
			
		},
		async fetchOrder() {
			const invitation = this.invitation
			if (invitation.price <= 0 || invitation.status == 40) {
				uni.showToast({
					title: '请帖已付款'
				})
				uni.navigateBack()
				return
			}
			if (invitation.orderNo) {
				const order = await orderApi.fetchByNo({ orderNo: invitation.orderNo })
				if (order) {
					this.$helper.preparePayment(order, (err, res) =>{
						if (err) {
							console.error(err);
							uni.showToast({
							    title: '支付失败',
							    icon: 'error'
							});
						} else {
							uni.showToast({
							    title: '支付成功',
							    icon: 'success'
							});
						}
						uni.navigateBack()
					}) 
				}
			}
		},
		handleCouponCancel() {
			this.couponId = null
			this.showChooseCoupon = false
		},
		handleCouponSelect(item) {
			this.couponId = item.id
			this.showChooseCoupon = false
		},
		async onSubmitV2() {
			uni.showLoading({
			    title: '生成订单中',
			    mask: true
			});
			
			try {
			    const order = await orderApi.createInvitationOrder({
			        id: this.invitationId,
					couponId: this.couponId
			    });
				uni.hideLoading({
				    success: (res) => {}
				});
				
			    this.$helper.preparePayment(order, (err, res) => {
					if (err) {
						console.error(err);
						uni.showToast({
						    title: '支付失败',
						    icon: 'error'
						});
					} else {
						uni.showToast({
						    title: '支付成功',
						    icon: 'success'
						});
					}
					uni.navigateBack()
				})
			} catch (err) {
			    console.error(err);
			    uni.hideLoading({
			        success: (res) => {}
			    });
			    uni.showToast({
			        title: '支付失败',
			        icon: 'error'
			    });
				uni.navigateBack()
			}
		},
		async onSubmit() {
			uni.showLoading({
			    title: '生成订单中',
			    mask: true
			});
			
			try {
			    const [err, res1] = await uni.login();
				if (err) {
					throw err
				}
			    const {result, payment} = await orderApi.createInvitationOrder({
			        id: this.invitationId,
			        authCode: res1.code,
					couponId: this.couponId
			    });
				if (result == 0) {
					// 无需支付
					uni.hideLoading()
					uni.showLoading({
					    title: '订单已完成',
					    mask: true
					});
					setTimeout(() => {
					    uni.hideLoading({
					        success: (res) => {}
					    });
								
					    uni.navigateBack()
					}, 2);
					return
				}
			    console.log(payment);
			    uni.hideLoading({
			        success: (res) => {}
			    });
			    const [err3, res3] = await uni.requestPayment({
			        nonceStr: payment.nonceStr,
			        package: payment.packageValue,
			        paySign: payment.paySign,
			        timeStamp: payment.timeStamp,
			        signType: payment.signType
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
			
			        uni.navigateBack()
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
				uni.navigateBack()
			}
		}
	}
}
</script>

<style lang="scss">
page {
	background-color: #F2F2F2;
}
.container {
	background-color: #F2F2F2;
	min-height: 100%;
}
.item-value {
    color: red !important;
    font-size: 20px !important;
}
</style>
