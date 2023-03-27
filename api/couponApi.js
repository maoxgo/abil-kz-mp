import http from '../utils/http';
const prefix = '/coupon';

export const fetchByToken = (data) => http.doGet(prefix + '/fetchByToken', data);

export const fetchById = (data) => http.doGet(prefix + '/fetchById', data);

export const gain = (data) => http.doPost(prefix + '/gain', data);