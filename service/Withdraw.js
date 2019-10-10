const _g = require('../libs/base');
const _c = require('../libs/config');
const mini = _c.apiUrls;

//定义类
class Withdraw {

    constructor() {

    }

    apply(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.withdraw.apply,
            data: reqData,
        }, page);
    }

    getRecordList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.withdraw.getRecordList,
            data: reqData,
        }, page);
    }

    count(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.withdraw.count,
            data: reqData,
            lock: true,
            showToast: false,
            hideToast: true
        }, page);
    }

    detail(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.withdraw.detail,
            data: reqData,
        }, page);
    }
    
}

module.exports = new Withdraw();