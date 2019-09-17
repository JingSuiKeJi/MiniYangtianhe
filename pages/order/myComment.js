// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
let data = {
    commentList: [],
};
const onLoad = function (self) { 
    self.getData();
}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
    getData: function (e) {
        let self = this;
        self.getPageData();
    },
    getPageData: function (e) {
        let self = this;
        User.myCommentList(self, {
            page: self.data.page,
            pageSize: 10,
        }).then((ret) => {
			let data = ret.data;
			self.setData({
				commentList: data.list,
                hasNextPage: data.hasNextPage,
			})
        }, (err) => {

        });
    },
    deleteComment: function (id) {
        User.deleteComment(self, {
           id: id
        }).then((ret) => {
        }, (err) => {

        });
    },
    deleteBtn: function (e) {
        let self = this;
        self.deleteComment(e.currentTarget.dataset.id);
    }
}

// 有引用template时定义
const temps = {};

// 初始化页面page对象
const initPage = _g.initPage({
    data: data,
    onLoad: onLoad,
    onUnload: onUnload,
    onReady: onReady,
    onShow: onShow,
    methods: methods,
    temps: temps,
});
Page(initPage);