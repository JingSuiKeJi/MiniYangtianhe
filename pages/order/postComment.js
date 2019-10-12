// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Order = require('../../service/Order');
let data = {
    storeList: [ //商品列表
        { newsImg: 'my_ce', newsName: "养生堂维C+维E", newsWeight: "250gx两盒装", newsMoney: '99.00' },
    ],
    textFocus: false, //获取textarea焦点
    praise: true, //默认好评
    medium: false, //中评
    bad: false, //差评
    write: '', //写评论
    auto_height: false, //自适应高度
    tempFilePaths: [], //本地照片地址
    type: 1
};
const onLoad = function(self) {
    self.setData({
        orderId: self.data.orderId,
        goodsId: self.data.goodsId,
    });
    self.getData();
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
    getData: function(e) {
        let self = this;
        self.myOrderDetail();
    },
    myOrderDetail: function() {
        const self = this;
        Order.myOrderDetail(self, {
            orderId: self.data.orderId
        }).then((ret) => {
            self.setData({
                storeList: ret.data.goodsList
            });
        }, (err) => {});
    },
    commentOrder: function(e) {
        let self = this;
        let param = {
            orderId: self.data.orderId,
            goodsId: self.data.goodsId,
            type: self.data.type,
            content: self.data.write,
        }
        if (self.data.tempFilePaths.length) {
            param.imgUrls = self.data.tempFilePaths.join(',');
        }
        Order.commentOrder(self, param).then((ret) => {
            wx.showToast({
                mask: true,
                title: '发布成功',
                icon: 'success',
                duration: 1000,
                success: function() {
                    setTimeout(function() {
                        event.emit('updateOrder');
                        _g.navigateTo({
                            url: 'pages/order/finishComment'
                        },self);
                    	// _g.navigateBack();
                    }, 400) //延迟时间
                }
            })
        }, (err) => {});
    },
    //评论双向数据绑定
    onWriteTap: function(e) {
        const self = this;
        const write = self.data.write;
        self.setData({
            write: e.detail.value
        })
    },
    //点击外层获取textarea焦点
    onFocusText: function() {
        const self = this;
        self.setData({
            textFocus: true
        })
    },
    //失去焦点
    areablur: function() {
        const self = this;
        self.setData({
            auto_height: false
        })
    },
    //获取焦点
    areafocus: function() {
        const self = this;
        self.setData({
            auto_height: true
        })
    },
    //添加照片
    onChooseImgTap: function() {
        let self = this;
        wx.chooseImage({
            count: 6, // 默认9  
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
                const newTemp = res.tempFilePaths;
                const tempFilePaths = self.data.tempFilePaths
                newTemp.forEach(function(val) {
                    tempFilePaths.push(val)
                })
                self.setData({
                    tempFilePaths: tempFilePaths
                })
            }
        })
    },
    //删除照片
    onDeletePicTap: function(options) {
        const self = this;
        const id = options.currentTarget.dataset.id;
        const tempFilePaths = self.data.tempFilePaths
        tempFilePaths.splice(id, 1);
        self.setData({
            tempFilePaths: tempFilePaths
        })
    },
    //发布评论
    onPostCommentTap: function() {
        const self = this;
        self.commentOrder();
    },
    onChosePraise: function(e) {
        let self = this;
        let type = e.currentTarget.dataset.type;
        if (type == self.data.type) return;
        self.setData({
            type: Number(type)
        })
    }
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