/// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const event = app.event;
const Goods = require('../../service/Goods');

// 初始化数据
const data = {
    currentIndex: 1,
    collage: [],
    // type: 6,
    personList: [
        {
            url: 'my_qrHeader.png',
            name: 'Amy',
        },
        {
            url: 'my_ snapshoot.png',
            name: 'Mia',
        },
    ],
    top: 200,
    isSelect: false,
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    tabList: ['商品', '详情', '评价'],
    isTab: 0,
    scale: '',
    cartNum: 2,
    scaleList: ['250g x 10包',],
    scaleIndex: -1,
    toView: 'header',
    modelType: 0,
    posterFlag: false,
    ScaleType: -1,
    isBuy: false,
    title: '', //头部标题
    goodsDetail: {},
    num: 1,
    canvasUrl: '',
    authorizeHidden: true,
    hideShareDialog: true,
    priceFlag: 0,
    firstIndex: -1,
    secondIndex: -1,
    secondSkuList: [],
    skuList: [],
    skuId: -1,
    isScroll: true
};

// 页面onLoad方法
const onLoad = function (self) {
    self.getData();
    if (_g.checkLogin({ type: 1 })) {
        self.getCartList();
    }
    // self.moveBarrage();
    if (self.data.type == 5) {
        self.setData({
            title: '养天和优选',
        })
    } else {
        self.setData({
            title: '商品详情',

        })
    }
    event.on('goods-detail-shareEvent', self, (data) => {
        self.setData({
            canvasUrl: data.canvasUrl
        });
    });
    event.on('login-suc', self, (ret) => {
        self.getCartList();
    });
};

const onReady = function (self) {
    const windowHeight = _g.getLS(_c.LSKeys.systemInfo).windowHeight;
    self.setData({
        height: windowHeight
    })
    setTimeout(function () {
        self.poster = self.selectComponent('#poster');
        self.poster.onHideShareTap = function () {
            self.setData({
                hideShareDialog: true
            });
        }
        self.authorize = self.selectComponent('#authorize');
        self.authorize.onCancelTap = function () {
            self.setData({
                authorizeHidden: true
            });
        }
    }, 1000);
    event.on('goods-detail-openAuthorize', self, function (data) {
        self.setData({
            authorizeHidden: false
        });
    });

}

// 页面onShow方法
const onShow = function (self) {
    if (self.data.type == 5) {
        self.getUserAssembleList();
        self.moveBarrage();
    }
};
const onUnload = function (self) {
    event.remove('goods-detail-shareEvent', self);
    clearInterval(self.data.timer);
}
// 页面中的方法
const methods = {
    getData: function () {
        const self = this;
        self.setData({
            userInfo: _g.getLS(_c.LSKeys.userInfo)
        })
        self.getGoodsDetail();
        self.getCommentList();
        self.browseGoods();
        
    },
    getGoodsDetail() {
        const self = this;
        let data = {
            id: self.data.id
        };
        if (self.data.thirdId) {
            data.thirdId = self.data.thirdId
        }
        Goods.getGoodsDetail(self, data).then((ret) => {
            let data = ret.data;
             let skuLength = data.goodsSpecificationsMapVos.length ;
            let param = {
                goodsDetail: data,
                type: data.type,
                skuLength :skuLength,
            }
            if (skuLength == 1) param.firstIndex = 1;
            self.setData(param);
            self.getCurrentTime();
            // "goodsDetail.type": 1,   //1.普通 2.秒杀 3.权益卡附属 4.权益 5.拼团 6.砍价 7.推荐
            self.splitString(ret.data.goodImgs, 'bannerImgs');
            self.splitString(ret.data.description, 'goodsImgs');
            // if (self.data.flag == 1 || self.data.flag == 2) { //一切数据根据返回数据为准
            if (ret.data.type == 5) {
                //需要知道是门店商品还是商城的商品
                self.getUserAssembleList();
                self.moveBarrage();
            }
            if (skuLength) {
                self.mapSkiuList(data.goodsSpecificationsMapVos);
            }
        }, (err) => { });
    },
    getCurrentTime: function () {
        let self = this;
        let curTime = new Date().getTime() / 1000;
        self.setData({
            curTime: curTime
        });
        if (self.data.timer) clearInterval(self.data.timer);
        let timer = setInterval(() => {
            if (self.data.goodsDetail.endTime == self.data.curTime) {
                clearInterval(self.data.timer);
                return;
            }
            self.getCurrentTime();
        }, 1000);
        self.setData({
            timer: timer
        })
    },
    getCommentList() {
        const self = this;
        Goods.getCommentList(self, {
            goodsId: self.data.id,
            page: 1,
            pageSize: 5 //请求5条数据即可,不需要自己去切割
        }).then((ret) => {
            self.setData({
                commentList: ret.data.list,
                commentLength: ret.data.totalCount
            });
        }, (err) => {

        });
    },
    getUserAssembleList() {
        const self = this;
        //拼团 
        Goods.getUserAssembleList(self, {
            activeId: self.data.thirdId,
            goodsId: self.data.id,
            page: 1,
            pageSize: 2,
        }).then((ret) => {
            let data = ret.data;
            self.setData({
                collage: data.list
            })
        }, (err) => {

        });
    },
    browseGoods() {
        const self = this;
        let userInfo = _g.getLS(_c.LSKeys.userInfo);
        Goods.browseGoods(self, {
            goodsId: self.data.id,
            userId: userInfo.id
        }).then((ret) => {
        }, (err) => {

        });
    },
    onChangeTap: function (e) {
        let self = this;
        self.setData({
            currentIndex: e.detail.current + 1,
        })
    },
    onCancelTap: function (e) {
        let self = this;
        self.hideModal();
    },
    onSureTap: function (e) {
        let self = this;
        self.setData({
            isJoin: 2
        })
        self.onBuyTap();
        self.hideModal();
    },
    onMoreTap: function (e) {
        let self = this;
        _g.navigateTo({
            param: {
                activeId: self.data.thirdId,
                goodsId: self.data.id
            },
            url: 'pages/goods/more'
        }, self)
    },
    onJoinTap: function (e) {
        let self = this;
        _g.navigateTo({
            param: {
                userAssembleId: e.currentTarget.dataset.id
            },
            url: 'pages/goods/join'
        }, self)
    },
    onClickTap: function (e) {
        let self = this;
        self.setData({
            type: e.target.dataset.type,
        })
    },
    onPageScroll: function (e) { //监听页面滚动
        this.setData({
            scrollTop: e.scrollTop
        })
    },
    moveBarrage: function () {
        let self = this;
        let length = self.data.personList.length;
        let dis = (length - 1) * 76 + 300;
        let second = dis / 37.5;
        let top = self.data.top - dis;
        self.setData({
            top,
            second
        });
    },
    onSelectTap: function (e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        let skuList = self.data.skuList;
        let firstIndex = self.data.firstIndex; 
        let secondIndex = self.data.secondIndex;
        let skuLength = self.data.skuLength;
        if (self.data.firstIndex == index) {
            self.setData({
                firstIndex: -1,
                skuId: -1,
                scale: ''
                // secondIndex: -1,
                // secondSkuList: self.data.startList
            })
            return;
        }
        let secondSkuList = skuList[index].goodsSpecificationVoList
        let param = {
            firstIndex: index,
            secondSkuList: secondSkuList, 
        }
        if (secondIndex != -1 && !secondSkuList[secondIndex].optional) {
            param.skuId = secondSkuList[secondIndex].goodsId;
            param.secondIndex = -1;
        }
        if(skuLength == 2 && secondIndex != -1 ) {
            param.scale =skuList[index].name + ',' +secondSkuList[secondIndex].name;
            param.skuId = secondSkuList[secondIndex].goodsId;
        }else {
            param.scale = ''
        }
        self.setData(param);
    },
    onSecondSelect: function (e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        let firstIndex = self.data.firstIndex; 
        let secondIndex = self.data.secondIndex;
        let skuLength = self.data.skuLength;
        let skuList = self.data.skuList;
        let list = self.data.secondSkuList[index];
        if (!list.optional) return
        if (self.data.secondIndex == index) {
            self.setData({
                secondIndex: -1,
                skuId: -1,
                scale: ''
            })
            return;
        }
        let opts = {
            secondIndex: index,
            skuId: list.goodsId,
            skuImg: list.imgUrl,
            skuPrice: list.nowPrice
        }
        if (skuLength == 1 ) {
            opts.scale = list.name;
        } else if (skuLength == 2 &&  firstIndex != -1){
            opts.scale = skuList[firstIndex].name +',' + list.name
        }
        self.setData(opts);
    },
    // 显示遮罩层
    showModal: function () {
        let self = this;

        self.setData({
            hideModal: false,
            isJoin: 1,
            isScroll: false
        })
        var animation = wx.createAnimation({
            duration: 600, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
            timingFunction: 'ease', //动画的效果 默认值是linear
        })
        this.animation = animation
        setTimeout(function () {
            self.fadeIn(); //调用显示动画
        }, 200);
    },

    // 隐藏遮罩层
    hideModal: function () {
        var self = this;
        var animation = wx.createAnimation({
            duration: 800, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
            timingFunction: 'ease', //动画的效果 默认值是linear
        })
        this.animation = animation
        self.fadeDown(); //调用隐藏动画   
        setTimeout(function () {
            self.setData({
                hideModal: true,
                modelType: 0,
                ScaleType: -1,
                priceFlag: 0,
                isScroll: true
            })
        }, 400); //先执行下滑动画，再隐藏模块  
    },

    //动画集
    fadeIn: function () {
        this.animation.translateY(0).step()
        this.setData({
            animationData: this.animation.export()
        })
    },
    fadeDown: function () {
        this.animation.translateY(500).step()
        this.setData({
            animationData: this.animation.export(),
        })
    },
    onChoseTap: function (e) {
        let index = e.currentTarget.dataset.index;
        let self = this;
        if (index == self.data.isTab) return;
        if (index == 0) {
            self.setData({
                isTab: index,
                toView: 'header'
            })
        } else if (index == 1) {
            self.setData({
                isTab: index,
                toView: 'detail'
            })

        } else if (index == 2) {
            self.setData({
                isTab: index,
                toView: 'comments'
            })
        };
    },
    onOpenPlus: function (e) {
        let self = this;
    },
    onChangeCount: function (e) {
        let self = this;
        if (e.target.dataset.type == 1) {
            if (self.data.num == 1) return;
            let num = self.data.num - 1;
            self.setData({
                num: num
            })
        } else {
            let num = self.data.num + 1;
            self.setData({
                num: num
            })
        }
    },
    onShowTap: function (e) {
        let self = this;
        let opts = e.currentTarget.dataset;
        let param = {
            ScaleType: opts.scaletype,
        }
        if (opts.priceflag) param.priceFlag = opts.priceflag;
        self.setData(param);
        self.showModal();
    },
    onMoreComments: function (e) {
        let self = this;
        if (!self.data.commentLength) return;
        _g.navigateTo({
            url: 'pages/goods/comments',
            param: {
                goodsId: self.data.goodsDetail.id,
                type: self.data.type,
                platformFlag: self.data.goodsDetail.platformFlag,
            }
        }, self)
    },
    onBackTap: function (e) {
        let self = this;
        wx.switchTab({
            url: '../../pages/home/index'
        });
    },
    onBuyTap: function (e) {
        let self = this;
        let data = {
            platformFlag: self.data.goodsDetail.platformFlag,
            id: self.data.id,
            num: self.data.num,
        };
        if (!_g.checkLogin({ type: 2 })) return;
        if ((self.data.skuId == -1 || self.data.firstIndex == -1) && self.data.skuLength) {
            _g.toast({
                title: '请选择商品规格'
            });
            return;
        }
        if (self.data.skuLength) {
            data.id = self.data.skuId
        }
        // if (self.data.goodsDetail.skuId) data.skuId = self.data.goodsDetail.skuId;
        if (self.data.thirdId) data.thirdId = self.data.thirdId;
        if (self.data.priceFlag == 1) {
            data.isOrigPrice = 1
        } else if (self.data.priceFlag == 2) {
            data.isJoin = 2
        }
        _g.navigateTo({
            url: 'pages/order/submit',
            param: {
                postData: data,
                platformFlag: self.data.goodsDetail.platformFlag,
                from: 'goodsDetail',
            },
        }, self);
    },
    onCartTap: function (e) {
        let self = this;
        wx.switchTab({
            url: '../../pages/store/cart'
        });
    },
    splitString: function (str, key) {
        let self = this;
        let picList = [];
        picList = str ? str.split(',') : []
        self.setData({
            [key]: picList
        })

    },
    onAddCart: function () {
        let self = this;
        let data = {
            platformFlag: self.data.goodsDetail.platformFlag,
            goodsId: self.data.id,
            num: self.data.num
        }
        if (!_g.checkLogin({ type: 2 })) return;
        if ((self.data.skuId == -1 || self.data.firstIndex == -1) && self.data.skuLength) {
            _g.toast({
                title: '请选择商品规格'
            });
            return;
        }
        if (self.data.skuLength) {
            data.goodsId = self.data.skuId
        }
        if (self.data.platformFlag == 2) data.storeId = self.data.storeId;
        Goods.addCart(self, data).then((ret) => {
            let total = self.data.total + 1;
            self.setData({
                total: total
            });
            setTimeout(function () {
                _g.toast({
                    title: '添加购物车成功',
                    duration: 1500,
                });
            }, 500);
            self.getCartList();
        }, (err) => {
            _g.toast({
                title: '加入购物车失败'
            });
        });
    },
    //请求购物车列表
    getCartList: function () {
        let self = this;
        Goods.cartList(self, {}).then((ret) => {
            let data = ret.data;
            let total = 0;
            if (data.mallShopCartList && data.mallShopCartList.length) {
                total += data.mallShopCartList.length
            }
            if (data.storeShopCartList && data.storeShopCartList.length) {
                total += data.storeShopCartList.length
            }
            if (data.length > 99) total = '99+';
            self.setData({
                total: total
            });

        }, (err) => {

        });
    },
    onCartTap: function (e) {
        let self = this;
        if (!_g.checkLogin({ type: 2 })) return;
        wx.switchTab({
            url: '../../pages/store/cart'
        });
    },
    onShareAppMessage() {
        const self = this;
        const userInfo = _g.getLS(_c.LSKeys.userInfo);
        let path = 'pages/goods/detail?id=' + self.data.id;
        if (userInfo) {
            path += '&promoCode=' + userInfo.promoCode;
        }
        console.log('====',path )
        return {
            title: self.data.goodsDetail.mainTitle,
            path: path,
            imageUrl: self.data.canvasUrl
        }
    },
    onShareTap() {
        const self = this;
        if (_g.checkLogin({
            type: 1
        })) {
            self.setData({
                hideShareDialog: false
            });
        } else {
            _g.toast({
                title: '请先登录'
            })
        }
    },
    onCartRights: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/card/card',
        }, self);
    },
    mapSkiuList: function (arr) {
        let self = this;
        let skuList = arr;
        if (self.data.skuLength > 1) {
            skuList = arr[0].goodsSpecificationVoList;
            skuList.map((item, index) => {
                let newArr = arr[1].goodsSpecificationVoList.filter((element) => {
                    return item.id == element.parentId;
                })
                item.goodsSpecificationVoList = newArr;
            })

        }
        let secondSkuList = skuList[0].goodsSpecificationVoList;
        let startList = _.map(secondSkuList, (item) => {
            return { ...item,optional: true  };
        })
        self.setData({
            skuList: skuList,
            startList: startList,
            secondSkuList: startList,
            skuImg: secondSkuList[0].imgUrl,
            skuPrice: secondSkuList[0].nowPrice,
        });

    }
};

// 有引用template时定义
const temps = {};

// 初始化页面page对象
const initPage = _g.initPage({
    data: data,
    onLoad: onLoad,
    onReady: onReady,
    onShow: onShow,
    methods: methods,
    onUnload: onUnload
});
Page(initPage);