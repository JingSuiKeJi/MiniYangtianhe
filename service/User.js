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
	getPoster(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getPoster,
	        data: reqData
	    }, page);
	}
	msgToggle(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.msgToggle,
	        data: reqData
	    }, page);
	}
	getCouponList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getCouponList,
	        data: reqData
	    }, page);
	}
	getCompanyList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getCompanyList,
	        data: reqData
	    }, page);
	}
	apply(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.apply,
	        data: reqData
	    }, page);
	}
	getBaseInfo(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getBaseInfo,
	        data: reqData
	    }, page);
	}
	getClientList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getClientList,
	        data: reqData
	    }, page);
	}
	getClientDetail(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getClientDetail,
	        data: reqData
	    }, page);
	}
	getClientAddress(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getClientAddress,
	        data: reqData
	    }, page);
	}
	getClientOrder(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getClientOrder,
	        data: reqData
	    }, page);
	}
	getLeyouList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getLeyouList,
	        data: reqData
	    }, page);
	}
	chooseDefault(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.chooseDefault,
	        data: reqData
	    }, page);
	}
	deleteAddress(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.deleteAddress,
	        data: reqData
	    }, page);
	}
	myCommentList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.myCommentList,
	        data: reqData
	    }, page);
	}
	deleteComment(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.deleteComment,
	        data: reqData
	    }, page);
	}

}

module.exports = new User();