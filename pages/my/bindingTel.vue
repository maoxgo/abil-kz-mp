<template>
    <!-- pages/my/bindingTel.wxml -->
    <view class="container">
        <view class="userinfo">
            <text>为了获得更好的服务，请绑定手机号</text>
        </view>
        <view class="bottom-bar">
            <van-button type="primary" size="large" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取并绑定手机号</van-button>
        </view>

        <!-- <view class="usermotto">
    <text class="user-motto">{{motto}}</text>
  </view> -->
    </view>
</template>

<script>
// pages/my/bindingTel.js
const app = getApp();
import * as myApi from '../../api/my';
export default {
    data() {
        return {
            sessionKey: null
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        const { sessionKey } = options;

        if (!sessionKey) {
            this.goHome();
            return;
        } else {
            this.setData({
                sessionKey: sessionKey
            });
        }

        const userInfo = app.globalData.userInfo;

        if (!userInfo || userInfo.tel) {
            this.goHome();
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},
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
    onShareAppMessage: function () {},
    methods: {
        goHome() {
            uni.reLaunch({
                url: '/pages/index/index'
            });
        },

        async getPhoneNumber(e) {
            console.log(e);
            uni.showLoading({
                title: '绑定中'
            });

            try {
                await myApi.wxBindingTel({ ...e.detail, sessionKey: this.sessionKey });
                uni.showToast({
                    title: '绑定成功'
                });
                this.goHome();
            } catch (error) {
                console.error(error);
                uni.showToast({
                    title: '绑定失败'
                });
            }

            uni.hideLoading({
                success: (res) => {}
            });
        }
    }
};
</script>
<style>
@import './bindingTel.css';
</style>
