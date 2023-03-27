<template>
    <view>
        <!-- pages/template/list.wxml -->
        <scroll-view style="height: 100%; width: 100%">
            <!-- <view style="height: 30px; font-size: small; vertical-align: middle; padding: 0 12px; line-height: 30px; border-bottom: black solid 1rpx">
    <picker bindchange="onCateChange" range-key="name" value="{{cateIndex}}" range="{{cates}}">
      <text style="color: var(--primaryColor)" space="ensp">分类:  {{cates[cateIndex].name}}</text><mp-icon extClass="mpIcon" icon="play" type="field" color="black" size="18"></mp-icon>
    </picker>
  </view> -->
            <van-tabs v-if="cates && cateId != null" id="tabs" :active="cateId" @change="onCateChange($event, { tagId: 'tabs' })">
                <van-tab :title="item.name" :name="item.id" v-for="(item, index) in cates" :key="item.id"></van-tab>
            </van-tabs>
            <view class="card-list">
                <view class="card-border card-widget" v-for="(item, index) in templates" :key="item.id">
                    <navigator class="card-nav" open-type="navigate" :url="'/pages/template/detail?id=' + item.id">
                        <image style="" class="card-image" mode="aspectFill" :src="item.imageUrl + '?x-oss-process=image/resize,w_300'"></image>
                        <van-tag v-if="item.price == 0" class="card-tag" plain type="success">免费</van-tag>
                    </navigator>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
// pages/template/list.js
const computedBehavior = require('miniprogram-computed').behavior;

import * as tempApi from '../../api/template';
import * as homeApi from '../../api/home';
const app = getApp();
export default {
    components: {
    },
    data() {
        return {
            cates: [
                // { id: 0, name: '全部' }
            ],

            defaultImage: 'http://cdn.taklipnama.com/image/banner/c5f53dff-c454-46b6-b048-1041e6bb6a7f.jpg',
            templates: [],
            pageNum: 1,
            pageSize: 12,
            hasMore: true,
            cateId: null,
            isFree: null,

            computed: {
                cateIndex(data) {
                    const { cateId, cates } = data;

                    if (!cates || cateId == null) {
                        return null;
                    }

                    for (let i = 0; i < cates.length; i++) {
                        const element = cates[i];

                        if (cateId == element.id) {
                            return i;
                        }
                    }

                    return 0;
                }
            }
        };
    },
    mixins: [computedBehavior],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let { cateId, isFree } = options;
        console.log(options);

        try {
            cateId = parseInt(cateId) || 0;
        } catch (err) {}

        this.setData(
            {
                cateId: cateId,
                isFree: isFree || null
            },
            () => {
                this.fetchTempList(true);
                this.fetchCateList();
            }
        );
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
    onPullDownRefresh: function () {
        console.log('--------下拉刷新-------');
        this.fetchTempList(true)
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
        this.fetchTempList();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
    methods: {
        fetchTempList(reset) {
            let { pageNum, pageSize, templates, hasMore, cateId, isFree } = this;

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
                pageSize
            };

            if (cateId) {
                query.cateId = cateId;
            }

            if (isFree) {
                query.isFree = isFree;
            }

            return tempApi
                .listTemplate(query)
                .then((data) => {
                    // console.log(data)
                    if (data.totalPage <= data.pageNum) {
                        hasMore = false;
                    }

                    if (reset) {
                        this.setData({
                            templates: data.rows,
                            pageNum,
                            hasMore
                        });
                    } else {
                        this.setData({
                            templates: [...templates, ...data.rows],
                            pageNum,
                            hasMore
                        });
                    }

                    return data;
                })
                .catch((err) => {
                    console.error(err);
                });
        },

        fetchCateList() {
            // homeApi.listCate({ pagePage: 9 }).then(data => {
            //   // console.log(data)
            //   this.setData({
            //     cates: [{
            //       id: 0,
            //       name: '全部'
            //     }, ...data.rows ]
            //   })
            //   // this.selectComponent('#tabs').resize();
            // }).catch(err => {
            //   console.error(err)
            // })
            const timeOut = setInterval(() => {
                const cates = app.globalData.cates;
                console.log(cates);

                if (cates && cates.length > 0) {
                    this.setData({
                        cates: [
                            {
                                id: 0,
                                name: '全部'
                            },
                            ...cates
                        ]
                    });
                    clearInterval(timeOut);
                }
            }, 500);
        },

        onCateChange(e, _dataset) {
            /* ---处理dataset begin--- */
            this.datasetHandle(e, _dataset);
            /* ---处理dataset end--- */
            console.log(e);
            this.setData(
                {
                    cateId: e.detail.name
                },
                () => {
                    this.fetchTempList(true);
                }
            );
        }
    }
};
</script>
<style>
@import './list.css';
</style>
