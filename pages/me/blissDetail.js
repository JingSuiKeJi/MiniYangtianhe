// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Point = require('../../service/Point');

let data = {
    withdrawlist: [],
    showModal: false, //充值模态框显影
    showPresentedBtn: false, //赠送模态框显影
    setting: {},
    points: 0,
    rechargePoint: '',
    giftPoint: '',
    giftMember: '',
    height: 0,
    scrollHeight: 0

};
const onLoad = function(self) {
   
    self.getBase();
    self.getPageData();
};
const onShow = function(self) {
    self.getBase();
};
const onReady = function(self) {
    let systemInfo = _g.getLS(_c.LSKeys.systemInfo);
    let screenHeight = systemInfo.screenHeight;
    let height = parseInt(screenHeight*908/1344); 
    let scrollHeight = height - parseInt(screenHeight*88/1344); 
    self.setData({height,scrollHeight})
    console.log(666,height,scrollHeight);
};
const onUnload = function(self) {};
const methods = {
    getBase() {
        const self = this;
        Point.getBaseInfo(self, {}).then((ret) => {
            self.setData({
                setting: ret.data.setting,
                points: ret.data.points
            });
        });
    },
    //充值模态框
    showDialogBtn: function() {
        let self = this;
        if (!self.data.setting.isAllowCharge) {
            _g.toast({
                title: '充值功能正在维护中'
            });
            return;
        }
        this.setData({
            showModal: true
        })
    },
    hideModal: function() {
    	const self = this;
        self.setData({
        	rechargePoint: '',
            showModal: false
        });
        self.getBase();
    },
    onCancel: function() {
        this.hideModal();
    },
    onConfirm: function() {
        const self = this;
        if (self.data.rechargePoint < 10) {
            _g.toast({
                title: '请输入至少100福气'
            });
            return
        }
        self.charge();
    },
    charge() {
        const self = this;
        Point.charge(self, {
            points: self.data.rechargePoint
        }).then((ret) => {
            self.prePay(ret.data.chargeId);
        }, (err) => {
            _g.showModal({
                title: '提示',
                content: '支付失败',
                confirm: function() {
                    self.hideModal();
                }
            });
        });
    },
    prePay(chargeId) {
        const self = this;
        Point.prePay(self, {
            chargeId: chargeId
        }).then((ret) => {
            ret.data.package = ret.data.package.replace(/\s*/g,'');
            let payInfo = ret.data;
            payInfo.success = function() {
                //TODO check pay status
                _g.showModal({
                    title: '提示',
                    content: '充值成功',
                    confirm: function() {
                        self.hideModal();
                    }
                });
            };
            payInfo.fail = function() {
                _g.showModal({
                    title: '提示',
                    content: '支付失败',
                    confirm: function() {
                        self.hideModal();
                    }
                });
            };
            _g.requestPayment(payInfo);
        }, (err) => {
        	_g.showModal({
                title: '提示',
                content: '支付失败',
                confirm: function() {
                	self.hideModal();
                }
            });
        });
    },
    checkPay() {
        const self = this;

    },
    getPageData() {
    	const self = this;
    	Point.getRecordList(self, {
    		page: self.data.page,
    		pageSize: 10
    	}).then((ret) => {
    		if (self.data.page == 1) {
	    		self.setData({
	    			withdrawlist: ret.data.list
	    		});
    		} else {
    			self.setData({
	    			withdrawlist: self.data.withdrawlist.concat(ret.data.list)
	    		});
    		}
    	});
    },
    //赠送模态框
    showPresentedBtn: function() {
        this.setData({
            showPresentedBtn: true
        })
    },
    hidePresentedModal: function() {
    	const self = this;
        self.setData({
            showPresentedBtn: false
        });
        self.getBase();
    },
    onPresentedCancel: function() {
        this.hidePresentedModal();
    },
    onPresentedConfirm: function() {
        const self = this;
        Point.gift(self, {
        	points: self.data.giftPoint,
        	memberId: self.data.giftMember
        }).then((ret) => {
        	self.hidePresentedModal();
        	_g.toast({
        		title: '赠送成功'
        	});
        }, (err)=>{
        	_g.toast({
        		title: '赠送失败'
        	});
        	self.hidePresentedModal();
        });
    },
    inputFuQi(e) {
        const self = this;
        self.setData({
            rechargePoint: e.detail.value
        })
    },
    inputValue(e) {
    	const self = this;
        self.setData({
            [e.currentTarget.dataset.key]: e.detail.value
        })
    },
    scrollTolower() {
        const self = this;
        if (self.data.hasNextPage) {
    	   self.onReachBottom();
        }
    },
    onDonateTap: function () {
        let self = this;
        if (!self.data.points) return;
		_g.navigateTo({
			url: 'pages/me/donate',
			param: {
				points: self.data.points
			}
		}, self); 
	 }
};

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