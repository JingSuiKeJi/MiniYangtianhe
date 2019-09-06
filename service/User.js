const _g = require('../libs/base');
const _c = require('../libs/config');
const mini = _c.apiUrls;

//定义类
class User {

    constructor() {

    }
    login(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.user.login,
            data: reqData
        }, page);
    }

    getMyInfo(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.user.getMyInfo,
            data: reqData
        }, page);
    }
    
}

module.exports = new User();