import http from '../utils/http';
export const listBanner = (data) => http.doGet('/listBanner', data);
export const listCate = (data) => http.doGet('/listCate', data);
export const listHotTemplate = (data) => http.doGet('/listHotTemplate', data);
export const test404 = (data) => http.doGet('/404', data);
export const listAllFont = (data) => http.doGet('/listAllFont', data);
export const listCustomTypes = (data) => http.doGet('/listCustomTypes', data);
export const listCustomTypesV2 = (data) => http.doGet('/listCustomTypesV2', data);
export const fetchConfig = (data) => http.doGet('/fetchConfig', data);
