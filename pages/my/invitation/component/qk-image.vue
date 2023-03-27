<template>
    <view>
        <!-- pages/my/invitation/component/qk-image.wxml -->
        <image v-if="item" :style="styleStr" :src="imageSrc"></image>
        <view v-if="canEdit" class="button-view" :style="styleStr + 'z-index: 1000;pointer-events:none;'">
            <!-- <van-button class="change-button" size="small" type="primary" plain bindtap="handleChangeImage" >替换图片</van-button> -->
            <button class="image-button" style="pointer-events: auto" @tap="handleChangeImage">
                <image :style="'width:' + 100 * btnScale + 'rpx;height:' + 100 * btnScale + 'rpx'" mode="scaleToFill" src="/static/assets/img/btn_change.png"></image>
            </button>
            <!-- <image class="image-button" mode="scaleToFill" src="../../../../assets/img/btn_change.png" bindtap="handleChangeImage"></image> -->
        </view>
    </view>
</template>

<script>
// pages/my/invitation/component/qk-image.js
import * as myInvitationApi from '../../../../api/myInvitation';
import { getCommonStyle, styleObjToStr } from '../../../../utils/qkUtils';
export default {
    data() {
        return {
            styleStr: '',
            imageSrc: '',
            canEdit: false,
            btnScale: 1
        };
    }
    /**
     * 组件的属性列表
     */,
    props: {
        item: null,
        extendData: null
    },
    watch: {
        'item.commonStyle': {
            handler: function (commonStyle) {
                let styleStr = '';

                if (commonStyle) {
                    styleStr = styleObjToStr(getCommonStyle(commonStyle));
                }

                this.setData({
                    styleStr
                });
            },

            immediate: true,
            deep: true
        },
        extendData: {
            handler: function (extendData) {
                this.updateImage();
            },

            immediate: true,
            deep: true
        }
    },
    beforeMount() {
        const { item, extendData } = this;

        if (item && item.propsValue && item.propsValue.isCustom) {
            const originWidth = 375;
            const originHeight = 532;
            const { width, height } = item.commonStyle;
            const btnScale = Math.pow((Math.pow(width / originWidth, 2) + Math.pow(height / originHeight, 2)) / 2, 0.5);
            this.setData({
                canEdit: true,
                btnScale: 0.5 + btnScale * 0.5
            });
        }

        this.updateImage();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getCommonStyle,
        styleObjToStr,

        async handleChangeImage() {
            this.$emit('change', {
                detail: this.item
            });
            return;
            uni.showLoading({
                title: '替换图片中'
            });

            try {
                const [err, res] = await uni.chooseImage({
                    count: 1,
                    sizeType: ['compressed']
                });
				if (err) {
					throw err
				}
                console.log(res);

                if (res.tempFilePaths.length == 0) {
                    throw new Error('未选择图片');
                }

                const tempPath = res.tempFilePaths[0];
                const res1 = await myInvitationApi.uploadImage(tempPath);
                this.updateImage(res1.path);
            } catch (error) {
                console.error(error);
                uni.showToast({
                    title: '替换图片失败',
                    icon: 'error'
                });
            }

            uni.hideLoading({
                success: (res) => {}
            });
        },

        updateImage(newPath) {
            const { item, extendData } = this;
            const { canEdit } = this; // if (newPath) {
            //   if (!curr) {
            //     extendData[item.uuid] = curr = {
            //       imageSrc: newPath
            //     }
            //   } else {
            //     curr.imageSrc = newPath
            //   }
            // }
            // console.log(extendData)

            let imageSrc = '';

            if (item && extendData) {
                let curr = extendData[item.uuid];

                if (curr && canEdit) {
                    imageSrc = curr.imageSrc;
                }

                if (!imageSrc) {
                    imageSrc = item.propsValue.imageSrc;
                }

                this.setData({
                    imageSrc
                });
            }
        }
    }
};
</script>
<style>
@import './qk-image.css';
</style>
