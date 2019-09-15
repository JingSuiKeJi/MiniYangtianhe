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
    list: [{
            sort: 'A',
            goodsInfo: [
                { logoUrl: 'zhongsheng.png', title: '人和药业' },
                { logoUrl: 'zhongsheng.png', title: '人和药业' },
                { logoUrl: 'zhongsheng.png', title: '人和药业' },
            ]
        },
        {
            sort: 'B',
            goodsInfo: [
                { logoUrl: 'zhongsheng.png', title: '人和药业' },
                { logoUrl: 'zhongsheng.png', title: '人和药业' }
            ]
        },
        {
            sort: 'C',
            goodsInfo: [
                { logoUrl: 'zhongsheng.png', title: '人和药业' },
                { logoUrl: 'zhongsheng.png', title: '人和药业' },
            ]
        },
    ]
};

// 页面onLoad方法
const onLoad = function(self) {
    self.setData({
        storeId: _g.getLS('storeInfo').id
    });
    self.getData();
};

// 页面onShow方法
const onShow = function(self) {
    self.getData();
};
const onUnload = function(self) {

}
// 页面中的方法
const methods = {
    getData: function() {
        var self = this;

        self.getBrandList();
        return

        // Platform.getBrandList(self, {
        //     platformFlag: 2,
        //     storeId: 1,
        //     page: 0
        // }).then((ret) => {
        //     let list = ret.data;
        //     // 对后端返回的无序数组进行操作成前端需求格式
        //     function fn(list) {
        //         var obj = {};
        //         var result = [];
        //         for (var i = 0; i < list.length; i++) {
        //             var key = list[i].initials;
        //             var product = {};
        //             for (var info in list[i]) {
        //                 if (info != 'initials') {
        //                     product[info] = list[i][info]
        //                 }
        //             }
        //             if (!obj[key]) {
        //                 obj[key] = [];
        //                 obj[key].push(product);
        //             } else {
        //                 obj[key].push(product)
        //             }
        //         };

        //         for (var cate in obj) {
        //             result.push({
        //                 initials: cate,
        //                 goodsInfo: obj[cate]
        //             })
        //         }
        //         return result;
        //     }
        //     console.log(1111, fn(list))
        //     const data = fn(list);
        //     self.setData({
        //         list: data
        //     });

        // }, (err) => {});
    },
    onDetailTap: function(e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/search/brandList'
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