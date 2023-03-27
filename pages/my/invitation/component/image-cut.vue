<template>
    <view>
        <!-- pages/my/invitation/component/image-cut.wxml -->
        <van-overlay :show="show" position="center" z-index="2000" style="z-index: 2000">
            <view class="main-content" style="">
                <image-cropper
                    id="image-cropper"
                    :data="options"
                    :imgSrc="imageSrc"
                    :height="imageHeight"
                    :width="imageWidth"
                    :disable_ratio="true"
                    :disable_height="true"
                    :disable_width="true"
                    :limit_move="true"
                    :disable_rotate="true"
                ></image-cropper>
            </view>
            <view class="bottom-bar" style="">
                <van-button class="bottom-button" block plain @tap.native="handleClose"><text space="ensp">返 回</text></van-button>
                <van-button class="bottom-button" block plain @tap.native="handlePreview"><text space="ensp">预 览</text></van-button>
                <van-button class="bottom-button" block type="primary" @tap.native="handleSave"><text space="ensp">保 存</text></van-button>
            </view>
        </van-overlay>
    </view>
</template>

<script>
// pages/my/invitation/component/image-cut.js
// import imageCropper from '@/wxcomponents/image-cropper/image-cropper'
export default {
    components: {
		// imageCropper
    },
    data() {
        return {
            show: false,
            imageSrc: '',
            imageWidth: 280,
            imageHeight: 350,
            options: {
                disable_ratio: true,
                limit_move: true
            }
        };
    },
    /**
     * 组件的属性列表
     */
    props: {},
    beforeMount() {
        this.cropper = this.$mp.component.selectComponent('#image-cropper');
    },
    /**
     * 组件的方法列表
     */
    methods: {
        cutImage(options) {
            const { src, width = 280, height = 350, callback } = options;
            console.log(options);
            console.log(height);
            const { imageWidth } = this;
            console.log((imageWidth / width) * height);
            this.setData({
                imageSrc: src,
                imageHeight: (imageWidth / width) * height,
                show: true
            });
            this.cropper.imgReset();

            if (callback) {
                this.callback = callback;
            }
        },

        handleClose() {
            this.setData({
                show: false
            });
            this.callback = undefined;
        },

        handlePreview() {
            this.cropper.getImg(({ url, width, height }) => {
                uni.previewImage({
                    urls: [url]
                });
            });
        },

        handleSave() {
            this.cropper.getImg((res) => {
                this.$emit('input', {
                    detail: res
                });

                if (this.callback) {
                    this.callback(res);
                }

                this.handleClose();
            });
        }
    }
};
</script>
<style>
@import './image-cut.css';
</style>
