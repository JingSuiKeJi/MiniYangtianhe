// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Point = require('../../service/Point');

let data = {
    points: 0,
    showModal: false, //模态框显影
    bissNum: '', //核销额度
    // storeId: 27,
};
const onLoad = function(self) {
    self.getBase();
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
    getBase() {
        const self = this;
        Point.getBaseInfo(self, {}).then((ret) => {
            self.setData({
                points: ret.data.points
            });
            self.data.setting = ret.data.setting;
        });
    },
    //显示模态框
    showDialogBtn: function() {
        const self = this;
        if (self.data.bissNum <= 0) {
        	_g.toast({
        		title: '请输入福气值'
        	});
        	return
        }
        if (self.data.bissNum > self.data.points) {
        	_g.toast({
        		title: '请输入正确福气值'
        	});
        	return
        }
        self.setData({
            showModal: true
        })
    },
    //隐藏模态框
    hideModal: function() {
        const self = this;
        self.setData({
            showModal: false
        });
    },
    //关闭模态框
    onCancel: function() {
        const self = this;
        self.hideModal();
    },
    //确认信息
    onConfirm: function() {
        const self = this;
        Point.verifier(self, {
        	points: self.data.bissNum,
        	storeId: self.data.storeId
        }).then((ret) => {
            _g.toast({
                title: '核销成功',
                icon: 'success',
                duration: 4000,
                success() {
                	setTimeout(()=>{
                		_g.navigateBack();
                	}, 3000);
                }
            });
        })
        // _g.navigateTo({
        //     url: 'pages/me/blissDetail',
        // }, self);
        // self.hideModal();
    },
    //核销额度input
    bissNumInput: function(e) {
        const self = this;
        self.setData({
            bissNum: e.detail.value
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