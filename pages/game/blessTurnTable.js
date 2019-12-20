// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Game = require('../../service/Game');

let data = {
    isShow: false,
    first: true,  //进行中阻止触发
    list: [],
    
};
const onLoad = function (self) {
    self.getData();

}
const onShow = function (self) { }
const onReady = function (self) { }
const onUnload = function (self) {
    
}

const methods = {
    getData: function () {
        let self = this;
        self.turnplateHome();
    },
    turnplateHome: function () {
        let self = this;
        Game.turnplateHome(self, {}).then((res) => {
            let data = res.data;
            let list = data.list;
            list.splice(4, 0, { title: '点击抽奖', point: `-${data.gamePoint}福气` });
            self.setData({
                list: list,
                basePoint: data.basePoint,
                status: data.status,
                gamePoint: data.gamePoint
            })
        }, (err) => { });
    },
    turnplateAction: function () {
        let self = this;
        Game.turnplateAction(self,{}).then((res) => {
            let data = res.data;
            let rewardIndex = -1;
            _.find(self.data.list,(item,index)=>{
               if (item.id == data.data.id)   rewardIndex = index;
            })
            self.setData({
                rewardIndex: rewardIndex,
                winInfo: data.data,
                basePoint: data.point
            })
        },(err) => {
            self.setData({
                isFail: true
            })
        });
       
    },
    closeModal: function () {
        let self = this;
        self.setData({
            isShow: false,
        })
    },
    hideModal: function () {
        let self = this;
        if (self.data.status == 1) {
            _g.toast({
                title: '请稍等，游戏还未开始哦',
                duration: 2000
            });
            return;
        }
        if (self.data.status == 3) {
            _g.toast({
                title: '来晚啦，游戏已经结束了',
                duration: 2000
            });
            return;
        }
        self.turnplateAction();
        if (self.data.first) {
            self.setData({  //状态重置
                currentIndex: -1,
                currentNum: 0,      //当前显示位置的下标
                speed: 150, //速度
                first: false,
                pastTime: 0,
                time: 4800,// 转4圈的时间 4*8*speed
                // rewardIndex: 3,
            });
            self.move();
        }
    },
    move: function () {
        let self = this;
        let currentArr = [0, 1, 2, 5, 8, 7, 6, 3]; //运动路径下标
        let currentNum = self.data.currentNum;
        let time = self.data.time;
        let pastTime = self.data.pastTime;
        let speed = self.data.speed;
        let diff = 100;
        let timer = setTimeout(() => {
            if (currentNum > 7) {
                currentNum = 0;
            }
            if (self.data.rewardIndex) {
                if ((time == pastTime) && (currentArr[currentNum] == self.data.rewardIndex)) {
                    self.setData({
                        currentIndex: currentArr[currentNum],   
                    });
                    setTimeout(() => {
                        self.setData({
                            isShow: true,
                            first: true
                        })
                    }, 300);
                    clearInterval(timer);
                    return;
                }else if((time == pastTime) && (currentArr[currentNum] != self.data.rewardIndex)) {
                           time = time + diff;
                           speed = speed + diff,
                           pastTime += diff;
                }else {
                        pastTime += 150;//150 为speed的初始值
                }
            } else {
                if (self.data.isFail || (pastTime > 60000)) {
                    _g.toast({
                        title: '抽奖失败，请稍后再试',
                        duration: 2000
                    })
                    return;
                }
                pastTime += 150;
            }
           
            self.setData({
                currentNum: currentNum + 1,
                currentIndex: currentArr[currentNum],
                speed: speed,
                pastTime: pastTime,
                time: time,
            });
            self.move();
        }, speed);

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