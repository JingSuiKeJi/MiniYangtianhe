const _g = require('../libs/base');
const _c = require('../libs/config');
const mini = _c.apiUrls;

//定义类
class Store {

    constructor() {

    }

    storeList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.store.storeList,
            data: reqData
        }, page);
    }
    applyDetail(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.store.applyDetail,
            data: reqData
        }, page);
    }
    updateApply(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.store.updateApply,
            data: reqData
        }, page);
    }
    selectStore(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.store.selectStore,
            data: reqData
        }, page);
    }
}

module.exports = new Store();