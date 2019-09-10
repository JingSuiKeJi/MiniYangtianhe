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
}

module.exports = new Store();