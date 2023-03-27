<template>
    <!-- pages/error/500.wxml -->
    <view style="display: flex; flex-direction: column; height: 100vh; align-items: center; justify-content: center">
        <text style="font-size: large; margin: 0 40rpx 100rpx">抱歉，您遇到了一个错误，请稍后再试</text>
        <button type="primary" @tap="handleGoHome">返回主页</button>
    </view>
</template>

<script>
// pages/error/500.js
export default {
    data() {
        return {};
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {},
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
        handleGoHome() {
            console.log('占位：函数 handleGoHome 未声明');
        }
    }
};
</script>
<style>
@import './500.css';
</style>
