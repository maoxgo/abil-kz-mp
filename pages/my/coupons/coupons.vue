<template>
    <!-- pages/my/coupons/coupons.wxml -->
    <view>
		<!-- uni-list class="coupon-list">
			<uni-list-item  title="列表文字" >
				
			</uni-list-item>
		</uni-list> -->
        <van-cell-group custom-class="coupon-list">
			<!-- <uni-card title="标题文字" thumbnail="" extra="额外信息" note="Tips">
				内容主体，可自定义内容及样式
			</uni-card>
			<uni-card 
				v-for="(item, index) in rows" 
				:key="item.id" 
				:title="item.title" 
				:isFull="true" 
				:sub-title="item.expiryTimeStr + ' 前有效'" 
				extra="额外信息"
			>
				<text class="uni-body">这是一个通栏卡片 ，通栏没有外边距，左右会贴合父元素。</text>
			</uni-card> -->
            <van-cell center size="large" :label="item.expiryTimeStr + ' 前有效'" v-for="(item, index) in rows" :key="item.id">
				<template v-slot:title>
					<view>{{item.title}}</view>
					<van-tag v-if="item.status==0" plain type="success">可用</van-tag>
					<van-tag v-else-if="item.status==10" plain type="warning">赠送中</van-tag>
				</template>
                <view>
					<view class="coupon-value">
						<block v-if="item.couponType == 1">
						    <text v-if="item.discount != 0">{{ item.discountStr }} 折</text>
						    <text v-else>免单</text>
						</block>
						<block v-else>
						    <text>{{ item.amountStr }} 元</text>
						</block>
					</view>
                    <view class="coupon-give-btn">
                    	<van-button v-if="item.status==0 && item.canGive>0" type="primary" size="mini" open-type="share" :dataset="item" >赠送好友</van-button>
						<van-button v-if="item.status==10" type="warning" size="mini" @click="cancelGive(item)">取消赠送</van-button>
                    </view>
                </view>
            </van-cell>
            
        </van-cell-group>
    </view>
</template>

<script>
// pages/my/coupons/coupons.js
import * as myCouponApi from '../../../api/myCoupon';
const app = getApp();
import moment from 'moment';
export default {
    data() {
        return {
            rows: [],
            pageNum: 1,
            pageSize: 10,
            hasMore: true
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad(options) {
        if (!app.globalData.checkAuth()) {
            return;
        }

        
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
		this.fetchList(true);
	},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        console.log('--------下拉刷新-------');
        this.fetchList(true)
            .then(() => {})
            .finally(() => {
                uni.stopPullDownRefresh({
                    success: (res) => {}
                });
            });
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        console.log('------加载更多-------');
        this.fetchList();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(e) {
		console.log(e)
		if (e.from == 'button') {
			const item = e.target.dataset.detail
			console.log(item)
			if (item) {
				item.status = 10
				const promise = new Promise((resolve, reject) => {
					uni.showLoading({
						mask: true
					})
					
					myCouponApi.give({
						id: item.id
					}).then(res => {
						uni.hideLoading()
						
						resolve({
							title: '您收到了一张优惠券，请点击领取！',
							path: '/pages/coupon/coupon?couponId='+item.id,
							imageUrl: 'https://cdn.taklipnama.com/static/logo.png'
						})
					}).catch(e => {
						uni.hideLoading()
						console.error(e)
						reject(e)
					})
				})
				return {
					title: 'Taklip nama',
					path: '/pages/index/index',
					promise
				}
				
			}
		}
	},
    methods: {
        async fetchList(reset) {
            let { pageNum, pageSize, rows, hasMore } = this;

            if (reset) {
                pageNum = 1;
                hasMore = true;
            } else {
                if (!hasMore) {
                    return;
                }

                pageNum++;
            }

            const query = {
                pageNum,
                pageSize,
                status: 2
            };

            try {
                const res = await myCouponApi.page({ ...query });

                if (res.totalPage <= res.pageNum) {
                    hasMore = false;
                }

                res.rows.forEach((item) => {
                    item.discountStr = (item.discount / 10).toFixed(1);
                    item.amountStr = (item.amount / 100).toFixed(2);
                    item.expiryTimeStr = moment(new Date(item.expiryTime)).format('yyyy-MM-DD HH:mm');
                });

                if (reset) {
                    this.setData({
                        rows: res.rows,
                        pageNum,
                        hasMore
                    });
                } else {
                    this.setData({
                        rows: [...rows, ...res.rows],
                        pageNum,
                        hasMore
                    });
                }

                return res;
            } catch (error) {
                console.error(error);
            }
        },
		async give(item) {
			// uni.showLoading({
			// 	mask: true
			// })
			const res = await myCouponApi.give({
				id: item.id
			})
			item.status = 10
				
			return res
			// await this.fetchList(true)
		},
		async cancelGive(item) {
			try{
				const res = await myCouponApi.cancelGive({
					id: item.id
				})
				item.status = 0
			}catch(e){
				//TODO handle the exception
				console.error(e);
				uni.showToast({
					title: e.message,
					icon: 'error'
				})
			}
		}
    }
};
</script>
<style>
@import './coupons.css';
</style>
