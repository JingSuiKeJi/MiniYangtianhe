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
	
	logout(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.logout,
	        data: reqData
	    }, page);
	}
	
	bindRecommend(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.bindRecommend,
	        data: reqData
	    }, page);
	}
    
	getAddressAdd(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.me.getAddressAdd,
	        data: reqData
	    }, page);
	}
	
	getAddressList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.me.getAddressList,
	        data: reqData
	    }, page);
	}
}

module.exports = new User();