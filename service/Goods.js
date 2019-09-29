const _g = require('../libs/base');
const _c = require('../libs/config');
const mini = _c.apiUrls;

//定义类
class Goods {

    constructor() {

    }
    getGoodsDetail(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.getGoodsDetail,
            data: reqData
        }, page);
    }
    addCart(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.addCart,
            data: reqData,
            lock: true
        }, page);
    }
    cartList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.cartList,
            data: reqData
        }, page);
    }
    addNum(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.addNum,
            data: reqData
        }, page);
    }
    subtractNum(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.subtractNum,
            data: reqData,
            lock: true
        }, page);
    }
    deleteCart(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.deleteCart,
            data: reqData
        }, page);
    }
    batchDeleteCart(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.batchDeleteCart,
            data: reqData
        }, page);
    }
    getCommentList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.getCommentList,
            data: reqData
        }, page);
    }
    getHotSearchList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.getHotSearchList,
            data: reqData
        }, page);
    }
    placeOrder(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.placeOrder,
            data: reqData
        }, page);
    }
    getAssembleList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.getAssembleList,
            data: reqData
        }, page);
    }
    getBrandDetail(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.getBrandDetail,
            data: reqData
        }, page);
    }
    listCut(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.listCut,
            data: reqData
        }, page);
    }
    cutDetail(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.cutDetail,
            data: reqData
        }, page);
    }
    createCut(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.createCut,
            data: reqData
        }, page);
    }
    helpCut(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.helpCut,
            data: reqData
        }, page);
    }
    myCut(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.goods.myCut,
            data: reqData
        }, page);
    }
    
}

module.exports = new Goods();