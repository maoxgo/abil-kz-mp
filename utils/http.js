import config from '../config/index.js';
const baseUrl = config.baseUrl;
export function doGet(url, data) {
    const token = uni.getStorageSync('access_token');
    const headers = {};

    if (token) {
        headers['Authorization'] = token;
    }

    return new Promise((resolve, reject) => {
        uni.request({
            url: baseUrl + url,
            method: 'GET',
            data: data || {},
            header: headers,
            success: ({ data, statusCode }) => {
                if (statusCode >= 200 && statusCode < 300) {
                    if (data.code) {
                        reject(data.msg);
                    } else {
                        resolve(data.data);
                    }
                } else {
                    reject('Http error: ' + statusCode);
                }
            },
            fail: (result) => {
                reject(result);
            }
        });
    });
}
export function doPost(url, data) {
    const token = uni.getStorageSync('access_token');
    const headers = {};

    if (token) {
        headers['Authorization'] = token;
    }

    return new Promise((resolve, reject) => {
        uni.request({
            url: baseUrl + url,
            method: 'POST',
            data: data || {},
            header: headers,
            success: (result) => {
                const { data, statusCode } = result;

                if (statusCode >= 200 && statusCode < 300) {
                    if (data.code) {
                        reject(data.msg);
                    } else {
                        resolve(data.data);
                    }
                } else {
                    reject('Http error: ' + statusCode);
                }
            },
            fail: (result) => {
                reject(result);
            }
        });
    });
}
export function doUpload(url, filePath) {
    const token = uni.getStorageSync('access_token');
    const headers = {};

    if (token) {
        headers['Authorization'] = token;
    }

    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: baseUrl + url,
            filePath: filePath,
            name: 'file',
            header: headers,
            success: (result) => {
                console.log(result);
                let { data, statusCode } = result;

                if (statusCode >= 200 && statusCode < 300) {
                    if (typeof data == 'string') {
                        data = JSON.parse(data);
                    }

                    if (data.code) {
                        reject(data.msg);
                    } else {
                        resolve(data.data);
                    }
                } else {
                    reject('Http error: ' + statusCode);
                }
            },
            fail: (result) => {
                reject(result);
            }
        });
    });
}
export default {
    data() {
        return {};
    },
    doGet: doGet,
    doPost: doPost,
    doUpload: doUpload
};
