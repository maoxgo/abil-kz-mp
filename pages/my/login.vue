<template>
    <!-- pages/my/login.wxml -->
    <view class="container">
        <view class="userinfo">
            <block calss="userinfo-opendata">
                <view class="userinfo-avatar">
                    <open-data type="userAvatarUrl"></open-data>
                </view>
                <open-data type="userNickName"></open-data>
            </block>
        </view>
        <view class="bottom-bar">
            <van-button type="primary" size="large" @tap.native="handleWxAuth">微信授权登录</van-button>
        </view>

        <!-- <view class="usermotto">
    <text class="user-motto">{{motto}}</text>
  </view> -->
    </view>
</template>

<script>
// pages/my/login.js
import * as myApi from '../../api/my';
const app = getApp();
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
        async handleWxAuth() {
            uni.showLoading({
                title: '登录中',
                mask: true
            });

            try {
                // 获取用户信息
                const res1 = await wx.getUserProfile({
                    lang: 'zh_CN',
                    desc: '用户登录注册'
                });
                console.log(res1);

                if (!res1 || res1.errMsg !== 'getUserProfile:ok' || !res1.userInfo) {
                    console.error('获取用户资料失败');
                    return;
                }

                const userInfo = res1.userInfo; // 获取用户code

                const res2 = await wx.login({
                    timeout: 3000
                });
                console.log(res2);

                if (res2 && res2.errMsg === 'login:ok' && res2.code) {
                    // 服务器端登录注册
                    const data = await myApi.wxAuth({
                        code: res2.code,
                        avatar: userInfo.avatarUrl,
                        nickname: userInfo.nickName
                    }); // console.log(data)

                    uni.setStorageSync('access_token', data.accessToken);
                    app.globalData.accessToken = data.accessToken;
                    const info = await app.globalData.fetchInfo();

                    if (info && !info.tel) {
                        uni.redirectTo({
                            url: '/pages/my/bindingTel?sessionKey=' + data.sessionKey
                        });
                    } else {
                        this.goBack();
                    }
                } else {
                    console.error('微信授权登录失败');
                }
            } catch (error) {
                console.error(error);
                uni.showToast({
                    title: '微信授权登录失败',
                    icon: 'error'
                });
            }

            uni.hideLoading({
                success: (res) => {}
            });
        },

        goBack() {
            const pages = getCurrentPages();

            if (!pages || pages.length <= 1) {
                uni.reLaunch({
                    url: '/pages/index/index'
                });
            } else {
                uni.navigateBack({
                    delta: 1
                });
            }
        },

        handleWxAuthOld() {
            uni.getUserProfile({
                lang: 'zh_CN',
                desc: '用户登录注册',

                success(res1) {
                    console.log(res1);

                    if (!res1 || res1.errMsg !== 'getUserProfile:ok' || !res1.userInfo) {
                        console.error('获取用户资料失败');
                        return;
                    }

                    const userInfo = res1.userInfo;
                    uni.login({
                        timeout: 3000,

                        success(res2) {
                            console.log(res2);

                            if (res2 && res2.errMsg === 'login:ok' && res2.code) {
                                // 服务器端登录注册
                                myApi
                                    .wxAuth({
                                        code: res2.code,
                                        avatar: userInfo.avatarUrl,
                                        nickname: userInfo.nickName
                                    })
                                    .then((data) => {
                                        // console.log(data)
                                        uni.setStorageSync('access_token', data.accessToken);
                                        return app.globalData.fetchInfo();
                                    })
                                    .then(() => {
                                        uni.reLaunch({
                                            url: '/pages/index/index'
                                        });
                                    })
                                    .catch((e) => {
                                        console.error(e);
                                    });
                            } else {
                                console.error('微信授权登录失败');
                            }
                        },

                        fail(res) {
                            console.error(res);
                        }
                    });
                },

                fail(res) {
                    console.error(res);
                }
            });
        }
    }
};
</script>
<style>
@import './login.css';
</style>
