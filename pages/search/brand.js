// pages/search/brand.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Platform = require('../../service/Platfrom');
// 初始化数据
const data = {
    storeId: 0,
    // 锚点列表
    targetList: ['hot', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'],
    toView: '',
    imgBottomList: [],
    list: [],
    labelList: []
};

// 页面onLoad方法
const onLoad = function(self) {
    self.setData({
        storeId: _g.getLS('storeInfo').id,
        platformFlag: self.data.platformFlag
    });
    self.getData();
};

// 页面onShow方法
const onShow = function(self) {
};
const onUnload = function(self) {

}
// 页面中的方法
const methods = {
    getData: function() {
        let self = this;
        self.getBrandList();
        self.getBrandLabelList();
        return
    },
    getBrandLabelList: function () {
        let self = this;
        Platform.getBrandLabelList(self, {
            platformFlag: self.data. platformFlag 
        }).then((ret) => {
            self.setData({
                labelList: ret.data
            })

        }, (err) => {});
    },
    onDetailTap: function(e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/search/brandList',
            param: { 
                id: e.currentTarget.dataset.id,
                platformFlag: self.data.platformFlag
            }
        }, self)
    },
    //锚点跳转
    onJumpToTap: function(e) {
        const self = this;
        // 获取标签元素上自定义的 data-opt 属性的值
        let target = e.currentTarget.dataset.opt;
        self.setData({
            toView: target
        })
    },
    getBrandList() {
        const self = this;
        let data = {
            platformFlag: self.data.platformFlag,
            page: 0
        };
        if (self.data.platformFlag == 2) {
            data.storeId = self.data.storeId;
        }
        let list = [];
        let initialsList = [];
        let nowInitials = '';
        let brandList = [];
        Platform.getBrandList(self, data).then((ret) => {
            list = _.sortBy(ret.data, 'initials');

            brandList = _.map(_.sortBy(list, 'initials'), (item, index) => {
                item.initials = item.initials.toUpperCase();
                if (index == 0) {
                    nowInitials = item.initials;
                    initialsList.push(item.initials);
                    item.showInitials = true;
                } else if (initialsList.indexOf(item.initials) < 0){
                    initialsList.push(item.initials);
                    nowInitials = item.initials;
                    item.showInitials = true;
                }
                return item;
            });
            self.setData({
                list: brandList,
                targetList: initialsList
            })
        }, (err) => {

        });
        
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