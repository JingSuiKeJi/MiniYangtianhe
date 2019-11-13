/// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const event = app.event;
const Goods = require('../../service/Goods');

// 初始化数据
const data = {
  hideModal:true, //模态框的状态  true-隐藏  false-显示
  animationData:{},
  flag:0,//0商品详情页，1拼团页面,2 开团页面，3限时抢购
  ScaleType: -1,
  cartNum: 1,
  scale: '请选择规格',
  scaleList: ['250g x 10包',],
  scaleIndex: -1,
  type: 1,   //1.普通 2.秒杀 3.权益卡附属 4.权益 5.拼团 6.砍价 7.推荐
  firstIndex: -1,
  secondIndex: -1,
  secondSkuList: [],
  skuList: [],
  skuId: -1,
};

// 页面onLoad方法
const onLoad = function (self) {
    let data = {
        type: self.data.type,
        goodsId: self.data.goodsId,
        platformFlag: self.data.platformFlag,
    }
   self.setData(data);
   self.getData();
   if (_g.checkLogin({ type: 1 })) {
       self.getCartList();
   }
   event.on('login-suc', self, (ret) => {
    self.getCartList();
});
  
};

// 页面onShow方法
const onShow = function (self) {

};
const onUnload= function (self) {
    
}
// 页面中的方法
const methods = {
    getData: function () {
        let self = this;
        Goods.getCommentList(self, {
            goodsId: self.data.goodsId
        }).then((ret)=>{
            let data = ret.data;
            self.setData({
                commentList: data.list,
            });
        },(err)=>{
    
        }); 
        self.getGoodsDetail()
    },
    getGoodsDetail() {
        const self = this;
        let data = {
            id: self.data.goodsId
        };
        if (self.data.thirdId) {
            data.thirdId = self.data.thirdId
        }
        Goods.getGoodsDetail(self, data).then((ret) => {
            let data = ret.data;
             let skuLength = data.goodsSpecificationsMapVos.length ;
            let param = {
                goodsDetail: data,
                skuLength :skuLength,
            }
            if (skuLength == 1) param.firstIndex = 1;
            self.setData(param);
            if (skuLength) {
                self.mapSkiuList(data.goodsSpecificationsMapVos);
            }
        }, (err) => { });
    },
    onShowTap: function(e) {
        let self = this;
        self.showModal();
    },
    showModal: function () {
        var self=this;
        self.setData({
        hideModal:false
        })
        var animation = wx.createAnimation({
        duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease',//动画的效果 默认值是linear
        })
        this.animation = animation 
        setTimeout(function(){
        self.fadeIn();//调用显示动画
        },200)   
    },

    // 隐藏遮罩层
    hideModal: function () {
        var self=this; 
        var animation = wx.createAnimation({
        duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease',//动画的效果 默认值是linear
        })
        this.animation = animation
        self.fadeDown();//调用隐藏动画   
        setTimeout(function(){
        self.setData({
            hideModal:true,
            // modelType: 0,
            ScaleType: -1,
        })      
        },400)//先执行下滑动画，再隐藏模块
        
    },

    //动画集
    fadeIn:function(){
        this.animation.translateY(0).step()
        this.setData({
        animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
        })    
    },
    fadeDown:function(){
        this.animation.translateY(500).step()
        this.setData({
        animationData: this.animation.export(),  
        })
    },
    onBackTap: function (e) {
        let self = this;
        wx.switchTab({  
           url:'../../pages/home/index'  
        });
    }, 
    onBuyTap: function (e) {
        let self = this;
        let data = {
            platformFlag: self.data.platformFlag,
            id: self.data.goodsId,
            num: self.data.cartNum,
            skuId: 0
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
        if (self.data.thirdId) data.thirdId = self.data.thirdId;
        _g.navigateTo({
            url: 'pages/order/submit',
            param: {
                postData: data,
                platformFlag: self.data.platformFlag,
                from: 'goodsDetail'
            },
        }, self);
        
    },
    onChangeCount: function (e) {
        let self = this;
        if (e.target.dataset.type == 1) {
            if (self.data.cartNum == 1) return;
            let cartNum = self.data.cartNum-1;
            self.setData({
                cartNum: cartNum
            })
        } else {
            let cartNum = self.data.cartNum+1;
            self.setData({
                cartNum: cartNum
            })
        }
    },
    onCancelTap: function (e) {
        let self = this;
        self.hideModal();
    },
    onSureTap: function (e) {
        let self = this;
        _g.navigateTo({
            url: 'pages/pay/order'
        },self);
        self.hideModal();
    },
    onAddCart: function () {
        let self = this;
        let data = {
            platformFlag: self.data.platformFlag,
            goodsId: self.data.goodsId,
            num: self.data.cartNum
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
        Goods.addCart(self, data
        ).then((ret)=>{
             let data = ret.data;
             self.setData({
                list: data 
             });
             setTimeout(function () {
                _g.toast({
                    title: '添加购物车成功',
                    duration: 1500,
                });
            }, 500);
             self.getCartList();
         },(err)=>{
            _g.toast({
                title: '加入购物车失败'
            });   
         }); 
     },
     //请求购物车列表
     getCartList: function () {
         let self = this;
         Goods.cartList(self, {
         }).then((ret)=>{
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
         },(err)=>{
     
         }); 
     },
     onCartTap: function (e) {
        let self = this;
        if (!_g.checkLogin({ type: 2 })) return;
        wx.switchTab({
            url: '../../pages/store/cart'
        });
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
            param.skuId = -1;
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