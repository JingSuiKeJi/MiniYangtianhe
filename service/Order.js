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
            url: mini.store.placeOrder,
            data: reqData
        }, page);
    }
    common(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.store.common,
            data: reqData
        }, page);
    }
}

module.exports = new Order();