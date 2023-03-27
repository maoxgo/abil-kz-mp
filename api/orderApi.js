import http from '../utils/http';
const prefix = '/order';


export const fetchByNo = (data) => http.doGet(prefix + '/fetchByNo', data);

export const createInvitationOrder = (data) => http.doPost(prefix + '/createInvitationOrder', data);

export const cancelOrder = (data) => http.doPost(prefix + '/cancelOrder', data);

export const preparePayment = (data) => http.doPost(prefix + '/preparePayment', data);
