const _g = require('../libs/base');
const _c = require('../libs/config');
const mini = _c.apiUrls;

//定义类
class Order {

    constructor() {

    }

    placeOrder(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.order.placeOrder,
            data: reqData,
            lock: true
        }, page);
    }
    preOrder(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.order.preOrder,
            data: reqData
        }, page);
    }
    commentOrder(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.order.commentOrder,
            data: reqData
        }, page);
    }
    myOrderList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.order.myOrderList,
            data: reqData
        }, page);
    }
    myOrderDetail(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.order.myOrderDetail,
            data: reqData
        }, page);
    }
    cancelOrder(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.order.cancelOrder,
            data: reqData
        }, page);
    }
    confirmOrder(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.order.confirmOrder,
            data: reqData
        }, page);
    }
    prePay(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.order.prePay,
            data: reqData,
            lock: true
        }, page);
    }
    preOrderCart(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.order.preOrderCart,
            data: reqData
        }, page);
    }
    addressList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.order.addressList,
            data: reqData
        }, page);
    }
    getDeliveryTime(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.order.getDeliveryTime,
            data: reqData
        }, page);
    }
    goodsCouponList(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.goodsCouponList,
			data: reqData
		}, page);
	}
    preferentialPolicies(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.preferentialPolicies,
			data: reqData
		}, page);
    }
    getAfterSale(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.getAfterSale,
			data: reqData
		}, page);
	}
    appayBefore(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.appayBefore,
			data: reqData
		}, page);
    }
    afterSaleApply(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.afterSaleApply,
			data: reqData
		}, page);
    }
    afterorderList(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.afterorderList,
			data: reqData
		}, page);
    }
    afterorderDetails(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.afterorderDetails,
			data: reqData
		}, page);
    }
    logistics(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.logistics,
			data: reqData
		}, page);
    }
    subLogistics(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.subLogistics,
			data: reqData
		}, page);
    }
    cancelAfterSale(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.cancelAfterSale,
			data: reqData
		}, page);
    }
    orderTraces(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.orderTraces,
			data: reqData
		}, page);
    }
    checkPlaceOrder(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.checkPlaceOrder,
            data: reqData,
            showToast: false,
            hideToast: true
		}, page);
    }
    getOrderAfterSaleList(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.getOrderAfterSaleList,
            data: reqData,
            showToast: false,
            hideToast: true
		}, page);
	}
}

module.exports = new Order();