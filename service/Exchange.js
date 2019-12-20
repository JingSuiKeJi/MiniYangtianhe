const _g = require('../libs/base');
const _c = require('../libs/config');
const mini = _c.apiUrls;

//定义类
class Exchange {

    constructor() {

    }
    exchangeList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.exchange.exchangeList,
            data: reqData
        }, page);
    }
    preOrder(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.exchange.preOrder,
            data: reqData
        }, page);
    }
    placeOrder(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.exchange.placeOrder,
            data: reqData
        }, page);
    }
    prizeOrderDetail(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.exchange.prizeOrderDetail,
            data: reqData
        }, page);
    }
    prePay(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.exchange.prePay,
            data: reqData
        }, page);
    }
    prizeOrderTraces(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.exchange.prizeOrderTraces,
            data: reqData
        }, page);
    }
    
    
}

module.exports = new Exchange();