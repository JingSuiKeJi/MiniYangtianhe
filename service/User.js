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
	update(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.update,
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
	bindRecommend(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.bindRecommend,
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

	getVerifierList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getVerifierList,
	        data: reqData
	    }, page);
	}
	deleteVerifier(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.deleteVerifier,
	        data: reqData
	    }, page);
	}
	searchVerifier(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.searchVerifier,
	        data: reqData
	    }, page);
	}
	addVerifier(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.addVerifier,
	        data: reqData
	    }, page);
	}
	getOrderList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getOrderList,
	        data: reqData
	    }, page);
	}
	getOrderDetail(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getOrderDetail,
	        data: reqData
	    }, page);
	}
	verification(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.verification,
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
	getCommissionBaseInfo(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getCommissionBaseInfo,
	        data: reqData
	    }, page);
	}
	getCommissionClientList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getCommissionClientList,
	        data: reqData
	    }, page);
	}
	getCommissionRecordList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.getCommissionRecordList,
	        data: reqData
	    }, page);
	}
	withdrawRecordList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.withdrawRecordList,
	        data: reqData
	    }, page);
	}
	count(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.count,
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
	withdrawDetail(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.user.withdrawDetail,
	        data: reqData
		}, page);
	}
	getFinanceInfo(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.user.getFinanceInfo,
			data: reqData
		}, page);
	}
	getVerifierInfo(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.user.getVerifierInfo,
			data: reqData
		}, page);
	}
	getVerifierQR(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.user.getVerifierQR,
			data: reqData
		}, page);
	}
	verifyOrder(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.user.verifyOrder,
			data: reqData
		}, page);
	}
	rankingList(page, reqData) {
		_g.dm.canLoadMore = 1;
		return _g.ajax({
			url: mini.user.rankingList,
			data: reqData
		}, page);
	}
}

module.exports = new User();