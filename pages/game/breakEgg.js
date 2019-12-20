// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Game = require('../../service/Game');

let data = {
    isIntace: true, // true显示完整的鸡蛋, false碎鸡蛋
    onShow: false,
    hideEgg: true,  // 碎蛋盒子
};
const onLoad = function (self) {
    self.getData();
}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) { }

const methods = {
    getData: function () {
        let self = this;
        self.goldenEggsHome();
    },
    goldenEggsHome: function () {
        let self = this;
        Game.goldenEggsHome(self, {}).then((ret) => {
              self.setData({
                  baseInfo: ret.data,
                  basePoint: ret.data.basePoint
              })
        }, (err) => {
        });
    },
    breakEgg: function () {
        let self = this;
        Game.breakEgg(self, {}).then((ret) => {
            self.setData({
                reward: ret.data.data,
                basePoint: ret.data.point
            })
        }, (err) => {
        });
    },
    closeMask: function () {
        let self = this;
        self.setData({  //重置状态
            onShow: false,
            hideEgg: true,
            isIntace: true
        })
    },
    hideModal: function () {
        const self = this;
        if (self.data.baseInfo.status == 1) {
            _g.toast({
                title: '请稍等，游戏还未开始哦',
                duration: 2000
            });
            return;
        }
        if (self.data.baseInfo.status == 3) {
            _g.toast({
                title: '来晚啦，游戏已经结束了',
                duration: 2000
            });
            return;
        }
        self.breakEgg();
        self.setData({
            onShow: !self.data.onShow //显示模态框
        });

        setTimeout(function () {
            self.setData({
                isIntace: false,  // 碎蛋盒子
            });
            setTimeout(function () {
                self.setData({
                    hideEgg: false,  // 奖品盒子
                });
            }, 0.6 * 1000);
        }, 1.3 * 1000);
    },
    onExchangeTap: function () {
        let self = this;
        _g.navigateTo({
			url: 'pages/exchange/index',
		}, self)
    }
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