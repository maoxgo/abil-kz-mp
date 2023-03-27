<template>
    <view>
        <!-- pages/my/invitation/guest-add.wxml -->
        <scroll-view style="height: 100%; width: 100%; position: absolute">
            <view class="main-container">
                <!-- <form catchsubmit="handSave"> -->
                <textarea
                    style="margin: 16px auto; width: 700rpx; height: 90vh"
                    name="guestNameList"
                    rows="40"
                    placeholder="请输入嘉宾姓名，可批量输入，每行1个嘉宾，最多20个"
                    confirm-type="return"
                    @input="handleNameChange"
                    :value="guestNameList"
                ></textarea>
                <!-- </form> -->
            </view>
            <view class="bottom-bar">
                <!-- <van-button class="bottom-button" block plain >返回</van-button> -->

                <van-button class="bottom-button" block type="primary" @tap.native="handleSave">保存</van-button>
            </view>
        </scroll-view>
    </view>
</template>

<script>
// pages/my/invitation/guest-add.js
import * as myInvitationShareApi from '../../../api/myInvitationShare';
export default {
    data() {
        return {
            guestNameList: '',
            invitationId: null
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        const { invitationId } = options;
        this.setData({
            invitationId
        });
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
        async handleSave(e) {
            // console.log(e)
            // console.log(this.data.guestNameList)
            const { guestNameList, invitationId } = this;
            const rows = guestNameList
                .split(/[(\r\n)\r\n]+/) // 根据换行符获得数组
                .map((item) => item.trim()) // 去除头尾空格
                .filter((item) => item != ''); // 过滤空行

            console.log(rows);
            uni.showLoading({
                title: '保存中'
            });

            try {
                const data = await myInvitationShareApi.batchAddGuest({
                    invitationId,
                    guestNameList: rows
                });
                uni.navigateBack({
                    delta: 1
                });
            } catch (err) {
                console.log(err);
                uni.showToast({
                    title: '保存失败'
                });
            }

            uni.hideLoading({
                success: (res) => {}
            });
        },

        handleNameChange(e) {
            // console.log(e)
            this.setData({
                guestNameList: e.detail.value
            });
        }
    }
};
</script>
<style>
@import './guest-add.css';
</style>
