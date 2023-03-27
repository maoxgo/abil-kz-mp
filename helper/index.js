import * as orderApi from '@/api/orderApi.js'

/**
 * 检测请帖是否支付
 * @param {Object} item
 */
function checkInvitationPay(item) {
	if (item.price <= 0) {
	    return false;
	}
	
	if (item.payStatus == 40) {
	    return false;
	}
	uni.navigateTo({
		url: "/pages/my/order/createInvitationOrder/createInvitationOrder?invitationId="+item.id
	})
	return true
}


function filterInvitation(item) {
	if (item.price > 0 && item.payStatus != 40) {
		item.needPay = true;
	} else {
		item.needPay = false;
	}
	const app = getApp();
	item.priceStr = (item.price / 100).toFixed(2);
	item.extendInfo = JSON.parse(item.extendInfo);
	const cate = app.globalData.cates.find((cate) => cate.id == item.cateId);

	if (cate) {
		item.cateName = cate.name;
	} else {
		item.cateName = '';
	}
}

function preparePayment(order, cb) {
	if (!order) {
		cb(new Error('订单不存在'))
		return
	}
	if (order.status >=80) {
		cb(new Error('订单已取消'))
		return
	}
	if (order.status>=40) {
		cb(null, 1)
		return
	}
	uni.showModal({
	    confirmText: '前往支付',
		cancelText: '取消订单',
	    showCancel: true,
	    title: `${order.goodsTitle}: ${(order.totalPrice / 100).toFixed(2)}元`,
	    // content: '￥'+ (item.price/100).toFixed(2),
	    // title: `请帖使用费￥${(item.price / 100).toFixed(2)}元(赠送50个积分)`,
	    // content: '付款后获得请帖使用权，会去除请帖水印',
	    success: async (result) => {
	        if (result.cancel) {
				try{
					await orderApi.cancelOrder({ id: order.id })
					cb(null, 0)
				}catch(e){
					//TODO handle the exception
					console.error(e)
					cb(e)
				}
	            return;
	        } else if (result.confirm) {
				uni.showLoading({
				    title: '生成支付单中',
				    mask: true
				});
					
				try {
				    const [err, res1] = await uni.login();
					if (err) {
						throw err
					}
				    const {result, payment} = await orderApi.preparePayment({
				        orderNo: order.orderNo,
				        authCode: res1.code
				    });
				    console.log(payment);
					uni.hideLoading({
					    success: (res) => {}
					});
					if (result == 0) {
						cb(null, 0)
						return
					}
				    
				    const [err3, res3] = await uni.requestPayment({
				        nonceStr: payment.nonceStr,
				        package: payment.packageValue,
				        paySign: payment.paySign,
				        timeStamp: payment.timeStamp,
				        signType: payment.signType
				    });
					if (err3) {
						throw err3
					}
				    uni.showLoading({
				        title: '订单处理中',
				        mask: true
				    });
				    setTimeout(() => {
				        uni.hideLoading({
				            success: (res) => {}
				        });
					
				        if (cb) {
				            cb();
				        }
				    }, 5000);
				} catch (err) {
				    console.error(err);
				    uni.hideLoading({
				        success: (res) => {}
				    });
					cb(err)
				}
			} else {
				cb(null, null)
			}
	        
	    },
	    fail: (res) => {},
	    complete: (res) => {}
	});
}

export default {
	checkInvitationPay,
	filterInvitation,
	preparePayment,
}