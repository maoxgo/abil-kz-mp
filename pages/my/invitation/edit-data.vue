<template>
    <view>
        <!-- pages/my/invitation/edit-data.wxml -->

        <view style="">
            <view class="main-content">
                <view id="edit-panel" :style="'width:' + (width * 2 + 'rpx') + ';height:' + (height * 2 + 'rpx') + '; background-color:white;font-family: sans-serif;'">
                    <block v-for="(item, index) in currentPage.elements" :key="item.uuid">
                        <qk-image v-if="item.elName == 'qk-image'" :item="item" :extend-data="extendData" @change="handleImageChange" />

                        <qk-text v-if="item.elName == 'qk-text'" :item="item" :info="extendInfo" :customTypes="customTypes" />
                    </block>
                    <image v-if="needPay && !hidePayment" mode="aspectFill" class="image-mask" src="/static/assets/img/watermask2.png"></image>
                    <!-- <template v-for="{{currentPage.elements}}" is="{{elName}}" element="{{item.element}}" >
      </template> -->
                </view>
                <!-- <image mode="aspectFit" src="{{info.imageUrl}}" style="height: 100%;width:100%;"></image> -->
            </view>
            <view class="bottom-bar" style="">
                <van-button class="bottom-button" style="" :disabled="loading" block plain @tap.native="handleEditInfo"><text space="ensp">编辑信息</text></van-button>
                <!-- <van-button class="bottom-button" style="" disabled="{{loading}}" block plain bindtap="handlePreviewV2"><text space="ensp">预  览</text></van-button> -->
                <van-button class="bottom-button" style="" :disabled="loading" block type="primary" @tap.native="handleSaveV2"><text space="ensp">保 存</text></van-button>
            </view>
            <wxml-to-canvas class="canvas-widget" id="preview-canvas" :width="width" :height="height"></wxml-to-canvas>
        </view>

        <van-overlay :show="showEditInfo" position="center" z-index="1000" style="z-index: 1000">
            <edit-info :info="extendInfo" :customTypes="customTypes" @change="handleInfoChange" />
        </van-overlay>

        <image-cut id="image-cut"></image-cut>
    </view>
</template>

<script>
import wxmlToCanvas from '@/wxcomponents/wxml-to-canvas'
import qkImage from './component/qk-image';
import qkText from './component/qk-text';
import editInfo from './component/edit-info';
import imageCut from './component/image-cut';
// pages/my/invitation/edit-data.js
import * as myInvitationApi from '../../../api/myInvitation';
import { createPreviewView, createPreviewStyle, createImage } from '../../../utils/qkUtils';
import * as tempApi from '../../../api/template';
import { generateHtml } from '../../../utils/templateUtils';
const app = getApp();
export default {
    components: {
        qkImage,
        qkText,
        editInfo,
        imageCut,
		wxmlToCanvas
    },
    data() {
        return {
            id: null,
            loading: true,
            info: {},
            originData: {},

            currentPage: {
                elements: []
            },

            width: 375,
            height: 532,
            extendData: {},
            extendInfo: {},
            showEditInfo: false,
            mode: '',
            needPay: false,
            customTypes: [],
            hidePayment: false,
            fonts: [],
            tempId: ''
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { id, tempId, mode } = options;

        if (id) {
            this.setData({
                id: id,
                mode: 'edit'
            });
            this.fetchInfo();
        } else if (tempId) {
            this.setData({
                tempId,
                mode: 'create'
            });
            this.fetchTempInfo();
        }

        this.imageCut = this.$mp.page.selectComponent('#image-cut').$vm;
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.canvas = this.$mp.page.selectComponent('#preview-canvas').$vm; // this.loadFont()

        const types = app.globalData.customTypes;

        if (types.length > 0) {
            this.setData({
                customTypes: [...types]
            });
        } else {
            const interval = setInterval(() => {
                // console.log(Date.now())
                const types = app.globalData.customTypes; // console.log(types)

                if (types.length > 0) {
                    this.setData({
                        customTypes: [...types]
                    });
                    clearInterval(interval);
                }
            }, 500);
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        app.globalData.checkAuth();
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
    onShareAppMessage: function () {},
    methods: {
        initCreate() {},
        initEdit() {},

        handleEditInfo() {
            if (this.loading) {
                return;
            }

            this.setData({
                showEditInfo: true
            });
        },

        async fetchInfo() {
            if (!app.globalData.checkAuth()) {
                return;
            }

            const { id, mode } = this;
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

                if (!data || !data.originData) {
                    throw new Error('原始数据出错，该请帖无法使用');
                }

                const originData = JSON.parse(data.originData) || {};
                const extendData = JSON.parse(data.extendData) || {};

                if (originData == null || !originData.pages || originData.pages.length == 0) {
                    throw new Error('原始数据出错，该请帖无法使用');
                }

                const currentPage = originData.pages[0];
                let extendInfo = JSON.parse(data.extendInfo || null);
                console.log(currentPage);
                const fonts = app.globalData.loadFonts(currentPage);
                this.setData({
                    info: data,
                    originData,
                    currentPage,
                    width: originData.width || this.width,
                    height: originData.height || this.height,
                    extendData,
                    extendInfo: extendInfo,
                    loading: false,
                    needPay: data.price > 0 && data.payStatus < 40,
                    fonts
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

        async fetchTempInfo() {
            const { tempId } = this;
            this.setData({
                loading: true
            });
            uni.showLoading({
                title: '加载中'
            });

            try {
                const data = await tempApi.fetchTemplate({
                    id: tempId
                });

                if (!data || !data.data) {
                    throw new Error('原始数据出错，该请帖无法使用');
                }

                const originData = JSON.parse(data.data) || {};
                const extendData = {};

                if (originData == null || !originData.pages || originData.pages.length == 0) {
                    throw new Error('原始数据出错，该请帖无法使用');
                }

                const customArr = data.customInfo.split(',');
                console.log(customArr);
                const extendInfo = customArr.reduce((prev, curr) => {
                    prev[curr] = '';
                    return prev;
                }, {});
                const currentPage = originData.pages[0];
                const fonts = app.globalData.loadFonts(currentPage);
                this.setData({
                    originData,
                    currentPage,
                    width: originData.width || this.width,
                    height: originData.height || this.height,
                    extendData,
                    extendInfo: extendInfo,
                    loading: false,
                    showEditInfo: true,
                    needPay: data.price > 0,
                    fonts
                });
                uni.hideLoading({
                    success: (res) => {}
                });
            } catch (e) {
                console.error(e);
                uni.hideLoading({
                    success: (res) => {}
                });
                uni.showToast({
                    title: '加载失败',
                    icon: 'error'
                });
            }
        },

        async handleSave() {
            if (this.loading) {
                return;
            }

            uni.showLoading({
                title: '保存中',
                mask: true
            });

            try {
                const tempImage = await this.createImage();
                const data = await myInvitationApi.uploadImage(tempImage);
                console.log(data);
                const { extendData, id, extendInfo, tempId, mode, needPay } = this;
                const { maleName, femaleName, weddingAddress, weddingTime } = extendInfo;
                let maskImage = ''; // if (needPay) {
                //   const tempMaskImage = await this.createMaskImage()
                //   const data1 = await myInvitationApi.uploadImage(tempMaskImage)
                //   maskImage = data1.path
                // }

                if (mode == 'edit') {
                    const res = await myInvitationApi.editInvitation({
                        id,
                        maleName,
                        femaleName,
                        weddingTime,
                        weddingAddress,
                        imageUrl: data.path,
                        maskImageUrl: maskImage,
                        extendData: JSON.stringify(extendData || {}),
                        extendInfo: JSON.stringify(extendInfo || {})
                    });
                } else if (mode == 'create') {
                    await myInvitationApi.createInvitation({
                        tempId: tempId,
                        femaleName,
                        maleName,
                        weddingAddress,
                        weddingTime,
                        imageUrl: data.path,
                        maskImageUrl: maskImage,
                        extendData: JSON.stringify(extendData || {}),
                        extendInfo: JSON.stringify(extendInfo || {})
                    });
                }

                uni.hideLoading({
                    success: (res) => {}
                });
                uni.reLaunch({
                    url: '/pages/my/invitation/list'
                });
            } catch (error) {
                console.log(error);
                uni.hideLoading({
                    success: (res) => {}
                });
                uni.showToast({
                    title: '保存失败',
                    icon: 'error'
                });
            }
        },

        async handleSaveV2() {
            if (this.loading) {
                return;
            }

            uni.showLoading({
                title: '保存中',
                mask: true
            });

            try {
                // const tempImage = await this.createImage()
                const data = await this.htmlToImageUrl();
                console.log(data);
                const { extendData, id, extendInfo, tempId, mode, needPay } = this;
                const { maleName, femaleName, weddingAddress, weddingTime } = extendInfo;
                let maskImage = ''; // if (needPay) {
                //   const tempMaskImage = await this.createMaskImage()
                //   const data1 = await myInvitationApi.uploadImage(tempMaskImage)
                //   maskImage = data1.path
                // }

                if (mode == 'edit') {
                    const res = await myInvitationApi.editInvitation({
                        id,
                        maleName,
                        femaleName,
                        weddingTime,
                        weddingAddress,
                        imageUrl: data.path,
                        maskImageUrl: maskImage,
                        extendData: JSON.stringify(extendData || {}),
                        extendInfo: JSON.stringify(extendInfo || {})
                    });
                } else if (mode == 'create') {
                    await myInvitationApi.createInvitation({
                        tempId: tempId,
                        femaleName,
                        maleName,
                        weddingAddress,
                        weddingTime,
                        imageUrl: data.path,
                        maskImageUrl: maskImage,
                        extendData: JSON.stringify(extendData || {}),
                        extendInfo: JSON.stringify(extendInfo || {})
                    });
                }

                uni.hideLoading({
                    success: (res) => {}
                });
                uni.reLaunch({
                    url: '/pages/my/invitation/list'
                });
            } catch (error) {
                console.log(error);
                uni.hideLoading({
                    success: (res) => {}
                });
                uni.showToast({
                    title: '保存失败',
                    icon: 'error'
                });
            }
        },

        async handlePreview() {
            if (this.loading) {
                return;
            }

            uni.showLoading({
                title: '加载中'
            });

            try {
                let tempFilePath = null;

                if (this.needPay) {
                    tempFilePath = await this.createMaskImage();
                } else {
                    tempFilePath = await this.createImage();
                }

                uni.previewImage({
                    urls: [tempFilePath]
                });
                uni.hideLoading({
                    success: (res) => {}
                });
            } catch (e) {
                uni.hideLoading({
                    success: (res) => {}
                });
                console.log(e);
                uni.showModal({
                    cancelColor: '#000000',
                    title: '错误',
                    content: e.message
                }); // wx.showToast({
                //   title: '加载失败',
                //   icon: "error"
                // })
            }
        },

        async handlePreviewV2() {
            uni.showLoading({
                title: '生成中...'
            });

            try {
                const base64 = await this.htmlToImageBase64(); // console.log(base64)

                uni.previewImage({
                    urls: ['data:image/jpeg;base64,' + base64]
                });
            } catch (error) {
                console.log(error);
            }

            uni.hideLoading({
                success: (res) => {}
            });
        },

        async createImage() {
            const { originData, currentPage, extendData, extendInfo, customTypes } = this;
            const view = createPreviewView(extendInfo, originData, currentPage, extendData, false, customTypes);
            const style = createPreviewStyle(extendInfo, originData, currentPage, extendData); // console.log(view)

            const res = await this.canvas.renderToCanvas({
                wxml: view,
                style
            }); // console.log(res)

            const res1 = await this.canvas.canvasToTempFilePath(); // console.log(res1)

            return res1.tempFilePath;
        },

        async createMaskImage() {
            const { originData, currentPage, extendData, extendInfo, customTypes } = this;
            const maskPage = {
                ...currentPage,
                elements: [
                    ...currentPage.elements,
                    {
                        uuid: 'watermark',
                        elName: 'qk-image',
                        commonStyle: {
                            position: 'absolute',
                            width: originData.width,
                            height: originData.height,
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        },
                        propsValue: {
                            imageSrc: '/static/assets/img/watermark2.png'
                        }
                    }
                ]
            };
            const view = createPreviewView(extendInfo, originData, maskPage, extendData, false, customTypes);
            const style = createPreviewStyle(extendInfo, originData, maskPage, extendData); // console.log(view)

            const res = await this.canvas.renderToCanvas({
                wxml: view,
                style
            }); // console.log(res)

            const res1 = await this.canvas.canvasToTempFilePath(); // console.log(res1)

            return res1.tempFilePath;
        },

        async htmlToImageBase64() {
            const { originData, currentPage, extendData, extendInfo, customTypes, width, height } = this;
            const fonts = app.globalData.fetchFonts(currentPage); // console.log(fonts)

            const html = generateHtml(extendInfo, originData, currentPage, extendData, false, customTypes, fonts);
            const base64 = await myInvitationApi.htmlToImage({
                html,
                width: width,
                height: height,
                scale: 3
            }); // console.log(base64)

            return base64;
        },

        async htmlToImageUrl() {
            const { originData, currentPage, extendData, extendInfo, customTypes, width, height } = this;
            const fonts = app.globalData.fetchFonts(currentPage); // console.log(fonts)

            const html = generateHtml(extendInfo, originData, currentPage, extendData, false, customTypes, fonts);
            const result = await myInvitationApi.htmlToImageUrl({
                html,
                width: width,
                height: height,
                scale: 3
            }); // console.log(base64)

            return result;
        },

        async handleImageChange(e) {
            const item = e.detail;
            console.log(item); // wx.showLoading({
            //   title: '替换图片中',
            // })

            try {
                const [err, res] = await uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed']
                });
				if (err) {
					throw err
				}
                console.log(res);

                if (res.tempFilePaths.length == 0) {
                    throw new Error('未选择图片');
                }

                const tempPath = res.tempFilePaths[0]; // 裁剪图片

                this.imageCut.cutImage({
                    src: tempPath,
                    width: item.commonStyle.width,
                    height: item.commonStyle.height,
                    callback: (res) => {
                        // if(err) {
                        //   console.error(err)
                        //   wx.showToast({
                        //     title: '裁剪失败',
                        //     icon: 'error'
                        //   })
                        //   return
                        // }
                        console.log(res);
                        uni.showLoading({
                            title: '上传中'
                        });
                        myInvitationApi
                            .uploadImage(res.url)
                            .then((res1) => {
                                const { extendData } = this;
                                let curr = extendData[item.uuid];

                                if (res1.path) {
                                    if (!curr) {
                                        curr = {};
                                    }

                                    curr.imageSrc = res1.path;
                                    this.setData({
                                        extendData: {
                                            [item.uuid]: curr,
                                            ...extendData
                                        }
                                    });
                                }
                            })
                            .catch((err1) => {
                                console.error(err1);
                                uni.showToast({
                                    title: '替换图片失败',
                                    icon: 'error'
                                });
                            })
                            .finally(() => {
                                uni.hideLoading({
                                    success: (res) => {}
                                });
                            });
                    }
                });
                return;
                const res1 = await myInvitationApi.uploadImage(tempPath);
                const { extendData } = this;
                let curr = extendData[item.uuid];

                if (res1.path) {
                    if (!curr) {
                        curr = {};
                    }

                    curr.imageSrc = res1.path;
                    this.setData({
                        extendData: {
                            [item.uuid]: curr,
                            ...extendData
                        }
                    });
                }
            } catch (error) {
                console.error(error);
                uni.showToast({
                    title: '替换图片失败',
                    icon: 'error'
                });
            } // wx.hideLoading({
            //   success: (res) => {},
            // })
        },

        handleInfoChange(e) {
            this.setData({
                extendInfo: { ...e.detail },
                showEditInfo: false
            });
        },

        loadFont() {
            // wx.downloadFile({
            //   url: 'https://cdn.taklipnama.com/fonts/ANSNB___.TTF',
            //   filePath: wx.env.USER_DATA_PATH +'/fonts/Abil-Test.TTF',
            //   success: (res) =>{
            //     console.log(res)
            //     // wx.saveFile({
            //     //   tempFilePath: res.tempFilePath,
            //     //   success: (res1) => {
            //     //     console.log(res1)
            //     //   }
            //     // })
            //     wx.loadFontFace({
            //       family: 'Abil-Test',
            //       source: `url("${res.filePath}")`,
            //       // scopes: ['native', 'webview'],
            //       success(res) {
            //         console.log(res)
            //       },
            //       fail(err) {
            //         console.log(err)
            //       }
            //     })
            //   },
            //   fail: (err) => {
            //     console.log(err)
            //   }
            // })
            // wx.loadFontFace({
            //   family: 'Abil-Test',
            //   source: 'url("https://cdn.taklipnama.com/fonts/ANSNB___.TTF")',
            //   scopes: ['native', 'webview'],
            //   success(res){
            //     console.log(res)
            //   },
            //   fail(err) {
            //     console.log(err)
            //   }
            // })
            // wx.loadFontFace({
            //   family: 'tn-ANSB',
            //   source: `url("../../../fonts/ANSNB___.TTF")`,
            //   scopes: ['native', 'webview'],
            //   success(res) {
            //     console.log(res)
            //   },
            //   fail(err) {
            //     console.log(err)
            //   }
            // })
        }
    }
};
</script>
<style>
@import './edit-data.css';
</style>
