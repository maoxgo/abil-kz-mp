<template>
    <!-- index.wxml -->
    <view class="container">
        <scroll-view style="height: 100%" enable-back-to-top>
            <view class="top-image">
                <image mode="widthFix" :src="mainPic"></image>
            </view>
            <view class="mid-bar">
                <view class="cates">
                    <view class="cates-item" v-for="(item, index) in cates" :key="item.id">
                        <navigator :url="'/pages/template/list?cateId=' + item.id">
                            <image :src="item.icon"></image>
                            <text>{{ item.name }}</text>
                        </navigator>
                    </view>
                </view>
                
            </view>
			<view class="mid-ads">
				<image class="mid-ads-image" mode="widthFix" :src="adPic1" @tap="handleAd1"></image>
				<image class="mid-ads-image" mode="widthFix" :src="adPic2" @tap="handleAd2"></image>
				<image class="mid-ads-image" mode="widthFix" :src="adPic3" @tap="handleAd3"></image>
			</view>
            <!-- <swiper class="page-swiper" indicator-dots autoplay circular>
                <block v-for="(item, index) in banners" :key="item.id">
                    <swiper-item style="text-align: center">
                        <image style="" mode="aspectFill" :src="item.imageUrl"></image>
                    </swiper-item>
                </block>
            </swiper> -->
            <!-- <text class="card-list-title">请帖模板</text> -->
            <view class="card-list">
                <view style="" class="card-border card-widget" v-for="(item, index) in templates" :key="item.id">
                    <navigator class="card-nav" open-type="navigate" :url="'/pages/template/detail?id=' + item.id">
                        <image class="card-image" mode="aspectFill" :src="item.imageUrl + '?x-oss-process=image/resize,w_300'" style=""></image>
                        <!-- <van-tag v-if="item.price == 0" class="card-tag" plain type="success">免费</van-tag> -->
                    </navigator>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
// index.js
// 获取应用实例
const app = getApp();
import * as homeApi from '../../api/home.js';
export default {
    data() {
        return {
            motto: 'Hello World',
            userInfo: {},
            hasUserInfo: false,
            canIUse: uni.canIUse('button.open-type.getUserInfo'),
            canIUseGetUserProfile: false,
            canIUseOpenData: uni.canIUse('open-data.type.userAvatarUrl') && uni.canIUse('open-data.type.userNickName'),
            // 如需尝试获取用户信息可改为false
            defaultImage: 'http://cdn.taklipnama.com/image/banner/c5f53dff-c454-46b6-b048-1041e6bb6a7f.jpg',
            banners: [],
            cates: [],
            templates: [],
            pageNum: 1,
            pageSize: 18,
            hasMore: true,
            mainPic: 'https://cdn.kz.taklipnama.com/public/banner.jpg',
            adPic1: 'https://cdn.kz.taklipnama.com/public/ad_1.png',
            adPic2: 'https://cdn.kz.taklipnama.com/public/ad_2.png',
			adPic3: 'https://cdn.kz.taklipnama.com/public/ad_3.png'
        };
    },
    onLoad() {
        if (uni.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            });
        }

        // this.fetchBannerList();
        this.fetchCateList();
        this.fetchTempList(true); // wx.getSystemInfo().then(console.log)
    },
    onPullDownRefresh() {
        console.log('--------下拉刷新-------');
        this.fetchTempList(true)
            .then(() => {})
            .finally(() => {
                uni.stopPullDownRefresh({
                    success: (res) => {}
                });
            }); // wx.showNavigationBarLoading() //在标题栏中显示加载
    },
    onReachBottom() {
        // console.log('------加载更多-------')
        // this.fetchTempList()
    },
    onShareAppMessage() {
        return {
            title: 'Toy Bazar',
            path: '/pages/index/index'
        };
    },
    onShareTimeline() {
        return {
            title: 'Toy Bazar'
        };
    },
    methods: {
        // 事件处理函数
        bindViewTap() {
            uni.navigateTo({
                url: '../logs/logs'
            });
        },

        goToDetail(e) {
            console.log(e);
            uni.navigateTo({
                url: '/pages/template/detail'
            });
        },

        fetchBannerList() {
            homeApi
                .listBanner({
                    pageSize: 6
                })
                .then((data) => {
                    // console.log(data)
                    this.setData({
                        banners: data.rows,
                        mainPic: data.mainPic,
                        adPic1: data.adPic1,
                        adPic2: data.adPic2
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        },

        fetchCateList() {
            // homeApi.listCate({ pagePage: 9 }).then(data => {
            //   // console.log(data)
            //   this.setData({
            //     cates: data.rows
            //   })
            // }).catch(err => {
            //   console.error(err)
            // })
            const timeOut = setInterval(() => {
                const cates = app.globalData.cates;
                console.log(cates);

                if (cates && cates.length > 0) {
                    this.setData({
                        cates: cates
                    });
                    clearInterval(timeOut);
                }
            }, 500);
        },

        handleMakePhoneCell: function () {
            uni.makePhoneCall({
                phoneNumber: '18116838227'
            });
        },
		handleAd1() {
			wx.openChannelsActivity({
				finderUserName: 'sphrj8jYgDevAFy',
				feedId: 'export/UzFfAgtgekIEAQAAAAAAR2stxAdNtgAAAAstQy6ubaLX4KHWvLEZgBPEi6JAV3QiQ6KAzNPgMJrhQMoQrGq_4VcCZ20PuAx4',
				fail(e) {
					console.log('打开视频号失败')
					console.log(e)
				},
				success() {
					console.log('打开视频号成功')
				}
			})
		},
		handleAd2() {
			uni.makePhoneCall({
			    phoneNumber: '13209090144'
			});
		},
		handleAd3() {
			uni.makePhoneCall({
			    phoneNumber: '13399728988'
			});
		},

        goToMall: function () {
            uni.navigateToMiniProgram({
                appId: 'wxc6b466d67e369e9e'
            });
        },

        fetchTempList(reset) {
            let { pageNum, pageSize, templates, hasMore } = this;

            if (reset) {
                pageNum = 1;
                hasMore = true;
            } else {
                if (!hasMore) {
                    return;
                }

                pageNum++;
            }

            return homeApi
                .listHotTemplate({
                    pageNum: pageNum,
                    pageSize: pageSize
                })
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

        getUserProfile(e) {
            // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
            uni.getUserProfile({
                desc: '展示用户信息',
                // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    console.log(res);
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                }
            });
        },

        getUserInfo(e) {
            // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
            console.log(e);
            this.setData({
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            });
        }
    }
};
</script>
<style>
@import './index.css';
</style>
