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
            data: reqData
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
            data: reqData
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
	selectCoupon(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.selectCoupon,
			data: reqData
		}, page);
	}
	selectIntegral(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.order.selectIntegral,
			data: reqData
		}, page);
	}
    
}

module.exports = new Order();