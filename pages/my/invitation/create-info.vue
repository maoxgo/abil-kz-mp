<template>
    <!-- pages/my/invitation/create-info.wxml -->

    <view class="page-body">
        <mp-form id="form" :models="form" :rules="rules">
            <van-cell-group style="padding-bottom: 60px" title="请填写基本信息">
                <van-field
                    :value="form.femaleName"
                    name="femaleName"
                    prop="femaleName"
                    data-field="femaleName"
                    required
                    clearable
                    label="新娘姓名"
                    placeholder="请输入"
                    maxlength="20"
                    @change="formInputChange($event, { field: 'femaleName' })"
                />
                <van-field
                    :value="form.maleName"
                    data-field="maleName"
                    required
                    clearable
                    label="新郎姓名"
                    placeholder="请输入"
                    maxlength="20"
                    @change="formInputChange($event, { field: 'maleName' })"
                />
                <van-cell title="婚礼日期" :value="form.weddingDate" data-field="weddingDate" required is-link @tap.native="onShowDatePicker($event, { field: 'weddingDate' })" />
                <!-- <van-cell
        title="婚礼时间"
        value="{{ form.weddingTime }}"
        data-field="weddingTime"
        required
        is-link
        bindtap="onPickTime"
      /> -->
                <van-field
                    :value="form.weddingAddress"
                    data-field="weddingAddress"
                    type="textarea"
                    autosize
                    clearable
                    label="婚礼地址"
                    placeholder="请输入"
                    maxlength="100"
                    @change="formInputChange($event, { field: 'weddingAddress' })"
                />
            </van-cell-group>

            <van-button style="position: absolute; bottom: 0; right: 0; left: 0" block type="primary" @tap.native="formSubmit">下一步</van-button>
        </mp-form>
        <van-calendar :show="showDatePicker" date @close="onCloseDatePicker" @confirm="onPickDate" />
        <van-overlay :show="timePickerShow" @click="onClickHide">
            <van-datetime-picker type="datetime" :value="currentDate" :min-date="minDate" :max-date="maxDate" @input="" />
        </van-overlay>
    </view>
</template>

<script>

// pages/my/invitation/create-info.js
import * as myInvitationApi from '../../../api/myInvitation';
const app = getApp();
export default {
    components: {
    },
    data() {
        return {
            showDatePicker: false,
            showTimePicker: false,
            tempInfo: null,
            tempId: null,

            form: {
                femaleName: null,
                maleName: null,
                weddingAddress: '',
                weddingDate: null,
                weddingTime: null
            },

            rules: [
                {
                    name: 'femaleName',
                    rules: [
                        {
                            required: true,
                            minlength: 1,
                            message: '请填写新娘姓名'
                        }
                    ]
                },
                {
                    name: 'maleName',
                    rules: [
                        {
                            required: true,
                            minlength: 1,
                            message: '请填写新郎姓名'
                        }
                    ]
                },
                {
                    name: 'weddingDate',
                    rules: [
                        {
                            required: true,
                            message: '请选择婚礼日期'
                        }
                    ]
                } // {
                //   name: 'weddingTime',
                //   rules: [{required: true, message: '请选择婚礼时间'}]
                // },
            ],

            error: '',
            timePickerShow: '',
            currentDate: '',
            minDate: '',
            maxDate: ''
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { tempId } = options;
        this.setData({
            tempId: tempId || null
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
        formSubmit(e) {
            if (!app.globalData.checkAuth()) {
                return;
            }

            const { form, tempId } = this;
            console.log(e);
            console.log(this.form);
            uni.showLoading({
                title: '提交中'
            });
            this.$mp.page.selectComponent('#form').$vm.validate((valid, errors) => {
                console.log('valid', valid, errors);

                if (!valid) {
                    const firstError = Object.keys(errors);

                    if (firstError.length) {
                        this.setData({
                            error: errors[firstError[0]].message
                        });
                        uni.showToast({
                            title: errors[firstError[0]].message,
                            icon: 'error'
                        });
                    }

                    uni.hideLoading({
                        success: (res) => {}
                    });
                } else {
                    myInvitationApi
                        .createInvitation({
                            tempId: tempId,
                            femaleName: form.femaleName,
                            maleName: form.maleName,
                            weddingAddress: form.weddingAddress,
                            weddingTime: form.weddingDate
                        })
                        .then((res) => {
                            uni.showToast({
                                title: '提交成功',
                                icon: 'success'
                            });
                            console.log(res);
                            uni.redirectTo({
                                url: '/pages/my/invitation/edit-data?id=' + res
                            });
                        })
                        .catch((e) => {
                            console.log(e);
                            uni.showToast({
                                title: '提交失败',
                                icon: 'error'
                            });
                        })
                        .finnaly(() => {
                            uni.hideLoading({
                                success: (res) => {}
                            });
                        });
                }
            });
        },

        onShowDatePicker(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            this.setData({
                showDatePicker: true
            });
        },

        onCloseDatePicker() {
            this.setData({
                showDatePicker: false
            });
        },

        onPickDate(e) {
            console.log(e);
            const date = e.detail;
            const str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            this.setData({
                ['form.weddingDate']: str,
                showDatePicker: false
            });
        },

        onPickTime() {},

        formInputChange(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            console.log(e);
            const { field } = e.currentTarget.dataset;
            this[`form.${field}`] = e.detail;
        },

        onClickHide() {
            console.log('占位：函数 onClickHide 未声明');
        }
    }
};
</script>
<style>
@import './create-info.css';
</style>
