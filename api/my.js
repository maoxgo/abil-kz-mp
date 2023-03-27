import http from '../utils/http';
export const fetchUserInfo = (data) => http.doGet('/my/fetchUserInfo', data);
export const updateUserInfo = (data) => http.doPost('/my/updateUserInfo', data);
export const wxAuth = (data) => http.doPost('/my/wxAuth', data);
export const wxBindingTel = (data) => http.doPost('/my/wxBindingTel', data);
