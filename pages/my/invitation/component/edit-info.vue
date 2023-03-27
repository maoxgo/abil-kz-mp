<template>
    <view style="height: 100%;width: 100%;">
        <!-- pages/my/invitation/component/edit-info.wxml -->
        <!-- <page-container show="{{show}}" z-index="1000" style="z-index:2000; position: absolute;"> -->
        <view class="edit-page">
            <mp-form id="form" :models="form" :rules="rules">
                <van-cell-group style="padding-bottom: 60px" title="请填写基本信息">
                    <block v-for="(item, index) in currTypes" :key="item.code">
                        

                        <van-cell
                            v-if="item.type === 'time'"
                            :title="item.title"
                            :value="form[item.code]"
                            :data-field="item.code"
                            required
                            is-link
                            @tap.native="onShowNewTimePicker($event, { field: item.code })"
                        />
						<template v-else-if="item.type === 'select'" >
							<van-field
							  :value="form[item.code]"
							  :data-field="item.code"
							  is-link
							  readonly
							  :label="item.title"
							  required
							  @tap.native="onFieldClick($event, item.code)"
							/>
							<van-overlay :show="formShow[item.code]" style="z-index: 2001;" z-index="2001">
								<view style="padding-top: 30%;">
									
								
									<van-picker
										show-toolbar
										:title="item.title"
										:columns="item.options"
										value-key="label"
										@cancel="onFieldCancel($event, item.code)"
										@confirm="onFieldConfirm($event, item.code)"
										
									/>
								</view>
								
								
							  
							</van-overlay>
						</template>
						<van-field
						    v-else
						    :value="form[item.code]"
						    :data-field="item.code"
						    required
						    clearable
						    :label="item.title"
						    :placeholder="item.defaultValue"
						    maxlength="40"
						    @change="formInputChange($event, { field: item.code })"
						/>
                    </block>
                </van-cell-group>

                <van-button style="position: absolute; bottom: 0; right: 0; left: 0" block type="primary" @tap.native="formSubmit">下一步</van-button>
            </mp-form>
        </view>

        <van-overlay style="z-index: 2001" :show="timePicker.show" z-index="2001" @click="onHideNewTimePicker">
            <view class="wrapper">
                <van-datetime-picker style="width: 100%" type="datetime" title="选择 年-月-日-时-分" :value="initTime" @confirm="onPickNewTime" />
            </view>
        </van-overlay>
        <!-- </page-container> -->
    </view>
</template>

<script>

// pages/my/invitation/component/edit-info.js
import moment from 'moment';
const app = getApp();
export default {
    components: {

    },
    data() {
        return {
            showNewTimePicker: false,

            timePicker: {
                dataField: 'undefined',
                show: false
            },
			formShow: {},
            currTypes: [],

            form: {
                // femaleName: null,
                // maleName: null,
                // weddingAddress: null,
                // weddingDate: null,
                // weddingTime: null
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
        info: null,
        customTypes: null
    },
    watch: {
        info_customTypes: {
            handler: function (newValue, oldValue) {
                const { info, customTypes } = newValue;

                this.updateInfo(info, customTypes);
            },

            immediate: true,
            deep: true
        }
    },
    beforeMount() {
        console.log('attached');
    },
    mounted() {
        console.log('ready');
    },
    /**
     * 组件的方法列表
     */
    methods: {
        updateInfo(info, customTypes) {
            console.log(info);
            console.log(customTypes); // const { femaleName, maleName, weddingAddress, weddingTime, FEMALE_NAME, MALE_NAME, WEDDING_ADDRESS, WEDDING_TIME, BOTH_NAME, PARTY_NAME } = info

            const types = customTypes;
            const currTypes = types.filter((type) => {
                // let result = false
                if (type.isCustom) {
                    return false;
                }

                if (type.showOnShare) {
                    return false;
                }

                if (info[type.code] !== undefined) {
                    return true;
                }

                return false;
            });
            console.log(currTypes);
            const newForm = {};
            const newRules = [];
            currTypes.forEach((type) => {
                if (type.type === 'string' || type.type === 'select') {
                    newForm[type.code] = info[type.code];
                    newRules.push({
                        name: type.code,
                        rules: [
                            {
                                required: true,
                                minlength: 1,
                                message: '请完善内容'
                            }
                        ]
                    });
                } else if (type.type === 'time') {
                    newForm[type.code] = moment(info[type.code] || new Date()).format('yyyy-MM-DD HH:mm');
                }
            });
            console.log(newForm);
            this.setData({
                form: newForm,
                rules: newRules,
                currTypes: currTypes
            });
        },
		onFieldClick(e, field) {
			console.log('on field click: ', field)
			this.setData({
				formShow: {
					[field]: true
				}
			})
			console.log(this.formShow)
			// this.formShow[field] = true
		},
		onFieldConfirm(e, field) {
			console.log('on field confirm: ', field)
			const type = this.currTypes.find(item => item.code == field)
			console.log(type)
			if (type) {
				
				if (type.type == 'select') {
					const { value } = e.detail
					this.form[field] = value.label
					
				}
			}
			this.formShow[field] = false
		},
		onFieldCancel(e, field) {
			console.log('on field cancel: ', field)
			this.formShow[field] = false
		},
        formSubmit(e) {
            const { form, tempId } = this;
            console.log(e);
            console.log(form);
            this.$mp.component.selectComponent('#form').validate((valid, errors) => {
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
                        detail: { ...form }
                    });
                }
            });
        },

        onShowNewTimePicker(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            // console.log(e)
            const { field } = e.currentTarget.dataset;
            this.setData({
                // showNewTimePicker: true,
                timePicker: {
                    dataField: field,
                    show: true
                }
            });
        },

        onHideNewTimePicker() {
            this.setData({
                // showNewTimePicker: false,
                timePicker: {
                    dataField: 'undefined',
                    show: false
                }
            });
        },

        onPickNewTime(e) {
            // console.log(e)
            const time = moment(e.detail);
            this.form[this.timePicker.dataField] = time.format('yyyy-MM-DD HH:mm');
            this.onHideNewTimePicker();
        },

        formInputChange(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            // console.log(e)
            const { field } = e.currentTarget.dataset;
			this.form[field] = e.detail
            // this[`form.${field}`] = e.detail;
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
@import './edit-info.css';
</style>
