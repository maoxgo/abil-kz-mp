<template>
    <view>
        <!-- pages/my/invitation/guest-list.wxml -->
        <scroll-view style="container">
            <view class="main-container">
                <van-card
                    v-if="invitation"
                    :title="extendInfo.PARTY_NAME || extendInfo.BOTH_NAME || ''"
                    :thumb="invitation.imageUrl"
                    thumb-mode="aspectFill"
                    :tag="invitation.cateName"
                >
                    <view class="van-card__desc" slot="desc">
                        <view v-if="version == 'v2' && extendInfo.WEDDING_ADDRESS" style="cloor: grey" class="">
                            <mp-icon icon="location" type="outline" color="grey" size="14"></mp-icon>
                            {{ extendInfo.WEDDING_ADDRESS }}
                        </view>
                        <view v-if="version == 'v1' && extendInfo.weddingAddress" style="color: grey" class="">
                            <mp-icon icon="location" type="outline" color="grey" size="14"></mp-icon>
                            {{ invitation.weddingAddress }}
                        </view>

                        <view v-if="version == 'v2' && extendInfo.WEDDING_TIME" style="color: grey" class="">
                            <mp-icon icon="time" type="outline" color="grey" size="14"></mp-icon>
                            {{ extendInfo.WEDDING_TIME }}
                        </view>
                        <view v-if="version == 'v1' && extendInfo.weddingTime" style="color: grey" class="">
                            <mp-icon icon="time" type="outline" color="grey" size="14"></mp-icon>
                            {{ invitation.weddingTime }}
                        </view>
                    </view>
                </van-card>
                <view class="score-bar">
                    <text class="score-bar-label">积分: {{ currScore }}（每次分享使用1积分）</text>
                    <van-button class="score-bar-button" size="mini" type="danger" plain @tap.native="handlePayScore">充值</van-button>
                </view>
                <van-cell-group title="嘉宾名单">
                    <van-cell :title="item.guestName" v-for="(item, index) in rows" :key="item.id">
                        <view>
                            <!-- <van-button class="guest-button" size="mini" data-item="{{item}}" bindtap="handlePreviewV2">预览</van-button>
          <van-button class="guest-button" size="mini" data-item="{{item}}" bindtap="handleSave">保存</van-button> -->
                            <van-button class="guest-button" size="mini" type="primary" plain :data-item="item" @tap.native="handleShareV2($event, { item })">分享</van-button>
                        </view>
                    </van-cell>
                </van-cell-group>
            </view>
            <view class="bottom-bar">
                <!-- <van-button class="bottom-button" block plain >返回</van-button> -->
                <van-button class="bottom-button" block type="primary" @tap.native="handleAdd">添加嘉宾</van-button>
            </view>
            <wxml-to-canvas class="canvas-widget" id="preview-canvas" :width="width" :height="height"></wxml-to-canvas>
        </scroll-view>
    </view>
</template>

<script>

import wxmlToCanvas from '@/wxcomponents/wxml-to-canvas'
import * as myInvitationShareApi from '../../../api/myInvitationShare';
import * as myInvitationApi from '../../../api/myInvitation';
import { createPreviewView, createPreviewStyle, createImage } from '../../../utils/qkUtils';
import { generateHtml } from '../../../utils/templateUtils';
const app = getApp();
export default {
    components: {
		wxmlToCanvas
    },
    data() {
        return {
            invitationId: null,
            rows: [],
            pageNum: 1,
            pageSize: 20,
            hasMore: true,
            invitation: null,
            originData: {},
            currentPage: {
                elements: []
            },
            width: 375,
            height: 532,
            extendData: {},
            extendInfo: {
                PARTY_NAME: '',
                BOTH_NAME: '',
                WEDDING_ADDRESS: '',
                weddingAddress: '',
                WEDDING_TIME: '',
                weddingTime: ''
            },
            guestElement: null,
            version: 'v2',
            customTypes: [],
            currScore: 0
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        const { invitationId } = options;
        this.setData({
            invitationId
        });
        this.fetchInvitation();
        this.fetchScore();
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.canvas = this.$mp.page.selectComponent('#preview-canvas').$vm;
        const interval = setInterval(() => {
            console.log(Date.now());
            const types = app.globalData.customTypes;
            console.log(types);

            if (types && types.length > 0) {
                this.setData({
                    customTypes: [...types]
                });
                clearInterval(interval);
            }
        }, 500);
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
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
            let { pageNum, pageSize, rows, hasMore, invitationId } = this;

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
                invitationId
            };

            try {
                const res = await myInvitationShareApi.listGuest({ ...query });

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

        async fetchInvitation() {
            try {
                const data = await myInvitationApi.fetchInvitation({
                    id: this.invitationId
                });

                if (!data || !data.originData) {
                    throw new Error('原始数据出错，该请帖无法使用');
                }

                const extendData = JSON.parse(data.extendData) || {};
                const originData = JSON.parse(data.originData) || {};

                if (originData == null || !originData.pages || originData.pages.length == 0) {
                    throw new Error('原始数据出错，该请帖无法使用');
                }

                const extendInfo = JSON.parse(data.extendInfo);
                const currentPage = originData.pages[0];
                console.log(currentPage);
                let guestElement = null;

                for (let i = 0; i < currentPage.elements.length; i++) {
                    const element = currentPage.elements[i];

                    if (element && element.propsValue && element.propsValue.isCustom && element.propsValue.customType == 'GUEST_NAME') {
                        guestElement = element;
                        break;
                    }
                }

                app.globalData.filterInvitation(data);
                this.setData({
                    invitation: data,
                    originData,
                    extendData,
                    currentPage,
                    extendInfo: extendInfo || {
                        femaleName: data.femaleName,
                        maleName: data.maleName,
                        weddingAddress: data.weddingAddress,
                        weddingTime: data.weddingTime
                    },
                    version: extendInfo ? 'v2' : 'v1',
                    width: originData.width || this.width,
                    height: originData.height || this.height,
                    guestElement
                });
                app.globalData.loadFonts(currentPage);
            } catch (err) {
                console.error(err);
                uni.showToast({
                    title: '获取请帖信息失败',
                    icon: 'error'
                });
            }
        },

        handleAdd() {
            uni.navigateTo({
                url: '/pages/my/invitation/guest-add?invitationId=' + this.invitationId
            });
        },

        async handleSave(e) {
            const item = e.target.dataset.item;

            if (!item) {
                return;
            }

            uni.showLoading({
                title: '加载中'
            });

            try {
                const tempFilePath = await this.createImage(item);
                uni.saveImageToPhotosAlbum({
                    filePath: tempFilePath,
                    success: () => {
                        console.log('save success');
                        myInvitationShareApi
                            .increaseSaveCount({
                                id: item.id
                            })
                            .then(() => {})
                            .catch(console.error);
                    }
                });
            } catch (e) {
                console.log(e);
                uni.showToast({
                    title: '加载失败',
                    icon: 'error'
                });
            }

            uni.hideLoading({
                success: (res) => {}
            });
        },

        async handlePreview(e) {
            const item = e.target.dataset.item;

            if (!item) {
                return;
            }

            uni.showLoading({
                title: '加载中'
            });

            try {
                const tempFilePath = await this.createImage(item);
                uni.previewImage({
                    urls: [tempFilePath],
                    showmenu: true
                });
            } catch (e) {
                console.log(e);
                uni.showToast({
                    title: '加载失败',
                    icon: 'error'
                });
            }

            uni.hideLoading({
                success: (res) => {}
            });
        },

        async handlePreviewV2(e) {
            const item = e.target.dataset.item;

            if (!item) {
                return;
            }

            uni.showLoading({
                title: '加载中'
            });

            try {
                const base64 = await this.htmlToImageBase64(item);
                uni.previewImage({
                    urls: ['data:image/jpeg;base64,' + base64],
                    showmenu: true
                });
            } catch (e) {
                console.log(e);
                uni.showToast({
                    title: '加载失败',
                    icon: 'error'
                });
            }

            uni.hideLoading({
                success: (res) => {}
            });
        },

        async handleShare(e) {
            const item = e.target.dataset.item;

            if (!item) {
                return;
            }

            if (!uni.canIUse('showShareImageMenu')) {
                // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
                uni.showModal({
                    title: '提示',
                    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。或者在预览界面长按图片后操作。'
                });
                return;
            }

            uni.showLoading({
                title: '加载中'
            });

            try {
                const tempFilePath = await this.createImage(item);
                uni.showShareImageMenu({
                    path: tempFilePath,
                    success: () => {
                        console.log('share success');
                        myInvitationShareApi
                            .increaseShareCount({
                                id: item.id
                            })
                            .then(() => {})
                            .catch(console.error);
                    }
                });
            } catch (e) {
                console.log(e);
                uni.showToast({
                    title: '加载失败',
                    icon: 'error'
                });
            }

            uni.hideLoading({
                success: (res) => {}
            });
        },

        async handleShareV2(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            const item = e.target.dataset.item;

            if (!item) {
                return;
            }

            if (!uni.canIUse('showShareImageMenu')) {
                // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
                uni.showModal({
                    title: '提示',
                    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。或者在预览界面长按图片后操作。'
                });
                return;
            }

            if (this.currScore <= 0) {
                uni.showModal({
                    title: '积分不足，请充值',
                    confirmText: '前往充值',
                    showCancel: true,
                    success: (result) => {
                        if (result.cancel) {
                            return;
                        }

                        this.handlePayScore();
                    }
                });
                return;
            }

            uni.showLoading({
                title: '加载中'
            });

            try {
                const base64 = await this.htmlToImageBase64(item); // console.log(bas64)

                const fm = uni.getFileSystemManager(); // console.log(wx.env)
                // const filePath = wx.env.USER_DATA_PATH + '/' +Date.now()+'.jpg'
				
                const filePath = wx.env.USER_DATA_PATH + '/share-image.jpg';
                console.log(filePath);
                await fm.writeFileSync(filePath, base64, 'base64');
                uni.showShareImageMenu({
                    path: filePath,
                    success: () => {
                        console.log('share success'); // myInvitationShareApi.increaseShareCount({
                        //   id: item.id
                        // }).then(() =>{}).catch(console.error)
                    },
                    fail: (e) => {
                        console.log(e);
                    },
                    complete: () => {
                        this.fetchScore();
                    }
                }); // wx.downloadFile({
                //   url: 'data:image/jpeg;base64,'+base64,
                //   success: (res) => {
                //     console.log(res)
                //   },
                //   fail: (e) =>{
                //     console.error(e)
                //   }
                // })
                // wx.saveFile({
                //   tempFilePath: 'tempFilePath',
                // })({
                //   url: 'data:image/jpeg;base64,'+bas64,
                //   success: result => {
                //     wx.showShareImageMenu({
                //       path: result.tempFilePath,
                //       success: () => {
                //         console.log('share success')
                //         // myInvitationShareApi.increaseShareCount({
                //         //   id: item.id
                //         // }).then(() =>{}).catch(console.error)
                //       }
                //     })
                //   },
                //   fail:() => {
                //     console.error('download fail')
                //   }
                // })

                uni.hideLoading({
                    success: (res) => {}
                });
            } catch (e) {
                uni.hideLoading({
                    success: (res) => {}
                });
                console.log(e);
                uni.showToast({
                    title: '加载失败',
                    icon: 'error'
                });
            }
        },

        async createImage(item) {
            let { originData, currentPage, extendData, extendInfo, customTypes } = this;
            extendInfo = { ...extendInfo, GUEST_NAME: item.guestName };
            const view = createPreviewView(extendInfo, originData, currentPage, extendData, true, customTypes);
            const style = createPreviewStyle(extendInfo, originData, currentPage, extendData); // console.log(view)

            const res = await this.canvas.renderToCanvas({
                wxml: view,
                style
            }); // console.log(res)

            const res1 = await this.canvas.canvasToTempFilePath(); // console.log(res1)

            return res1.tempFilePath;
        },

        async htmlToImageBase64(item) {
            let { originData, currentPage, extendData, extendInfo, customTypes, width, height } = this;
            extendInfo = { ...extendInfo, GUEST_NAME: item.guestName };
            const fonts = app.globalData.fetchFonts(currentPage); // console.log(fonts)

            const html = generateHtml(extendInfo, originData, currentPage, extendData, true, customTypes, fonts);
            const base64 = await myInvitationShareApi.buildShareImage({
                html,
                width: width,
                height: height,
                scale: 3,
                shareId: item.id
            }); // console.log(base64)

            return base64;
        },

        async handlePayScore() {
            const item = await myInvitationShareApi.fetchScoreGoods({});

            if (!item) {
                return;
            }

            uni.showModal({
                confirmText: '前往支付',
                showCancel: true,
                title: `支付￥${(item.unitPrice / 100).toFixed(2)}元`,
                content: '购买100积分，可用于分享请帖',
                success: async (result) => {
                    if (result.cancel) {
                        return;
                    }

                    uni.showLoading({
                        title: '生成订单中',
                        mask: true
                    });

                    try {
                        const [err, res1] = await uni.login();
						if (err) {
							throw err
						}
                        const data = await myInvitationShareApi.createScoreOrder({
                            authCode: res1.code,
                            goodsId: item.id,
                            quantity: 1,
                            receiverName: '',
                            receiverPhone: '',
                            receiverAddress: ''
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
                        uni.showLoading({
                            title: '订单处理中',
                            mask: true
                        });
                        setTimeout(() => {
                            uni.hideLoading({
                                success: (res) => {}
                            });
                            this.fetchScore();
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
        },

        async fetchScore() {
            try {
                const data = await myInvitationShareApi.fetchScore({});
                this.setData({
                    currScore: data.score || 0
                });
            } catch (error) {
                console.error(error);
                uni.showToast({
                    title: '获取积分失败',
                    icon: 'error'
                });
            }
        }
    }
};
</script>
<style>
@import './guest-list.css';
</style>
