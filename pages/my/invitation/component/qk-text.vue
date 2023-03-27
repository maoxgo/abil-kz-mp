<template>
    <!-- pages/my/invitation/component/qk-text.wxml -->
    <!-- <text wx:if="{{item}}" style="{{styleObjToStr(getCommonStyle(item.commonStyle))}}">{{item.propsValue.text}}</text> -->
    <!-- <view wx:if="{{item}}" style="{{styleStr}}">
  <text>{{item.propsValue.text}}</text>
</view> -->
    <view v-if="item" :style="styleStr">{{ currText }}</view>
</template>

<script>
// pages/my/invitation/component/qk-text.js
import { getCommonStyle, styleObjToStr, strFormat, getCustomText } from '../../../../utils/qkUtils';
import moment from 'moment';
const app = getApp();
export default {
    data() {
        return {
            styleStr: '',
            currText: ''
        };
    },
    /**
     * 组件的属性列表
     */
    props: {
        item: null,
        info: null,
        customTypes: null
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
        info_customTypes: {
            handler: function (newValue, oldValue) {
                const { info, customTypes } = newValue;

                this.updateInfo(info, customTypes);
            },

            immediate: true,
            deep: true
        }
    },
    beforeMount: function () {
        // console.log(this.properties)
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getCommonStyle,
        styleObjToStr,

        updateInfo(info, customTypes) {
            const { item } = this;

            if (info && item) {
                const { propsValue } = item;

                if (propsValue) {
                    if (propsValue.isCustom) {
                        let currText = getCustomText(propsValue, info, customTypes, true); // switch(propsValue.customType) {
                        //   case 'FEMALE_NAME':
                        //     currText = info.FEMALE_NAME || info.femaleName
                        //     break
                        //   case 'MALE_NAME':
                        //     currText = info.MALE_NAME || info.maleName
                        //     break
                        //   case 'BOTH_NAME':
                        //     currText = info.BOTH_NAME
                        //     break
                        //   case 'PARTY_NAME':
                        //     currText = info.PARTY_NAME
                        //     break
                        //   case 'WEDDING_ADDRESS':
                        //     currText = info.WEDDING_ADDRESS || info.weddingAddress
                        //     break
                        //   case 'WEDDING_TIME':
                        //     const time = moment(info.WEDDING_TIME || info.weddingTime || new Date())
                        //     currText = time.format(propsValue.timeFormat || 'yyyy年MM月DD日 HH:mm')
                        //     break
                        //   case 'CUSTOM':
                        //     currText = strFormat(propsValue.text, {}, info)
                        //     break
                        //   default:
                        //     break
                        // }
                        // console.log(currText)

                        this.setData({
                            currText: currText
                        });
                    }
                }
            }
        }
    },
    computed: {
        info_customTypes() {
            const { info, customTypes } = this;

            return {
                info,
                customTypes
            };
        }
    }
};
</script>
<style>
@import './qk-text.css';
</style>
