const _g = require('../libs/base');
const _c = require('../libs/config');
const mini = _c.apiUrls;

//定义类
class Platfrom {

    constructor() {

    }

    getCurrTime(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.platfrom.getCurrTime,
            data: reqData
        }, page);
    }
    getCommonData(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.platfrom.getCommonData,
            data: reqData
        }, page);
    }
    getSecKill(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.platfrom. getSecKill,
            data: reqData
        }, page);
    }
    getRecommend(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.platfrom.getRecommend,
            data: reqData
        }, page);
    }
    getStoreList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.platfrom.getStoreList,
            data: reqData
        }, page);
    }
    getStoreInfo(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.platfrom.getStoreInfo,
            data: reqData
        }, page);
    }
    getClassifyList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.platfrom.getClassifyList,
            data: reqData
        }, page);
    }
    getBrandList(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.platfrom.getBrandList,
            data: reqData
        }, page);
    }
	getOccasion(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.platfrom.getOccasion,
	        data: reqData
	    }, page);
	}
	getAssembleList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.platfrom.getAssembleList,
	        data: reqData
	    }, page);
	}
	getUserAssembleList(page, reqData) {
	    _g.dm.canLoadMore = 1;
	    return _g.ajax({
	        url: mini.platfrom.getUserAssembleList,
	        data: reqData
	    }, page);
	}
    login (page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.platfrom.login,
            data: reqData
        }, page);
    }
    getArticle(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.user.getArticle,
            data: reqData
        }, page);
    }
    getStepInfo(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.user.getStepInfo,
            data: reqData
        }, page);
    }
    getShareQR(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.user.getShareQR,
            url: mini.user. getStepInfo,
            data: reqData
        }, page);
    }

}

module.exports = new Platfrom();
