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
    signHome(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.store.signHome,
            data: reqData
        }, page);
    }
    signIn(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.store.signIn,
            data: reqData
        }, page);
    }
    qrCodeCenter(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.store.qrCodeCenter,
            data: reqData
        }, page);
    }
    signMyFriend(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.store.signMyFriend,
            data: reqData
        }, page);
    }
    taskSignIn(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.store.taskSignIn,
            data: reqData
        }, page);
    }
    taskSignHome(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.store.taskSignHome,
            data: reqData
        }, page);
    }
    listTaskCenter(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.store.listTaskCenter,
            data: reqData
        }, page);
    }


}

module.exports = new Store();