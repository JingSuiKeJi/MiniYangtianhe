const _g = require('../libs/base');
const _c = require('../libs/config');
const mini = _c.apiUrls;

//定义类
class Point {

    constructor() {

    }
    getBaseInfo(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.point.getBaseInfo,
            data: reqData
        }, page);
    }
    prePay(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.point.prePay,
            data: reqData
        }, page);
    }
    charge(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.point.charge,
            data: reqData
        }, page);
    }
    getRecordList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.point.getRecordList,
            data: reqData
        }, page);
    }
    gift(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.point.gift,
            data: reqData
        }, page);
    }
    verifier(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.point.verifier,
            data: reqData
        }, page);
    }
}

module.exports = new Point();