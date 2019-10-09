// pages/store/cart.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const event = app.event;
const Goods = require('../../service/Goods');
// 初始化数据
const data = {
    allSelect: false,
    medicineFlag: false, //养乐药房
    storeFlag: false, //养乐商城
    id: '',
    mediNum: 0, //选中药房的商品数
    storeNum: 0, //选中商城的商品数
    mediTotal: 0,
    storeTotal: 0,
    num: 0,
    medecineList: [],
    storeList: [],
    startX: 0, //开始坐标
    startY: 0,
    isMgt: false
};

// 页面onLoad方法
const onLoad = function(self) {
    self.getTabBar().setData({
        selected: 3
    });
    self.setData({
        userInfo: _g.getLS(_c.LSKeys.userInfo)
    })
    if (_g.checkLogin({
            type: 1
        })) {
        self.getData();
    }
    event.on('refreshCart', self, () => {
        self.getData();
    });
    event.on('login-suc', self, (data) => {
        self.setData({
            userInfo: _g.getLS(_c.LSKeys.userInfo)
        });
        self.getData();
    });

};

// 页面onShow方法
const onShow = function(self) {
    self.setData({
        userInfo: _g.getLS(_c.LSKeys.userInfo)
    })
    if (_g.checkLogin({
            type: 1
        })) {
        self.getData();
    }
};
const onUnload = function(self) {
    event.remove('refreshCart');
    event.remove('login-suc');
};
// 页面中的方法
const methods = {
    getData: function() {
        const self = this;
        // if (!self.userInfo) return;
        Goods.cartList(self, {}).then((ret) => {
            let data = ret.data;
            let param = {};
            if (data.mallShopCartList) {
                param.storeList = data.mallShopCartList;
            } else {
                param.storeList = [];
            }
            if (data.storeShopCartList) {
                param.medecineList = data.storeShopCartList;
            } else {
                param.medecineList = [];
            }
            self.setData(param);
        }, (err) => {

        });

    },
    onSubtractionTap: function(e) {
        let self = this;
        let medecineList = self.data.medecineList;
        let storeList = self.data.storeList;
        let index = e.target.dataset.index;
        // if (e.target.dataset.type == 1) {
        //  // 1: 门店
        //     if (medecineList[index].count == 1) return;
        //     medecineList[index].num = medecineList[index].num - 1;
        //     self.setData({
        //         medecineList: medecineList
        //     });
        //     self.getMonney('medecineList', 1);
        // } else {
        //  // 2: 商城
        //     if (storeList[index].num == 1) return;
        //     storeList[index].num = storeList[index].num - 1;
        //     self.setData({
        //         storeList: storeList
        //     });
        //     self.getMonney('storeList', 2);
        // }
        self.subtractNum({
            list: e.target.dataset.type == 1 ? 'medecineList' : 'storeList',
            index: index
        });
    },
    onAddTap: function(e) {
        let self = this;
        let medecineList = self.data.medecineList;
        let storeList = self.data.storeList;
        let index = e.target.dataset.index;
        // if (e.target.dataset.type == 1) {
        //     medecineList[index].count = medecineList[index].num + 1;
        //     self.setData({
        //         medecineList: medecineList
        //     });
        //     self.getMonney('medecineList', 1);
        // } else {
        //     storeList[index].num = storeList[index].num + 1;
        //     self.setData({
        //         storeList: storeList
        //     });
        //     self.getMonney('storeList', 2);
        // }
        self.addNum({
            list: e.target.dataset.type == 1 ? 'medecineList' : 'storeList',
            index: index
        });

    },
    onChoseTap: function(e) {
        let self = this;
        let opts = e.target.dataset;
        let medecineList = self.data.medecineList;
        let storeList = self.data.storeList;
        let index = opts.index;
        if (opts.type == 1) {
            medecineList[index].isSelect = !medecineList[index].isSelect
            self.setData({
                medecineList: medecineList
            });
            if (!medecineList[index].isSelect) {
                self.setData({
                    medicineFlag: false,
                    allSelect: false,
                })
            }
            self.getMonney('medecineList', 1);
        } else {
            storeList[index].isSelect = !storeList[index].isSelect
            self.setData({
                storeList: storeList
            });
            if (!storeList[index].isSelect) {
                self.setData({
                    storeFlag: false,
                    allSelect: false,
                })
            }
            self.getMonney('storeList', 2);
        }
    },
    onAllTap: function(e) {
        let self = this;
        if (e.target.dataset.type == 1) {
            self.setData({
                medicineFlag: !self.data.medicineFlag,
                allSelect: !self.data.medicineFlag
            })
            self.selectTap('medicineFlag', 'medecineList');
            self.getMonney('medecineList', 1);
        } else {
            self.setData({
                storeFlag: !self.data.storeFlag,
                allSelect: !self.data.storeFlag
            })
            self.selectTap('storeFlag', 'storeList');
            self.getMonney('storeList', 2);
        }
        if (self.data.medicineFlag == self.data.storeFlag) {
            self.setData({
                allSelect: self.data.medicineFlag
            })
        }

    },
    allChoseTap: function(e) {
        let self = this;
        self.setData({
            allSelect: !self.data.allSelect,
            medicineFlag: !self.data.allSelect,
            storeFlag: !self.data.allSelect,
        });
        self.totalFun('medecineList');
        self.totalFun('storeList');
        self.selectTap('medicineFlag', 'medecineList');
        self.selectTap('storeFlag', 'storeList');
        // self.getMonney('medecineList',1);
        // self.getMonney('storeList',2);
    },
    selectTap: function(flag, arr) {
        let self = this;
        let list = self.data[arr];
        if (!list.length) return;
        for (let index = 0; index < list.length; index++) {
            list[index].isSelect = self.data[flag];
        }
        self.setData({
            [arr]: list
        })
    },
    //全选按钮功能
    totalFun: function(arr) {
        let self = this;
        let list = self.data[arr];
        for (let index = 0; index < list.length; index++) {
            list[index].isSelect = self.data.allSelect;
        }
        self.setData({
            arr: list
        })
    },
    getMonney: function(arr, type) {
        let self = this;
        let mediNum = 0;
        let storeNum = 0;
        let mediTotal = 0;
        let storeTotal = 0;
        let list = self.data[arr];
        if (!list.length) return;
        if (type == 1) {
            for (let index = 0; index < list.length; index++) {
                if (list[index].isSelect) {
                    mediNum = mediNum + 1;
                    mediTotal = mediTotal + list[index].num * list[index].nowPrice
                }
            }
            self.setData({
                mediNum: mediNum,
                mediTotal: mediTotal,
            })
        } else {
            for (let index = 0; index < list.length; index++) {
                if (list[index].isSelect) {
                    storeNum = storeNum + 1;
                    storeTotal = storeTotal + list[index].num * list[index].nowPrice;
                }
            }
            self.setData({
                storeNum: storeNum,
                storeTotal: storeTotal
            })
        }
    },
    touchstart: function(e) {
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
        })
        if (e.currentTarget.dataset.type == 1) {
            this.setData({
                medecineList: this.data.medecineList
            })
        } else {
            this.setData({
                storeList: this.data.storeList
            })
        }

    },
    //滑动事件处理
    touchmove: function(e) {
        let self = this;
        let index = e.currentTarget.dataset.index; //当前索引
        let startX = self.data.startX; //开始X坐标
        let startY = self.data.startY; //开始Y坐标
        let touchMoveX = e.changedTouches[0].clientX; //滑动变化坐标
        let touchMoveY = e.changedTouches[0].clientY; //滑动变化坐标
        //获取滑动角度
        let angle = self.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
        if (e.currentTarget.dataset.type == 1) {
            self.data.medecineList.forEach(function(v, i) {
                v.isTouchMove = false;
                //滑动超过30度角 return
                if (Math.abs(angle) > 30) return;
                if (i == index) {
                    if (touchMoveX > startX) { //右滑
                        v.isTouchMove = false;
                    } else { //左滑
                        v.isTouchMove = true;
                    }
                }
            })
            self.setData({
                medecineList: self.data.medecineList
            });
        } else {
            self.data.storeList.forEach(function(v, i) {
                v.isTouchMove = false;
                //滑动超过30度角 return
                if (Math.abs(angle) > 30) return;
                if (i == index) {
                    if (touchMoveX > startX) { //右滑
                        v.isTouchMove = false;
                    } else { //左滑
                        v.isTouchMove = true;
                    }
                }
            })
            self.setData({
                storeList: self.data.storeList
            });
        }
    },

    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle: function(start, end) {
        var _X = end.X - start.X,
            _Y = end.Y - start.Y
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    //删除事件
    onDeleteTap: function(e) {
        const self = this;
        const opts = e.currentTarget.dataset;
        Goods.deleteCart(self, {
            id: self.data[opts.list][opts.index].id
        }).then((ret) => {
            self.getCartList();
        }, (err) => {

        });
    },
    onMgtTap: function(e) {
        let self = this;
        self.setData({
            isMgt: !self.data.isMgt
        })
    },
    onAccountTap: function(e) {
        let self = this;
        let data = self.data;
        let ids = [];
        if (data.mediNum && data.storeNum) {
            _g.toast({
                title: '不能同时选择药房和商城的东西',
            });
        } else {
            let selectedList = [];
            if (data.mediNum) {
                selectedList = self.data.medecineList;
            } else {
                selectedList = self.data.storeList;
            }

            _.each(selectedList, (item) => {
                if (item.isSelect) {
                    ids.push(item.id)
                }
            });
            _g.navigateTo({
                url: 'pages/order/submit',
                param: {
                    from: 'cart',
                    platformFlag: data.mediNum ? 2 : 1,
                    postData: {
                        cartIds: ids.join(),
                        platformFlag: data.mediNum ? 2 : 1,
                    }
                }
            }, self)

        }

    },
    //批量删除
    onBatchDelete: function(e) {
        let self = this;
        let medIds = self.deleteIds('medecineList');
        let storeIds = self.deleteIds('storeList');
        let ids = '';
        if (!medIds && !storeIds) {
            return false;
        } else if (medIds && storeIds) {
            ids = medIds + ',' + storeIds
        } else {
            ids = medIds || storeIds;
        }
        console.log(44, ids);
        wx.showModal({
            content: '确认删除该商品？',
            confirmText: '删除',
            cancelText: '我再想想',
            cancelColor: '#007AFF',
            confirmColor: '#007AFF',
            success(res) {
                if (res.confirm) {
                    Goods.batchDeleteCart(self, {
                        ids: ids
                    }).then((ret) => {
                        self.getCartList();
                        self.setData({
                            mediNum: 0,
                            storeNum: 0,
                            mediTotal: 0,
                            storeTotal: 0,
                        })
                    }, (err) => {});
                } else if (res.cancel) {

                }
            }
        })
    },
    getCartList: function() {
        const self = this;
        self.getData();
        self.setData({
            mediNum: 0,
            storeNum: 0,
            mediTotal: 0,
            storeTotal: 0,
        })
        // Goods.cartList(self, {}).then((ret) => {
        //     let data = ret.data;
        //     self.setData({
        //         cartList: data
        //     });
        // }, (err) => {

        // });
    },
    //数量加 1 接口
    addNum: function(opts) {
        const self = this;
        const key = opts.list + '[' + opts.index + '].num';
        Goods.addNum(self, {
            id: self.data[opts.list][opts.index].id
        }).then((ret) => {
            self.setData({
                [key]: ++self.data[opts.list][opts.index].num
            });
            self.getMonney(opts.list, opts.list == 'medecineList' ? 1 : 2);
        }, (err) => {

        });
    },
    //数量减 1 接口
    subtractNum: function(opts) {
        const self = this;
        const key = opts.list + '[' + opts.index + '].num';
        Goods.subtractNum(self, {
            id: self.data[opts.list][opts.index].id
        }).then((ret) => {
            self.setData({
                [key]: --self.data[opts.list][opts.index].num
            });

            self.getMonney(opts.list, opts.list == 'medecineList' ? 1 : 2);

        }, (err) => {

        });
    },
    //整合批量删除的ids
    deleteIds: function(arr) {
        let self = this;
        let aimArr = self.data[arr];
        let idsArr = [];
        if (!aimArr.length) return;
        aimArr.forEach((item) => {
            if (item.isSelect) {
                idsArr.push(item.id)
            }
        });
        return idsArr.join(',');
    },
    onDetailTap: function(e) {
        let self = this;
        let opts = e.currentTarget.dataset;
        if (opts.type == 1) {
            _g.navigateTo({
                url: 'pages/goods/detail',
                param: {
                    id: self.data.medecineList[opts.index].goodsId,
                }
            }, self);
        } else if (opts.type == 2) {
            _g.navigateTo({
                url: 'pages/goods/detail',
                param: {
                    id: self.data.storeList[opts.index].goodsId,
                }
            }, self);
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