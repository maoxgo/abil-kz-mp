<template>
    <view>
        <!-- pages/my/invitation/component/edit-info.wxml -->
        <!-- <page-container show="{{show}}" z-index="1000" style="z-index:2000; position: absolute;"> -->
        <view class="edit-page">
            <mp-form id="form" :models="form" :rules="rules">
                <van-cell-group style="padding-bottom: 60px" title="请填写基本信息">
                    <van-field
                        v-if="form.maleName != null"
                        :value="form.maleName"
                        data-field="maleName"
                        required
                        clearable
                        label="新郎姓名"
                        placeholder="请输入"
                        maxlength="20"
                        @change="formInputChange($event, { field: 'maleName' })"
                    />
                    <van-field
                        v-if="form.femaleName != null"
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
                        v-if="form.weddingAddress != null"
                        :value="form.weddingAddress"
                        data-field="weddingAddress"
                        required
                        label="婚礼地址"
                        placeholder="请输入"
                        maxlength="100"
                        @change="formInputChange($event, { field: 'weddingAddress' })"
                    />
                    <van-cell
                        v-if="form.weddingDate != null"
                        title="婚礼日期"
                        :value="form.weddingDate"
                        data-field="weddingDate"
                        required
                        is-link
                        @tap.native="onShowDatePicker($event, { field: 'weddingDate' })"
                    />
                    <van-cell
                        v-if="form.weddingTime != null"
                        title="婚礼时间"
                        :value="form.weddingTime"
                        data-field="weddingTime"
                        required
                        is-link
                        @tap.native="onShowTimePicker($event, { field: 'weddingTime' })"
                    />
                    <!-- 新版 -->
                    <van-field
                        v-if="form.BOTH_NAME != null"
                        :value="form.BOTH_NAME"
                        name="BOTH_NAME"
                        prop="BOTH_NAME"
                        data-field="BOTH_NAME"
                        required
                        clearable
                        label="双方姓名"
                        placeholder="Halmurat & Farzana"
                        maxlength="40"
                        @change="formInputChange($event, { field: 'BOTH_NAME' })"
                    />
                    <van-field
                        v-if="form.PARTY_NAME != null"
                        :value="form.PARTY_NAME"
                        name="PARTY_NAME"
                        prop="PARTY_NAME"
                        data-field="PARTY_NAME"
                        required
                        clearable
                        label="聚会名称"
                        placeholder="Kiz Ohul Olturux"
                        maxlength="40"
                        @change="formInputChange($event, { field: 'PARTY_NAME' })"
                    />
                    <van-field
                        v-if="form.MALE_NAME != null"
                        :value="form.MALE_NAME"
                        data-field="MALE_NAME"
                        required
                        clearable
                        label="新郎姓名"
                        placeholder="请输入"
                        maxlength="20"
                        @change="formInputChange($event, { field: 'MALE_NAME' })"
                    />
                    <van-field
                        v-if="form.FEMALE_NAME != null"
                        :value="form.FEMALE_NAME"
                        name="FEMALE_NAME"
                        prop="FEMALE_NAME"
                        data-field="FEMALE_NAME"
                        required
                        clearable
                        label="新娘姓名"
                        placeholder="请输入"
                        maxlength="20"
                        @change="formInputChange($event, { field: 'FEMALE_NAME' })"
                    />
                    <van-field
                        v-if="form.WEDDING_ADDRESS != null"
                        :value="form.WEDDING_ADDRESS"
                        data-field="WEDDING_ADDRESS"
                        required
                        label="地址"
                        placeholder="请输入"
                        maxlength="100"
                        @change="formInputChange($event, { field: 'WEDDING_ADDRESS' })"
                    />
                    <van-cell
                        v-if="form.WEDDING_TIME != null"
                        title="时间"
                        :value="form.WEDDING_TIME"
                        data-field="WEDDING_TIME"
                        required
                        is-link
                        @tap.native="onShowNewTimePicker($event, { field: 'WEDDING_TIME' })"
                    />
                </van-cell-group>

                <van-button style="position: absolute; bottom: 0; right: 0; left: 0" block type="primary" @tap.native="formSubmit">下一步</van-button>
            </mp-form>
        </view>
        <van-calendar :show="showDatePicker" date @close="onCloseDatePicker" @confirm="onPickDate" />
        <van-overlay style="z-index: 2000" :show="showTimePicker" z-index="2000" @click="onHideTimePicker">
            <view class="wrapper">
                <van-datetime-picker style="width: 100%" type="time" title="选择时间" :value="form.weddingTime" @confirm="onPickTime" />
            </view>
        </van-overlay>
        <van-overlay style="z-index: 2001" :show="showNewTimePicker" z-index="2001" @click="onHideNewTimePicker">
            <view class="wrapper">
                <van-datetime-picker style="width: 100%" type="datetime" title="选择 年-月-日-时-分" :value="initTime" @confirm="onPickNewTime" />
            </view>
        </van-overlay>
        <!-- </page-container> -->
    </view>
</template>

<script>
import vanDatetimePicker from './@vant/weapp/datetime-picker/index';
import vanActionSheet from './@vant/weapp/action-sheet/index';
import vanOverlay from './@vant/weapp/overlay/index';
import vanCell from './@vant/weapp/cell/index';
import vanCellGroup from './@vant/weapp/cell-group/index';
import vanField from './@vant/weapp/field/index';
import vanCalendar from './@vant/weapp/calendar/index';
// pages/my/invitation/component/edit-info.js
import moment from 'moment';
export default {
    components: {
        vanDatetimePicker,
        vanActionSheet,
        vanOverlay,
        vanCell,
        vanCellGroup,
        vanField,
        vanCalendar
    },
    data() {
        return {
            showDatePicker: false,
            showTimePicker: false,
            showNewTimePicker: false,

            form: {
                weddingDate: '',
                weddingTime: '',
                WEDDING_TIME: '',
                maleName: '',
                femaleName: '',
                weddingAddress: '',
                BOTH_NAME: '',
                PARTY_NAME: '',
                MALE_NAME: '',
                FEMALE_NAME: '',
                WEDDING_ADDRESS: ''
            },

            rules: [
                // {
                //   name: 'femaleName',
                //   rules: [{required: true, minlength: 1, message: '请填写新娘姓名'}]
                // },
                // {
                //   name: 'maleName',
                //   rules: [{required: true, minlength: 1, message: '请填写新郎姓名'}]
                // },
                // {
                //   name: 'weddingDate',
                //   rules: [{required: true, message: '请选择婚礼日期'}]
                // },
                // {
                //   name: 'weddingTime',
                //   rules: [{required: true, message: '请选择婚礼时间'}]
                // },
            ],

            initTime: Date.now(),
            error: ''
        };
    },
    /**
     * 组件的属性列表
     */
    props: {
        info: null
    },
    watch: {
        info: {
            handler: function (info) {
                this.updateInfo(info);
            },

            immediate: true,
            deep: true
        }
    },
    beforeMount() {},
    /**
     * 组件的方法列表
     */
    methods: {
        updateInfo(info) {
            console.log(info);
            const { femaleName, maleName, weddingAddress, weddingTime, FEMALE_NAME, MALE_NAME, WEDDING_ADDRESS, WEDDING_TIME, BOTH_NAME, PARTY_NAME } = info;
            const newForm = {};
            const newRules = []; // 旧版本参数

            if (femaleName != null) {
                newForm['femaleName'] = femaleName;
                newRules.push({
                    name: 'femaleName',
                    rules: [
                        {
                            required: true,
                            minlength: 1,
                            message: '请填写新娘姓名'
                        }
                    ]
                });
            }

            if (maleName != null) {
                newForm['maleName'] = maleName;
                newRules.push({
                    name: 'maleName',
                    rules: [
                        {
                            required: true,
                            minlength: 1,
                            message: '请填写新郎姓名'
                        }
                    ]
                });
            }

            if (weddingAddress != null) {
                newForm['weddingAddress'] = weddingAddress;
                newRules.push({
                    name: 'weddingAddress',
                    rules: [
                        {
                            required: true,
                            message: '请填写地址'
                        }
                    ]
                });
            }

            if (weddingTime != null) {
                const time = moment(weddingTime || new Date());
                newForm['weddingDate'] = time.format('yyyy-MM-DD');
                newForm['weddingTime'] = time.format('HH:mm');
            } // 新版本参数

            if (FEMALE_NAME != null) {
                newForm['FEMALE_NAME'] = FEMALE_NAME;
                newRules.push({
                    name: 'FEMALE_NAME',
                    rules: [
                        {
                            required: true,
                            minlength: 1,
                            message: '请填写新娘姓名'
                        }
                    ]
                });
            }

            if (MALE_NAME != null) {
                newForm['MALE_NAME'] = MALE_NAME;
                newRules.push({
                    name: 'MALE_NAME',
                    rules: [
                        {
                            required: true,
                            minlength: 1,
                            message: '请填写新郎姓名'
                        }
                    ]
                });
            }

            if (BOTH_NAME != null) {
                newForm['BOTH_NAME'] = BOTH_NAME;
                newRules.push({
                    name: 'BOTH_NAME',
                    rules: [
                        {
                            required: true,
                            minlength: 1,
                            message: '请填写姓名'
                        }
                    ]
                });
            }

            if (PARTY_NAME != null) {
                newForm['PARTY_NAME'] = PARTY_NAME;
                newRules.push({
                    name: 'PARTY_NAME',
                    rules: [
                        {
                            required: true,
                            minlength: 1,
                            message: '请填写聚会名称'
                        }
                    ]
                });
            }

            if (WEDDING_ADDRESS != null) {
                newForm['WEDDING_ADDRESS'] = WEDDING_ADDRESS;
                newRules.push({
                    name: 'WEDDING_ADDRESS',
                    rules: [
                        {
                            required: true,
                            message: '请填写地址'
                        }
                    ]
                });
            }

            if (WEDDING_TIME != null) {
                const time = moment(WEDDING_TIME || new Date());
                newForm['WEDDING_TIME'] = time.format('yyyy-MM-DD HH:mm');
            }

            console.log(newForm);
            this.setData({
                form: newForm,
                rules: newRules
            });
        },

        formSubmit(e) {
            const { form, tempId } = this;
            console.log(e);
            console.log(form);
            this.$mp.component.selectComponent('#form').$vm.validate((valid, errors) => {
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
                } else {
                    this.$emit('change', {
                        detail: {
                            femaleName: form.femaleName,
                            maleName: form.maleName,
                            weddingAddress: form.weddingAddress,
                            weddingTime: form.weddingTime && form.weddingDate ? form.weddingDate + ' ' + form.weddingTime : null,
                            ...form
                        }
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
            const str = moment(date).format('yyyy-MM-DD');
            this.setData({
                ['form.weddingDate']: str,
                showDatePicker: false
            });
        },

        onShowTimePicker(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            this.setData({
                showTimePicker: true
            });
        },

        onHideTimePicker() {
            this.setData({
                showTimePicker: false
            });
        },

        onPickTime(e) {
            // console.log(e)
            this.setData({
                ['form.weddingTime']: e.detail,
                showTimePicker: false
            });
        },

        onShowNewTimePicker(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            this.setData({
                showNewTimePicker: true
            });
        },

        onHideNewTimePicker() {
            this.setData({
                showNewTimePicker: false
            });
        },

        onPickNewTime(e) {
            // console.log(e)
            const time = moment(e.detail);
            this.setData({
                ['form.WEDDING_TIME']: time.format('yyyy-MM-DD HH:mm'),
                showNewTimePicker: false
            });
        },

        formInputChange(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            // console.log(e)
            const { field } = e.currentTarget.dataset;
            this[`form.${field}`] = e.detail;
        }
    }
};
</script>
<style>
@import './edit-info-old.css';
</style>
