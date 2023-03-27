import http from '../utils/http';
const prefix = '/my/invitationPrint';
export const fetchGoods = (data) => http.doGet(prefix + '/fetchGoods', data);
export const createPrintOrder = (data) => http.doPost(prefix + '/createPrintOrder', data);
