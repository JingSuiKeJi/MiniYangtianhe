// pages/step/myFriends.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const User = require('../../service/User');
// 初始化数据
const data = {
    type: 1,
    list: [],
    title: '我的乐友',
    hideModal: true, //true-隐藏  false-显示
	nimationData: {},//
	value: '',
};

// 页面onLoad方法
const onLoad = function (self) {
    self.getData();  
    if (self.data.from) {
        self.setData({
            from: self.data.from,
            title: '赠送福气'
        })
    }

};

// 页面onShow方法
const onShow = function (self) {

};
const onUnload = function (self) {

}
// 页面中的方法
const methods = {
    getData: function () {
        let self = this;
        self.getPageData();
    },
    getPageData: function () {
        let self = this;
        User.getLeyouList(self, {
            page: 0,
            // pageSize: 0,
			level: self.data.type,
			memberId: self.data.value

        }).then((ret) => {
            let data = ret.data;
            self.setData({
                list: data.list,
                hasNextPage: data.hasNextPage
            })
        }, (err) => {
        });
    },
    onChoseTap: function (e) {
        let self = this;
        self.setData({
            type: Number(e.target.dataset.type)
        });
        self.getPageData();
    },
    onGetInput: function (e) {
        let self = this;
        self.setData({
            value: e.detail.value
        })
    },
    onSkipTap: function (e) {
        let self = this;
        self.getData();
    },
    showModal: function (e) {
		let  self = this;
        if (!self.data.from) return;
        self.setData({
			hideModal: false,
			index: e.currentTarget.dataset.index
        })
    },
    // 隐藏遮罩层
    hideModal: function () {
        let self = this;
        self.setData({
            hideModal: true
        })
    },
    onSureTap: function (e) {
		let self = this;
		let index = self.data.index;
        //返回上一个页面，并传参
        _g.getPrevPage().setData({
			memberId: self.data.list[index].memberId
        });
        _g.navigateBack();
    }


};

// 有引用template时定义
const temps = {};

// 初始化页面page对象
const initPage = _g.initPage({
    data: data,
    onLoad: onLoad,
    onShow: onShow,
    methods: methods,
    onUnload: onUnload
});
Page(initPage);