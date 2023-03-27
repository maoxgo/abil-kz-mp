<template>
    <!-- pages/template/detail.wxml -->
    <view v-if="'info'" class="page-container">
        <view class="main-content">
            <image mode="widthFix" :src="info.price && !hidePayment ? info.maskImageUrl : info.imageUrl" style="width: 100%"></image>
        </view>
        <view class="bottom-bar">
            <view class="bottom-button bottom-text">
                <text v-if="hidePayment == false" style="color: red">￥{{ info.price ? info.priceStr : '免费' }}</text>
            </view>
            <van-button type="primary" class="bottom-button" block @tap.native="handleCreate">制作请帖</van-button>
        </view>
    </view>
</template>

<script>
// pages/template/detail.js
import * as tempApi from '../../api/template';
const app = getApp();
export default {
    data() {
        return {
            id: null,
            info: null,
            hidePayment: false
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        const { id } = options; // console.log(id)

        this.setData(
            {
                id: id || null
            },
            () => {}
        );
        this.fetchInfo();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // this.fetchInfo()
        const hidePayment = app.globalData.config['mp.hidePayment']; // console.log(hidePayment)

        if (hidePayment == '1') {
            this.setData({
                hidePayment: true
            });
        }
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
    onPullDownRefresh: function () {},
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: 'TaklipNama',
            path: '/pages/template/detail?id=' + this.id
        };
    },
    onShareTimeline() {
        return {
            title: 'TaklipNama',
            query: 'id=' + this.id
        };
    },
    methods: {
        async fetchInfo() {
            const { id } = this;

            if (!id) {
                uni.redirectTo({
                    url: '/pages/error/404'
                });
                return;
            }

            try {
                const data = await tempApi.fetchTemplate({
                    id: id
                });

                if (data == null) {
                    uni.redirectTo({
                        url: '/pages/error/404'
                    });
                    return;
                }

                data.maskImageUrl = data.imageUrl + '?x-oss-process=style/watermask';

                if (data.price) {
                    data.priceStr = (data.price / 100).toFixed(2);
                }

                this.setData({
                    info: data
                });
            } catch (e) {
                console.log(e);
                uni.redirectTo({
                    url: '/pages/error/500'
                });
            }
        },

        handleCreate() {
            if (!app.globalData.checkAuth()) {
                return;
            }

            uni.navigateTo({
                url: '/pages/my/invitation/edit-data?tempId=' + this.id + '&mode=create'
            });
        }
    }
};
</script>
<style>
@import './detail.css';
</style>
