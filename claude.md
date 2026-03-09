# Taklip 小程序项目

## 项目概述

- **项目名称**：Taklip
- **项目类型**：微信小程序（uni-app + Vue.js）
- **主要功能**：请帖/邀请函制作、模板管理、嘉宾管理、优惠券、商户展示
- **目标用户**：需要制作婚礼请帖、生日请帖等邀请函的用户

## 技术栈

### 框架与语言

- **框架**：uni-app + Vue.js (支持 Vue2/Vue3)
- **UI 组件**：Vant Weapp、WeUI

### 核心依赖

- `miniprogram-api-promise` - Promise 化微信 API
- `miniprogram-computed` - 计算属性支持
- `moment` - 日期处理
- `wxml-to-canvas` - 小程序 canvas 渲染

### 状态管理与工具

- **状态管理**：Vuex (store/index.js)，模块化结构
- **HTTP 请求**：utils/http.js 封装 wx.request
- **工具函数**：utils/util.js, utils/qkUtils.js

## 目录结构

```
abil-mp/
├── api/                    # API 接口
│   ├── couponApi.js        # 优惠券
│   ├── myInvitation.js    # 请帖接口
│   ├── orderApi.js        # 订单接口
│   ├── bms/               # 商户管理 API
│   │   ├── merchant.api.js
│   │   └── serviceType.api.js
│   └── sys/               # 系统 API (地区等)
├── pages/                  # 页面
│   ├── index/              # 首页
│   ├── template/           # 模板列表/详情
│   ├── my/                 # 我的（登录、请帖、优惠券等）
│   │   └── invitation/    # 请帖相关页面
│   ├── merchant/          # 商户列表/详情
│   └── coupon/             # 优惠券页面
├── components/             # 组件
├── store/                  # Vuex 状态管理
│   ├── index.js           # 主 store
│   └── modules/           # 模块
│       ├── bms.module.js  # 商户模块
│       └── data.module.js # 数据模块
├── utils/                  # 工具函数
│   ├── http.js             # HTTP 请求封装
│   ├── util.js             # 通用工具
│   ├── qkUtils.js          # 请帖相关工具
│   └── templateUtils.js    # 模板工具
├── config/                 # 配置文件
│   └── index.js           # API 基地址等
├── helper/                 # 辅助工具
├── filters/               # Vue 过滤器
├── polyfill/              # 兼容 polyfill
├── main.js                 # 入口文件
├── App.vue                 # 应用根组件
├── pages.json              # 页面路由配置
└── manifest.json           # 应用配置
```

## 页面路由 (pages.json)

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | pages/index/index | 模板列表 |
| 模板列表 | pages/template/list | 模板列表页 |
| 模板详情 | pages/template/detail | 模板详情页 |
| 我的请帖列表 | pages/my/invitation/list | 我的请帖 |
| 创建请帖 | pages/my/invitation/create-info | 制作请帖 |
| 编辑请帖 | pages/my/invitation/edit-info | 编辑请帖 |
| 编辑请帖数据 | pages/my/invitation/edit-data | 编辑请帖内容 |
| 请帖详情 | pages/my/invitation/detail | 请帖详情 |
| 嘉宾列表 | pages/my/invitation/guest-list | 嘉宾管理 |
| 添加嘉宾 | pages/my/invitation/guest-add | 添加嘉宾 |
| 请帖打印 | pages/my/invitation/print | 印刷服务 |
| 优惠券 | pages/coupon/coupon | 优惠券页 |
| 我的优惠券 | pages/my/coupons/coupons | 我的优惠券 |
| 商户列表 | pages/merchant/list/list | 商户列表 |
| 商户详情 | pages/merchant/detail/detail | 商户详情 |
| 登录 | pages/my/login | 登录页 |
| 绑定手机 | pages/my/bindingTel | 绑定手机号 |

## API 请求封装 (utils/http.js)

### 导出函数

- `doGet(url, data)` - GET 请求
- `doPost(url, data)` - POST 请求
- `doUpload(url, filePath)` - 文件上传

### 特性

- 自动添加 Authorization header (token)
- 统一错误处理
- 返回 `data.data` 作为成功结果
- 支持 Promise 异步调用

### 使用示例

```javascript
import http from '@/utils/http';

// GET 请求
const data = await http.doGet('/api/path', { param: 'value' });

// POST 请求
const result = await http.doPost('/api/path', { key: 'value' });
```

## 状态管理 (Vuex)

### 主 Store (store/index.js)

- `state.adcode` - 地区编码

### 模块

- `store.modules.bms` - 商户模块 (serviceTypes 服务类型)
- `store.modules.data` - 数据模块

### 使用方式

```javascript
// 在组件中
this.$store.state.adcode
this.$store.dispatch('updateAdcode', '110000')

// 在 API 文件中
import { fetchIpAddress } from '@/api/home';
```

## 配置信息 (config/index.js)

### API 基地址

```javascript
// 开发环境
baseUrl: 'http://127.0.0.1:8880'

// 生产环境
baseUrl: 'https://ma.taklipnama.com'
```

### Token 存储

- 键名：`access_token`
- 存储方式：`uni.setStorageSync('access_token', token)`

## 开发规范

### 组件开发

- 使用 Vue 单文件组件 (.vue)
- 支持 Vue2/Vue3 语法兼容
- 使用 uni-app 条件编译 (#ifdef MP-WEIXIN)

### API 接口规范

- 统一放置在 api/ 目录
- 使用 http.doGet / http.doPost / http.doUpload
- 错误处理：reject 时返回错误消息

### 页面跳转

- 使用 uni.navigateTo / uni.redirectTo
- 参数传递：URL query 字符串

### 样式

- 支持 SCSS (如 pages/index/index.scss)
- 全局样式：app.css