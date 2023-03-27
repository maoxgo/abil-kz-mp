<template>
    <!-- pages/my/invitation/detail.wxml -->
    <view>
        <view class="main-content">
            <image mode="aspectFit" :src="info.needPay ? info.maskImageUrl : info.imageUrl" style="height: 100%; width: 100%"></image>
        </view>
        <view class="bottom-bar" style="">
            <van-button class="bottom-button" style="" block plain @tap.native="handleEdit"><text space="ensp">编 辑</text></van-button>
            <!-- <van-button class="bottom-button" style="" block plain bindtap="handlePreview"><text space="ensp">预  览</text></van-button> -->
            <van-button class="bottom-button" style="" block plain @tap.native="handleSave"><text space="ensp">保 存</text></van-button>
            <van-button class="bottom-button" style="" block type="primary" @tap.native="handleShare">
                <text space="ensp">分享{{ info.needPay ? '(￥' + info.priceStr + ')' : '' }}</text>
            </van-button>
        </view>
    </view>
</template>

<script>
// pages/my/invitation/detail.js
import * as myInvitationApi from '../../../api/myInvitation';
const app = getApp();
export default {
    data() {
        return {
            loading: true,

            info: {
                needPay: false,
                maskImageUrl: '',
                imageUrl: '',
                priceStr: ''
            },

            id: ''
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        const { id } = options;
        this.setData({
            id: id
        });
        this.fetchInfo();
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
        async fetchInfo() {
            if (!app.globalData.checkAuth()) {
                return;
            }

            const { id } = this;
            this.setData({
                loading: true
            });
            uni.showLoading({
                title: '加载中'
            });

            try {
                const data = await myInvitationApi.fetchInvitation({
                    id: id
                });
                console.log(data);

                if (!data) {
                    uni.reLaunch({
                        url: '/pages/error/404'
                    });
                    return;
                }

                app.globalData.filterInvitation(data);
                this.setData({
                    info: data
                });
                uni.hideLoading({
                    success: (res) => {}
                });
            } catch (error) {
                console.log(error);
                uni.showToast({
                    title: '加载失败'
                });
            }
        },

        handleEdit() {
            uni.navigateTo({
                url: '/pages/my/invitation/edit-data?id=' + this.id
            });
        },

        handlePreview() {
            const { imageUrl } = this.info; // wx.showShareImageMenu({
            //   path: this.data.info.imageUrl,
            //   success() {
            //     console.log('success')
            //   },
            //   fail(e) {
            //     console.log(e)
            //   }
            // })

            const tmpPath = `/inv/${this.id}/`;
            uni.downloadFile({
                url: imageUrl,

                success(res) {
                    console.log(res);
                }
            }); // wx.saveFile({
            //   tempFilePath: imageUrl,
            //   success(res) {
            //     console.log(res)
            //   },
            //   fail(e) {
            //     console.log(e)
            //   }
            // })

            uni.previewImage({
                urls: [imageUrl],
                showmenu: true,

                success(res) {
                    console.log('success');
                    console.log(res);
                }
            });
        },

        handleShare(e) {
            if (app.globalData.checkInvitationPay(this.info, this.fetchInfo)) {
                return;
            }

            uni.navigateTo({
                url: '/pages/my/invitation/guest-list?invitationId=' + this.id
            });
        },

        async handleSave() {
            if (app.globalData.checkInvitationPay(this.info, this.fetchInfo)) {
                return;
            }

            const { imageUrl } = this.info;
            uni.showLoading({
                title: '保存中'
            }); // try {
            //   const result = await wx.downloadFile({
            //     url: imageUrl,
            //   })
            //   console.log(result)
            //   const result1 = await wx.saveImageToPhotosAlbum({
            //     filePath: result.tempFilePath,
            //   })
            //   wx.hideLoading({
            //     success: (res) => {},
            //   })
            //   wx.showToast({
            //     title: '保存成功',
            //     icon: 'success'
            //   })
            // } catch(err) {
            //   wx.hideLoading({
            //     success: (res) => {},
            //   })
            //   wx.showToast({
            //     title: '保存失败',
            //     icon: 'error'
            //   })
            //   console.error(err)
            // }

            uni.downloadFile({
                url: imageUrl,

                success(result) {
                    uni.saveImageToPhotosAlbum({
                        filePath: result.tempFilePath,

                        success() {
                            uni.hideLoading({
                                success: (res) => {}
                            });
                            uni.showToast({
                                title: '保存成功',
                                icon: 'success'
                            });
                        },

                        fail(err) {
                            console.log(err);
                            uni.hideLoading({
                                success: (res) => {}
                            });
                            uni.showToast({
                                title: '保存失败',
                                icon: 'error'
                            });
                        }
                    });
                },

                fail(err) {
                    console.log(err);
                    uni.hideLoading({
                        success: (res) => {}
                    });
                    uni.showToast({
                        title: '保存失败',
                        icon: 'error'
                    });
                }
            });
        },

        checkInvitationPay(item) {
            if (item.price <= 0) {
                return false;
            }

            if (item.payStatus == 40) {
                return false;
            }

            uni.showModal({
                confirmText: '前往付款',
                content: '￥' + (item.price / 100).toFixed(2),
                showCancel: true,
                title: '您需要付费后才能是该功能',
                success: async (result) => {
                    uni.showLoading({
                        title: '生成订单中'
                    });

                    try {
                        const res1 = await uni.login();
                        const data = await myInvitationApi.createOrder({
                            id: item.id,
                            authCode: res1.code
                        });
                        console.log(data);
                        uni.hideLoading({
                            success: (res) => {}
                        });
                        const res3 = await uni.requestPayment({
                            nonceStr: data.nonceStr,
                            package: data.packageValue,
                            paySign: data.paySign,
                            timeStamp: data.timeStamp,
                            signType: data.signType
                        });
                        uni.showLoading({
                            title: '支付成功，5秒后刷新页面'
                        });
                        setTimeout(() => {
                            this.fetchInfo();
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
                    }
                },
                fail: (res) => {},
                complete: (res) => {}
            });
            return true;
        }
    }
};
</script>
<style>
@import './detail.css';
</style>
