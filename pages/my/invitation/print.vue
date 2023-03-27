<template>
    <view>
        <!-- pages/my/invitation/print.wxml -->
        <!-- pages/my/invitation/guest-list.wxml -->
        <scroll-view v-if="goods" class="container">
            <view class="main-container">
                <van-card
                    v-if="invitation"
                    :title="goods.title"
                    :thumb="invitation.imageUrl"
                    thumb-mode="aspectFill"
                    :desc="goods.descr"
                    :price="goods.unitPrice / 100"
                    custom-class="van-card"
                >
                    <view class="van-card__tags" slot="tags">
                        <van-tag plain type="success">包邮</van-tag>
                    </view>
                    <view class="van-card__num" style="" slot="num">
                        <!-- <text>购买</text> -->
                        <van-stepper style="" :value="quantity" async-change @change="handleQuantityChange" integer step="1" min="1" max="99" />
                        <text>{{ goods.unit }}</text>
                    </view>
                </van-card>

                <view class="address-header">
                    <view class="address-header-title">收货人信息</view>
                    <view class="address-header-right">
                        <van-button type="primary" size="small" plain @tap.native="handleGetReceiver">一键获取</van-button>
                    </view>
                    <view style="clear: both; height: 0"></view>
                </view>
                <van-cell-group style="">
                    <van-field
                        :value="receiver.name"
                        data-field="name"
                        required
                        clearable
                        placeholder="收货人姓名"
                        maxlength="20"
                        @change="formInputChange($event, { field: 'name' })"
                    />
                    <van-field
                        :value="receiver.phone"
                        data-field="phone"
                        required
                        clearable
                        placeholder="收货人手机号"
                        maxlength="20"
                        @change="formInputChange($event, { field: 'phone' })"
                    />
                    <van-field
                        :value="receiver.address"
                        data-field="address"
                        required
                        clearable
                        autosize
                        type="textarea"
                        placeholder="收货人地址"
                        @change="formInputChange($event, { field: 'address' })"
                    />
                </van-cell-group>
            </view>
            <view class="bottom-bar">
                <!-- <van-button class="bottom-button" block plain >返回</van-button> -->
                <view class="bottom-item bottom-item-price">
                    ￥
                    <text>{{ totalPrice }}</text>
                </view>
                <van-button class="bottom-item" block type="primary" @tap.native="handleSumbit">下单</van-button>
            </view>
            <wxml-to-canvas class="canvas-widget" id="preview-canvas" :width="width" :height="height"></wxml-to-canvas>
        </scroll-view>
    </view>
</template>

<script>
// pages/my/invitation/print.js
import * as myInvitationApi from '../../../api/myInvitation';
import * as myInvitationPrintApi from '../../../api/myInvitationPrint';
const app = getApp();
export default {
    components: {
    },
    data() {
        return {
            invitation: null,
            goods: null,
            quantity: 1,

            // totalPrice: 0,
            receiver: {
                name: '',
                phone: '',
                address: ''
            },

            id: '',
            totalPrice: '',
            width: 0,
            height: 0
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
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
        updateTotalPrice() {
            const { quantity, goods } = this;

            if (quantity && goods) {
                this.setData({
                    totalPrice: ((quantity * goods.unitPrice) / 100).toFixed(2)
                });
            }
        },

        async fetchInfo() {
            if (!app.globalData.checkAuth()) {
                return;
            }

            const { id } = this;
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
                    invitation: data
                }); // 获取商品信息

                const goods = await myInvitationPrintApi.fetchGoods();

                if (!goods) {
                    uni.showToast({
                        title: '获取商品信息失败',
                        icon: 'error'
                    });
                    return;
                }

                this.setData({
                    goods: goods
                });
                this.updateTotalPrice();
                uni.hideLoading({
                    success: (res) => {}
                });
            } catch (error) {
                console.log(error);
                uni.showToast({
                    title: '加载失败',
                    icon: 'error'
                });
            }
        },

        async handleSumbit() {
            console.log('submit');
            const { goods, quantity, receiver, invitation } = this;

            if (!receiver.name || !receiver.phone || !receiver.address) {
                uni.showToast({
                    title: '请完善收货信息',
                    icon: 'error'
                });
                return;
            }

            try {
                uni.showLoading({
                    title: '处理中',
                    mask: true
                });
                const [err, res1] = await uni.login();
				if (err) {
					throw err
				}
                const data = await myInvitationPrintApi.createPrintOrder({
                    authCode: res1.code,
                    goodsId: goods.id,
                    invitationId: invitation.id,
                    quantity: quantity,
                    receiverName: receiver.name,
                    receiverPhone: receiver.phone,
                    receiverAddress: receiver.address
                });
                console.log(data);
                uni.hideLoading({
                    success: (res) => {}
                });
                const [err3,res3] = await uni.requestPayment({
                    nonceStr: data.nonceStr,
                    package: data.packageValue,
                    paySign: data.paySign,
                    timeStamp: data.timeStamp,
                    signType: data.signType
                });
				if (err3) {
					throw err3
				}
                uni.showModal({
                    title: '下单成功',
                    content: '平台客服稍后会主动联系您，点击确认返回上一页',
                    showCancel: false,
                    success: () => {
                        uni.reLaunch({
                            url: '/pages/my/invitation/list'
                        });
                    }
                });
            } catch (error) {
				console.error(error)
			}
        },

        handleQuantityChange(e) {
            this.setData({
                quantity: e.detail
            });
            this.updateTotalPrice();
        },

        formInputChange(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            // console.log(e)
            const { field } = e.currentTarget.dataset;
            this[`receiver.${field}`] = e.detail;
        },

        handleGetReceiver() {
            uni.chooseAddress({
                success: (data) => {
                    console.log(data);
                    this.setData({
                        receiver: {
                            name: data.userName,
                            phone: data.telNumber,
                            address: `${data.provinceName} ${data.cityName} ${data.countyName} ${data.detailInfo}`
                        }
                    });
                }
            });
        }
    }
};
</script>
<style>
@import './print.css';
</style>
