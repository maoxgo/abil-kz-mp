<template>
    <!-- pages/my/my.wxml -->
    <view class="container">
        <view class="userinfo">
            <block calss="userinfo-opendata">
                <view class="userinfo-avatar" >
                <!-- <image class="userinfo-avatar" mode="aspectFit" :src="userInfo.avatar" /> -->
					<open-data type="userAvatarUrl"></open-data>
                </view>
                <open-data type="userNickName"></open-data>
                <!-- <text>{{ userInfo.nickname }}</text> -->
            </block>
        </view>
        <view style="margin-top: 10%">
            <mp-cells style="font-size: small">
                <mp-cell link @tap.native="goToInvitation" value="我的请帖"></mp-cell>
                <mp-cell link @tap.native="goToCoupons" value="我的优惠券"></mp-cell>
                <!-- <mp-cell link @tap.native="goToMall" value="婚礼用品"></mp-cell> -->
                <mp-cell value="客服消息" open-type="contact">
                    <van-button slot="footer" size="small" type="primary" plain custom-style="border:0px;display:inline-block" open-type="contact">
                        <van-icon name="service-o" size="30px" />
                    </van-button>
                </mp-cell>
                <mp-cell link value="联系我们" @tap.native="handleMakePhoneCell">
                    <!-- <van-icon slot="footer" name="phone-o" size="30px" /> -->
                </mp-cell>
            </mp-cells>
        </view>

        <!-- <view class="usermotto">
    <text class="user-motto">{{motto}}</text>
  </view> -->
    </view>
</template>

<script>
// pages/my/my.js
const app = getApp();
export default {
    components: {
    },
    data() {
        return {
            motto: 'Hello World',
            userInfo: {
                nickname: '未登录',
                avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
            },
            hasUserInfo: false,
            canIUse: uni.canIUse('button.open-type.getUserInfo'),
            canIUseGetUserProfile: false,
            canIUseOpenData: uni.canIUse('open-data.type.userAvatarUrl') && uni.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // wx.getUserInfo({
        // }).then(data => {
        //   console.log(data)
        // })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // console.log(app.globalData)
        setTimeout(() => {
            if (app.globalData.userInfo) {
                this.setData({
                    userInfo: app.globalData.userInfo
                });
            }
        }, 1000);
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
    onShareAppMessage: function () {},
    methods: {
        handleMakePhoneCell: function () {
            uni.makePhoneCall({
                phoneNumber: '13209090144'
            });
        },

        goToInvitation: function () {
            uni.switchTab({
                url: '/pages/my/invitation/list'
            });
        },

        goToMall: function () {
            uni.navigateToMiniProgram({
                appId: 'wxc6b466d67e369e9e'
            });
        },

        goToCoupons: function () {
            uni.navigateTo({
                url: '/pages/my/coupons/coupons'
            });
        }
    }
};
</script>
<style>
@import './my.css';
</style>
