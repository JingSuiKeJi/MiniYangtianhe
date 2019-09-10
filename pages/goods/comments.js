/// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
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
};

// 页面onLoad方法
const onLoad = function (self) {
    let data = {
        flag: self.data.flag,
        goodsId: self.data.goodsId,
        platformFlag: self.data.platformFlag,
    }
   if (self.data.storeId) data.store = self.data.storeId;
   self.setData(data)
  
};

// 页面onShow方法
const onShow = function (self) {
   self.getData();
};
const onUnload= function (self) {
    
}
// 页面中的方法
const methods = {
    getData: function () {
        let self = this;
        Goods.getCommentList(self, {
            goodsId: 2
        }).then((ret)=>{
            let data = ret.data;
            self.setData({
                commentList: data.list,
            });
        },(err)=>{
    
        }); 
    },
    onShowTap: function(e) {
        let self = this;
        // if (e.target.dataset.scaletype==1) {
        //   self.setData({
        //     modelType: true
        //   });
        // }
        self.setData({
        ScaleType: e.target.dataset.scaletype
        });
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
        _g.navigateTo({
            url: 'pages/pay/order'
        },self);
        
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
            platformFlag: 1,
            goodsId: 2,
            cartNum: self.data.cartNum
        }
        if (self.data.platformFlag == 2) data.storeId = self.data.storeId;
        Goods.addCart(self, data
        ).then((ret)=>{
             let data = ret.data;
             self.setData({
                list: data 
             });
             self.getCartList();
         },(err)=>{
 
         }); 
     },
     //请求购物车列表
     getCartList: function () {
         let self = this;
         Goods.cartList(self, {
         }).then((ret)=>{
             let data = ret.data;
             let total = data.length;
             if (data.length > 99) total = '99+';
             self.setData({
                 total: total
             });
         },(err)=>{
     
         }); 
     },
     onCartTap: function (e) {
        let self = this;
        if (self.data.userName) {
             wx.switchTab({  
               url:'../../pages/store/cart'  
            });
        } else {
            _g.toast({
                title: '请先登陆',
            }); 
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