import http from '../utils/http';
const prefix = '/template';
export const listTemplate = (data) => http.doGet(prefix + '/listTemplate', data);
export const fetchTemplate = (data) => http.doGet(prefix + '/fetchTemplate', data);
