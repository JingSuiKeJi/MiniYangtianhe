const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Platform = require('../../service/Platfrom');
// 初始化数据
const data = {
    classifyList: [],
    contentList: [],
    title: '',
};

// 页面onLoad方法
const onLoad = function (self) {
    self.setData({
        platformFlag: self.data.platformFlag
    })
    self.getData();

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
        self.getClassifyList();
    },
    getClassifyList: function () {
        let self = this;
        Platform.getClassifyList(self, {
            platformFlag: self.data.platformFlag,
            level: 1
        }).then((ret) => {
            let data = ret.data;
            self.setData({
                classifyList: data,
                id: data[0].id,
                title: data[0].title
            });
            self.getSecClassifyList();
        }, (err) => {

        });
    },
    getSecClassifyList: function () {
        let self = this;
        Platform.getClassifyList(self, {
            platformFlag: self.data.platformFlag,
            parentId: self.data.id,
            level: 2
        }).then((ret) => {
            let data = ret.data;
            self.setData({
                contentList: data,
            });
        }, (err) => {

        });
    },
    onGetInput: function (e) {
        let self = this;
        self.setData({
            value: e.detail.value
        })
    },
    onSkipTap: function (e) {
        let self = this;
        let opts = e.target.dataset;
        let param = {
            platformFlag: self.data.platformFlag,
        }
        switch (opts.type) {
            case '1':
                param.value = self.data.title;
                param.classifyId = self.data.id;
                break;
            case '2':
                param.value = opts.title;
                param.classifyId = opts.id;
                break;
            default:
                    param.value = self.data.value;
                    break;
        }
        if (param.value == undefined) return;
        _g.navigateTo({
            url: 'pages/search/detailList',
            param: param
        }, self);
    },
    onChoseTap: function (e) {
        let self = this;
        let opts = e.target.dataset;
        self.setData({
            id: opts.id,
            title: opts.title
        });
        self.getSecClassifyList();
    },
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