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
    goodsDetail: {},
    num: 1
};

// 页面onLoad方法
const onLoad = function(self) {
    self.getCartList();
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
        const self = this;
        self.getGoodsDetail();
        self.getCommentList();
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
            self.setData({
                goodsDetail: ret.data
            });
            // "goodsDetail.type": 1,   //1.普通 2.秒杀 3.权益卡附属 4.权益 5.拼团 6.砍价 7.推荐
            self.splitString(ret.data.goodImgs, 'bannerImgs');
            self.splitString(ret.data.description, 'goodsImgs');
            // if (self.data.flag == 1 || self.data.flag == 2) { //一切数据根据返回数据为准
            if (ret.data.type == 5) {
                //需要知道是门店商品还是商城的商品
                self.getAssembleList();
            }
        }, (err) => {});
    },
    getCommentList() {
        const self = this;
        Goods.getCommentList(self, {
            goodsId: self.data.id,
            page: 1,
            pageSize: 5 //请求5条数据即可,不需要自己去切割
        }).then((ret) => {
            // let data = ret.data;
            // let commentList = data.list.slice(0, 5);
            // let commentLength = data.list.length; //这里的评论长度展示应该是评论总数
            self.setData({
                commentList: ret.data.list,
                commentLength: ret.data.totalCount
            });
        }, (err) => {

        });
    },
    getAssembleList() {
        const self = this;
        //拼团 
        let data = {
            platformFlag: self.data.goodsDetail.platformFlag,
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
        let data = {
            platformFlag: self.data.goodsDetail.platformFlag,
            id: self.data.goodsDetail.id,
            num: self.data.num,
        };
            
        if (self.data.goodsDetail.skuId) data.skuId = self.data.goodsDetail.skuId;
        if (self.data.thirdId) data.thirdId = self.data.thirdId;
        _g.navigateTo({
            url: 'pages/order/submit',
            param: {
                postData: data,
                platformFlag: self.data.goodsDetail.platformFlag,
                from: 'goodsDetail'
            },
        }, self);
    },
    onCartTap: function(e) {
        let self = this;
        wx.switchTab({
            url: '../../pages/store/cart'
        });
    },
    splitString: function(str, key) {
        let self = this;
        let picList = [];
        picList = str.split(',')
        self.setData({
            [key]: picList
        })

    },
    onAddCart: function() {
        let self = this;
        let data = {
            platformFlag: self.data.goodsDetail.platformFlag,
            goodsId: self.data.id,
            num: self.data.num
        }
        if (self.data.platformFlag == 2) data.storeId = self.data.storeId;
        Goods.addCart(self, data).then((ret) => {
            let data = ret.data;
            self.setData({
                list: data
            });
            self.getCartList();
        }, (err) => {
            _g.toast({
                title: '加入购物车成功'
            });
        });
    },
    //请求购物车列表
    getCartList: function() {
        let self = this;
        Goods.cartList(self, {}).then((ret) => {
            let data = ret.data;
            self.setData({
                // total: data.length  ////////////这里报错注意一下
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
            title: self.data.goodsDetail.mainTitle,
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