
<template>
    <!-- pages/my/invitation/edit-info.wxml -->
	<!-- 该页面已弃用 -->
    <view class="page-body">
        <form>
            <van-cell-group style="padding-bottom: 60px" title="请填写信息">
                <van-field :value="username" required clearable label="新娘姓名" placeholder="请输入" />
                <van-field :value="username" required clearable label="新郎姓名" placeholder="请输入" />
                <van-cell title="婚礼日期" value="aaaa" required is-link />
                <van-cell title="婚礼时间" value="aaaa" required is-link />
                <van-field :value="username" type="textarea" autosize clearable label="婚礼地址" placeholder="请输入" />
            </van-cell-group>

            <van-button style="position: absolute; bottom: 0; right: 0; left: 0" block type="primary">下一步</van-button>
            <!-- <view class="page-section">
      <view class="weui-cells__title">新娘姓名</view>
      <view class="weui-cells weui-cells_after-title">
        <view class="weui-cell weui-cell_input">
          <input class="weui-input" auto-focus placeholder="请输入"/>
        </view>
      </view>
    </view>
    
    <view class="page-section">
      <view class="weui-cells__title">婚礼地址</view>
      <view class="weui-cells weui-cells_after-title">
        <view class="weui-cell weui-cell_input">
          <textarea style="height:120px;" auto-focus placeholder="请输入"/>
        </view>
      </view>
    </view> -->
        </form>
        <van-overlay :show="timePickerShow" @click="onClickHide">
            <van-datetime-picker type="datetime" :value="currentDate" :min-date="minDate" :max-date="maxDate" @input="onInput" />
        </van-overlay>
    </view>
</template>

<script>
// pages/my/invitation/edit-info.js
export default {
    components: {

    },
    data() {
        return {
            timePickerShow: false,
            username: '',
            currentDate: '',
            minDate: '',
            maxDate: ''
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},
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
        onClickHide() {
            this.setData({
                timePickerShow: false
            });
        },

        onPickTime() {
            this.setData({
                timePickerShow: true
            });
        },

        onInput() {
            console.log('占位：函数 onInput 未声明');
        }
    }
};
</script>
<style>
@import './edit-info.css';
</style>
