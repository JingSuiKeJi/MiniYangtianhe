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
	
	logout(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.logout,
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
    getLeyouList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.user. getLeyouList,
            data: reqData
        }, page);
    }
    getRecordList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.user.getRecordList,
            data: reqData
        }, page);
    }
	getAddressList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getAddressList,
	        data: reqData
	    }, page);
	}
	getAddressAdd(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getAddressAdd,
	        data: reqData
	    }, page);
	}
	bindWX(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.bindWX,
	        data: reqData
	    }, page);
	}
	sendCode(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.sendCode,
	        data: reqData
	    }, page);
	}
	bindPhone(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.bindPhone,
	        data: reqData
	    }, page);
	}
}

module.exports = new User();