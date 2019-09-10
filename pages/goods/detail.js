/// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const Platform = require('../../service/Platfrom');
const Goods = require('../../service/Goods');
// 初始化数据
const data = {
    currentIndex: 1,
    collage: [{
        url: 'collageImg.png',
        phone: '15677220282',
        time: '00:46:56',
        num: 1,
    }],
    type: 1,
    personList: [{
            url: 'people.png',
            name: 'Amy',
        },
        {
            url: 'people.png',
            name: 'Amy',
        }
    ],
    top: 200,
    isSelect: false,
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    flag: 0, //0商品详情页，1拼团页面,2 开团页面,3 限时购页面
    tabList: ['商品', '详情', '评价'],
    isTab: 0,
    scale: '请选择规格',
    cartNum: 2,
    scaleList: ['250g x 10包', ],
    scaleIndex: -1,
    toView: 'header',
    modelType: 0,
    posterFlag: false,
    ScaleType: -1,
    isBuy: false,
    title: '', //头部标题
};

// 页面onLoad方法
const onLoad = function(self) {
    // self.getCartList();
    self.getData();
    self.moveBarrage();
    const title = self.data.self;
    if (self.data.flag == 0 || self.data.flag == 3) {
        self.setData({
            title: '商品详情'
        })
    } else {
        self.setData({
            title: '养天和优选'
        })
    }
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
        let self = this;
        let data = {
            id: 2
        };
        if (self.data.thirdId) {
            data.thirdId = self.data.thirdId
        }
        Goods.getGoodsDetail(self, data).then((ret) => {
            let data = ret.data;
            self.setData({
                list: data
            });
            self.splitString(data.goodImgs, 'bannerImgs');
            self.splitString(data.description, 'goodsImgs');

        }, (err) => {});
        //评价
        Goods.getCommentList(self, {
            goodsId: 2
        }).then((ret) => {
            let data = ret.data;
            let commentList = data.list.slice(0, 5);
            let commentLength = data.list.length;
            self.setData({
                commentList: commentList,
                commentLength: commentLength
            });
        }, (err) => {

        });
        //拼团 
        if (self.data.flag == 1 || self.data.flag == 2) {
            let data = {
                platformFlag: 1,
                page: 1,
                pageSize: 2,
            }
            if (self.data.storeId) {
                data.storeId = self.data.storeId;
            }
            Platform.getAssembleList(self, data).then((ret) => {
                let data = ret.data;
                self.setData({
                    collage: data.list
                })
            }, (err) => {

            });
        }
    },
    onChangeTap: function(e) {
        let self = this;
        self.setData({
            currentIndex: e.detail.current + 1,
        })
    },
    onCancelTap: function(e) {
        let self = this;
        self.hideModal();
    },
    onSureTap: function(e) {
        let self = this;
        self.onBuyTap();
        self.hideModal();
    },
    onMoreTap: function(e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/goods/more'
        }, self)
    },
    onJoinTap: function(e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/goods/join'
        }, self)
    },
    onClickTap: function(e) {
        let self = this;
        self.setData({
            type: e.target.dataset.type,
        })
    },
    onPageScroll: function(e) { //监听页面滚动
        this.setData({
            scrollTop: e.scrollTop
        })
    },
    moveBarrage: function() {
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
    onSelectTap: function(e) {
        let index = e.target.dataset.index;
        let self = this;
        self.setData({
            scaleIndex: index,
            scale: self.data.scaleList[index],
            isSelect: !self.data.isSelect
        });
    },
    // 显示遮罩层
    showModal: function() {
        let self = this;
       
        self.setData({
            hideModal: false
        })
        var animation = wx.createAnimation({
            duration: 600, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
            timingFunction: 'ease', //动画的效果 默认值是linear
        })
        this.animation = animation
        setTimeout(function() {
            self.fadeIn(); //调用显示动画
        }, 200);
    },

    // 隐藏遮罩层
    hideModal: function() {
        var self = this;
        var animation = wx.createAnimation({
            duration: 800, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
            timingFunction: 'ease', //动画的效果 默认值是linear
        })
        this.animation = animation
        self.fadeDown(); //调用隐藏动画   
        setTimeout(function() {
            self.setData({
                hideModal: true,
                modelType: 0,
                ScaleType: -1,
            })
        }, 400); //先执行下滑动画，再隐藏模块  
    },

    //动画集
    fadeIn: function() {
        this.animation.translateY(0).step()
        this.setData({
            animationData: this.animation.export()
        })
    },
    fadeDown: function() {
        this.animation.translateY(500).step()
        this.setData({
            animationData: this.animation.export(),
        })
    },
    onChoseTap: function(e) {
        let index = e.target.dataset.index;
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
        }
    },
    onOpenPlus: function(e) {
        let self = this;
        console.log('开通会员')
    },
    onChangeCount: function(e) {
        let self = this;
        if (e.target.dataset.type == 1) {
            if (self.data.cartNum == 1) return;
            let cartNum = self.data.cartNum - 1;
            self.setData({
                cartNum: cartNum
            })
        } else {
            let cartNum = self.data.cartNum + 1;
            self.setData({
                cartNum: cartNum
            })
        }
    },
    onShowTap: function(e) {
        let self = this;
        self.setData({
            ScaleType: e.target.dataset.scaletype
        });
        self.showModal();
    },
    onMoreComments: function(e) {
        let self = this;
        let params = {
            flag: 0, //确定是抢购、拼团、或者是商品
            goodsId: 2,
            platformFlag: 2,
        }
        if (self.data.storeId) params.storeId = self.data.storeId;
        _g.navigateTo({
            url: 'pages/goods/comments',
            param: {
                flag: 0, //确定是抢购、拼团、或者是商品
                goodsId: 2,
                platformFlag: 2,
                storeId: self.data.storeId
            }
        }, self)
    },
    onBackTap: function(e) {
        let self = this;
        wx.switchTab({
            url: '../../pages/home/index'
        });
    },
    onBuyTap: function(e) {
        let self = this;
        // let data = {
        //     id: 2,
        //     num: self.data.cartNum,
        //     orderStatus: self.data.list.type
        // }
        let data = {
            id: 2,
            num: self.data.cartNum,
            orderStatus: 1
        }
        if (self.data.thirdId) {
            data.thirdId = self.data.thirdId;
        }
        if (self.data.flag == 0) {
            _g.navigateTo({
                url: 'pages/pay/account',
                    param: data,
            }, self);
            
        }else {
             _g.navigateTo({
                url: 'pages/order/submit',
                    param: data,
            }, self);

        }
       

    },
    onCartTap: function(e) {
        let self = this;
        wx.switchTab({
            url: '../../pages/store/cart'
        });
    },
    splitString: function(str, key) {
        let self = this;
        let bannerList = [];
        bannerList = str.split(',')
        self.setData({
            [key]: bannerList
        })

    },
    onAddCart: function() {
        let self = this;
        let data = {
            platformFlag: 1,
            goodsId: 2,
            cartNum: self.data.cartNum
        }
        if (self.data.platformFlag == 2) data.storeId = self.data.storeId;
        Goods.addCart(self, data).then((ret) => {
            let data = ret.data;
            self.setData({
                list: data
            });
            self.getCartList();
        }, (err) => {

        });
    },
    //请求购物车列表
    getCartList: function() {
        let self = this;
        Goods.cartList(self, {}).then((ret) => {
            let data = ret.data;
            self.setData({
                total: data.length
            });
        }, (err) => {

        });
    },
    onCartTap: function(e) {
        let self = this;
        if (self.data.userName) {
            wx.switchTab({
                url: '../../pages/store/cart'
            });
        } else {
            _g.toast({
                title: '请先登陆',
            });
        }
    },
    onShareTap: function(e) {
        let self = this;
        let opts = e.currentTarget.dataset;
        self.setData({
            modelType: opts.type
        })
        self.showModal();
    },
    onShareAppMessage() {
        const self = this;
        return {
            title: '121211',
            path: 'pages/goods/detail?id=' + self.data.id
        }
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