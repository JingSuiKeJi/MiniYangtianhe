// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
// const User = require('../../service/User');
const Exchange = require('../../service/Exchange');

let data = {
    current: 1,
    list: []
};
const onLoad = function (self) {
    self.getData();
}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }

const methods = {
    getData: function () {
        const self = this;
        self.getPageData();
    },
    getPageData: function () {
        const self = this;
        Exchange.exchangeList(self, {
            page: self.data.page,
            pageSize: 20,
            type: self.data.current,
        }).then((res) => {
            let timeList = []
            let list = res.data.list;
            if (list.length) {
                list = list.concat(self.data.list);
                _.sortBy(list, 'createTime');
                list.map((item,index) => {
                    let time = new Date(item.createTime * 1000).Format('yyyy-MM-dd');
                    item.time = time;
                    if (index == 0) {
                        item.showTime = true;
                        timeList.push(time);
                    }else if(timeList.indexOf(time) == -1 & index !=0){
                        item.showTime = true;
                        timeList.push(time)
                    }  
                }); 

            }
            self.setData({
                list: list
            })
        }, (err) => {
        });
    },
    onNavChange: function (e) {
        const self = this;
        self.setData({
            current: Number(e.currentTarget.dataset.current),
            list: [],
            page: 1
        });
        self.getPageData();
    },
    onSubmitTap: function(e) {
        const self = this;
        _g.navigateTo({
            url: 'pages/exchange/submit',
            param: {
                awardId: e.currentTarget.dataset.id
            }
        },self)
    },
    onCheckOrder: function (e) {
        const self = this;
        _g.navigateTo({
            url: 'pages/exchange/exchangeOrderDetail',
            param: {
                prizeOrderId: e.currentTarget.dataset.id
            }
        },self)
    },
    onUseTap: function (e) {
        const self = this;
        let opts = e.currentTarget.dataset;
        let param = {};
        if (opts.type <=2) {
            param.platformFlag = 1;
        }else {
            param.platformFlag = 2;
        }
        _g.navigateTo({
            url: 'pages/search/detailList',
            param: param
        },self)
    },
}

const temps = {

}


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