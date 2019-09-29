// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const User = require('../../service/User');
const Order = require('../../service/Order');
const Point = require('../../service/Point.js');

let data = {

};
const onLoad = function (self) {
    let data = {};
    if (self.data.points) {
        data.pointsNum = self.data.points
    }
    if (self.data.memberId) {
        data.memberId = self.data.memberId
    }
    self.setData(data);
    self.getData();
}
const onShow = function (self) { 

}
const onReady = function (self) { }
const onUnload = function (self) { }
const methods = {
    getData: function () {
        let self = this;
        self.getBase();
    },
    gift: function () {
        let self = this;
        Point.gift(self, {
        	points: self.data.num,
        	memberId: self.data.memberId
        }).then((ret) => {
        	_g.toast({
        		title: '赠送成功'
            });
            _g.navigateTo({
                url: 'pages/me/finish',
                param: {
                   list: ret.data 
                }
            },self)
        }, (err)=>{
        	_g.toast({
        		title: '赠送失败'
        	});
        });
    },
    getBase() {
        const self = this;
        Point.getBaseInfo(self, {}).then((ret) => {
            self.setData({
                money: ret.data.setting.pointsExchangeVO.money*100,
                points: ret.data.setting.pointsExchangeVO.points*100
            });
        });
    },
    onDonateTap: function () {
        let self = this;
        if (!self.data.memberId){
            _g.toast({title: '请选择要赠送的用户'});
            return;
        } 
        if (!self.data.num) {
            _g.toast({title: '请输入要赠送的福气数量'});
            return;
        }
        self.gift();

    },
    onSkipsTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/step/myFriends',
            param: {
                from: 'donate'
            }
        },self)
    },
    onGetNum: function (e) {
        let self = this;
        self.setData({
            num: e.detail.value
        })
    },
    onGetInput: function (e) {
        let self = this;
        self.setData({
            memberId: e.detail.value
        })
    },
    
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