<template>
    <view>
        <!-- pages/my/invitation/list.wxml -->
        <scroll-view style="height: 100%; width: 100%">
            <!-- <view style="display: flex; flex-wrap: wrap; overflow:auto; justify-content: right; margin-top: 8rpx">
    <view style="width: 375.5rpx; text-align: center; padding-top: 8rpx;" wx:for="{{rows}}" wx:key="id" >
      <navigator open-type="navigate" url="/pages/my/invitation/detail?id={{item.id}}">
        <image mode="aspectFill" src="{{item.imageUrl}}" style="width: 360rpx; height: 510rpx; vertical-align: middle"></image>
      </navigator>
    </view>
  </view> -->
            <view>
                <van-card
                    :title="item.extendInfo ? item.extendInfo.PARTY_NAME || item.extendInfo.BOTH_NAME || '' : ''"
                    :thumb="item.imageUrl + '?x-oss-process=image/resize,w_300'"
                    :price="!hidePayment && item.price > 0 ? item.priceStr : ''"
                    thumb-mode="aspectFill"
                    :tag="item.cateName"
                    v-for="(item, index) in rows"
                    :key="item.id"
                >
                    <view class="van-card__desc" slot="desc">
                        <view v-if="item.extendInfo && item.extendInfo.WEDDING_ADDRESS" style="color: grey" class="">
                            <mp-icon icon="location" type="outline" color="grey" size="14"></mp-icon>
                            {{ item.extendInfo.WEDDING_ADDRESS }}
                        </view>
                        <view v-if="!(item.extendInfo && item.extendInfo.WEDDING_ADDRESS) && item.weddingAddress" style="color: grey" class="">
                            <mp-icon icon="location" type="outline" color="grey" size="14"></mp-icon>
                            {{ item.weddingAddress }}
                        </view>

                        <view v-if="item.extendInfo && item.extendInfo.WEDDING_TIME" style="color: grey" class="">
                            <mp-icon icon="time" type="outline" color="grey" size="14"></mp-icon>
                            {{ item.extendInfo.WEDDING_TIME }}
                        </view>
                        <view v-if="!(item.extendInfo && item.extendInfo.WEDDING_TIME) && item.weddingTime" style="color: grey" class="">
                            <mp-icon icon="time" type="outline" color="grey" size="14"></mp-icon>
                            {{ item.weddingTime }}
                        </view>
                    </view>

                    <view class="van-card__tags" slot="tags">
                        <van-tag v-if="item.price <= 0" plain type="success">免费</van-tag>
                        <van-tag v-if="item.payStatus == 40" plain type="success">已付费</van-tag>
                    </view>

                    <view slot="bottom" class="action-bar" style="">
                        <van-button size="mini" :data-item="item" type="danger" plain @tap.native="handleDelete($event, { item })">删除</van-button>
                        <van-button size="mini" :data-item="item" @tap.native="handleView($event, { item })">查看</van-button>
                        <van-button size="mini" :data-item="item" @tap.native="handleEdit($event, { item })">编辑</van-button>
                        <van-button size="mini" :data-item="item" @tap.native="handlePrint($event, { item })">印刷</van-button>
                        <van-button size="mini" type="primary" plain :data-item="item" @tap.native="handleShare($event, { item })">分享</van-button>
                        <van-button v-if="item.needPay" size="mini" type="danger" plain :data-item="item" @tap.native="handlePay($event, { item })">支付</van-button>
                    </view>
                </van-card>
            </view>
        </scroll-view>
    </view>
</template>

<script>
// pages/my/invitation/list.js
import * as myInvitationApi from '../../../api/myInvitation';
const app = getApp();
export default {
    components: {
    },
    data() {
        return {
            rows: [],
            pageNum: 1,
            pageSize: 10,
            hasMore: true,
            hidePayment: false
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (!app.globalData.checkAuth()) {
            return;
        }

        
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const hidePayment = app.globalData.config['mp.hidePayment']; // console.log(hidePayment)

        if (hidePayment == '1') {
            this.setData({
                hidePayment: true
            });
        }
		this.fetchList(true);
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
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
    onReachBottom: function () {
        console.log('------加载更多-------');
        this.fetchList();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
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
                pageSize
            };

            try {
                const res = await myInvitationApi.listInvitation({ ...query });
                res.rows.forEach((item) => {
                    app.globalData.filterInvitation(item);
                });

                if (res.totalPage <= res.pageNum) {
                    hasMore = false;
                }

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

        handleView(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            const item = e.target.dataset.item;

            // if (app.globalData.checkInvitationPay(item, () => this.fetchList(true))) {
            //     return;
            // }
			if (this.$helper.checkInvitationPay(item)) {
				return
			}

            if (item) {
                uni.navigateTo({
                    url: '/pages/my/invitation/detail?id=' + item.id
                });
            } // console.log(e)
        },

        handleEdit(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            const item = e.target.dataset.item;
            uni.navigateTo({
                url: '/pages/my/invitation/edit-data?id=' + item.id
            });
        },

        handleShare(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            const item = e.target.dataset.item;

            if (!item) {
                return;
            }

            // if (app.globalData.checkInvitationPay(item, () => this.fetchList(true))) {
            //     return;
            // }
			if (this.$helper.checkInvitationPay(item)) {
				return
			}

            uni.navigateTo({
                url: '/pages/my/invitation/guest-list?invitationId=' + item.id
            });
        },

        handlePay(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            const item = e.target.dataset.item;

            if (!item) {
                return;
            }

			if (this.$helper.checkInvitationPay(item)) {
				return
			}
            // if (app.globalData.checkInvitationPay(item, () => this.fetchList(true))) {
            //     return;
            // }
        },

        handleDelete(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            const item = e.target.dataset.item;

            if (!item) {
                return;
            }

            uni.showModal({
                confirmText: '确定',
                content: '您确定要删除该请帖吗？（删除后无法恢复）',
                showCancel: true,
                title: '警告',
                success: async (res) => {
                    if (!res.confirm) {
                        return;
                    }

                    uni.showLoading({
                        title: '删除中'
                    });

                    try {
                        await myInvitationApi.deleteInvitation({
                            id: item.id
                        });
                        await this.fetchList(true);
                    } catch (error) {
                        console.error(error);
                        uni.showToast({
                            title: '删除失败',
                            icon: 'error'
                        });
                    }

                    uni.hideLoading({
                        success: (res) => {}
                    });
                }
            });
        },

        handlePrint(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            const item = e.target.dataset.item;

            if (!item) {
                return;
            }

            // if (app.globalData.checkInvitationPay(item, () => this.fetchList(true))) {
            //     return;
            // }
			if (this.$helper.checkInvitationPay(item)) {
				return
			}

            uni.navigateTo({
                url: '/pages/my/invitation/print?id=' + item.id
            });
        }
    }
};
</script>
<style>
@import './list.css';
</style>
