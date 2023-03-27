import http from '../utils/http';
const prefix = '/my/coupon';

export const page = (data) => http.doGet(prefix + '/page', data);

export const give = (data) => http.doPost(prefix + '/give', data);

export const cancelGive = (data) => http.doPost(prefix + '/cancelGive', data);
