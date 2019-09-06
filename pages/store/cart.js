// pages/store/cart.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
// 初始化数据
  const data = {
      allSelect: false,
      medicineFlag: false,//养乐药房
      storeFlag: false,//养乐商城
      id: '',
      mediNum: 0,
      storeNum: 0,
      mediTotal: 0,
      storeTotal: 0,
      num: 0,
      medecineList:[
        {
          url: 'order_icon.png',
          title: '养生堂维C+养生堂维C+养生堂维C+养生堂维C+',
          scale: '250gx两盒装',
          price: '10.00',
          id: '01',
          count: 1,
          isSelect: false,
          isTouchMove: false
        },
        {
          url: 'order_icon.png',
          title: '养生堂维C+',
          scale: '250gx两盒装',
          price: '10.00',
          id: '010',
          count: 1,
          isSelect: false,
          isTouchMove: false
        },
    ],
      storeList: [
        {
          url: 'order_icon.png',
          title: '养生堂维C+',
          scale: '250gx两盒装',
          price: '10.00',
          id: '06',
          count: 1,
          isSelect: false,
        },
      ],
      startX: 0, //开始坐标
      startY: 0,
      isMgt: false
  };
  
  // 页面onLoad方法
  const onLoad = function (self) {
     self.getTabBar().setData({
     	selected:3
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
			Goods.cartList(self, {
			}).then((ret)=>{
				let data = ret.data;
				self.setData({
					total: total
				});
			},(err)=>{
		
			});
		},
        onSubtractionTap: function (e) {
			let self = this;
			let medecineList = self.data.medecineList;
			let storeList = self.data.storeList;
			let index = e.target.dataset.index;
			if (e.target.dataset.type==1) {
				if (medecineList[index].count == 1) return;
				medecineList[index].count = medecineList[index].count - 1;
				self.setData({
				medecineList: medecineList
				});
				self.getMonney('medecineList',1);
			} else {
				if (storeList[index].count == 1) return;
				storeList[index].count = storeList[index].count - 1;
				self.setData({
				storeList: storeList
				});
				self.getMonney('storeList',2); 
			}

        },
        onAddTap: function (e) {
			let self = this;
			let medecineList = self.data.medecineList;
			let storeList = self.data.storeList;
			let index = e.target.dataset.index;
			if (e.target.dataset.type==1) {
				medecineList[index].count = medecineList[index].count + 1;
				self.setData({
				medecineList: medecineList
				});
				self.getMonney('medecineList',1);
			} else {
				storeList[index].count = storeList[index].count + 1;
				self.setData({
				storeList: storeList
				});
				self.getMonney('storeList',2); 
			}
           
        },
        onChoseTap: function (e) {
			let self = this;
			let medecineList = self.data.medecineList;
			let storeList = self.data.storeList;
			let index = e.target.dataset.index;
			if (e.target.dataset.type == 1) {
				medecineList[index].isSelect=!medecineList[index].isSelect
				self.setData({
				medecineList: medecineList
				});
				if (!medecineList[index].isSelect) {
				self.setData({
					medicineFlag: false
				})
				}
				self.getMonney('medecineList',1);
			} else {
				storeList[index].isSelect = !storeList[index].isSelect
				self.setData({
				storeList: storeList
				});
				if (!storeList[index].isSelect) {
				self.setData({
					storeFlag: false
				})
				}
				self.getMonney('storeList',2);
			}   
        },
        onAllTap: function (e) {
			let self = this;
			let medecineList = self.data.medecineList;
			let storeList = self.data.storeList;
			if (e.target.dataset.type == 1) {
				self.setData({
				medicineFlag: !self.data.medicineFlag
				})
				self.selectTap( 'medicineFlag','medecineList');
				// for (let index = 0; index < medecineList.length; index++) {
				//   medecineList[index].isSelect = self.data.medicineFlag
				// }
				// self.setData({
				//   medecineList: medecineList
				// })
          } else {
				self.setData({
				storeFlag: !self.data.storeFlag
				})
				for (let index = 0; index < storeList .length; index++) {
				storeList[index].isSelect = self.data.storeFlag
				}
				self.setData({
				storeList : storeList 
				});
				self.getMonney('storeList',2)
			}
          
        },
        allChoseTap: function (e) {
			let self = this;
			self.setData({
				allSelect: !self.data.allSelect,
				medicineFlag: !self.data.allSelect,
				storeFlag: !self.data.allSelect,
			});
			self.totalFun('medecineList');
			self.totalFun('storeList');
        },
        selectTap: function (flag,arr) {
			let self = this;
			let list = self.data[arr];
			console.log(111,self.data[arr])
			for (let index = 0; index < list.length; index++) {
				list[index].isSelect = self.data[flag];
			}
			self.setData({
				arr: list
			})
			console.log(222,self.data[arr])
        },

        totalFun:function (arr) {
			let self = this;
			let list = self.data[arr];
			for (let index = 0; index < list.length; index++) {
				list[index].isSelect = self.data.allSelect;
			}
			self.setData({
				arr: list
			})
        },
        getMonney: function (arr,type) {
			let self = this;
			let mediNum = 0;
			let storeNum = 0;
			let mediTotal = 0;
			let storeTotal = 0;
			let list = self.data[arr];
			if (type == 1) {
				for (let index = 0; index < list.length; index++) {
				if (list[index].isSelect) {
					mediNum = mediNum + 1;
					mediTotal = mediTotal +list[index].count * list[index].price
					}  
				}
				self.setData({
				mediNum:  mediNum,
				mediTotal: mediTotal,
				})
			} else {
				for (let index = 0; index < list.length; index++) {
				if (list[index].isSelect) {
					storeNum = storeNum + 1;
					storeTotal = storeTotal +list[index].count * list[index].price; 
				}  
				}
				self.setData({
				storeNum: storeNum,
				storeTotal: storeTotal 
				})
			}
        },
        touchstart: function (e) {
			this.setData({
				startX: e.changedTouches[0].clientX,
				startY: e.changedTouches[0].clientY,
			})
			if (e.currentTarget.dataset.type == 1) {
				this.setData({
				medecineList: this.data.medecineList
				})
			}else {
				this.setData({
				storeList: this.data.storeList
				})
			}
          
        },
      
        //滑动事件处理
      
        touchmove: function (e) {
			let self = this;
			let index = e.currentTarget.dataset.index;//当前索引
			let startX = self.data.startX;//开始X坐标
			let startY = self.data.startY;//开始Y坐标
			let touchMoveX = e.changedTouches[0].clientX;//滑动变化坐标
			let touchMoveY = e.changedTouches[0].clientY;//滑动变化坐标
			//获取滑动角度
			let  angle = self.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
			if (e.currentTarget.dataset.type == 1) {
				self.data.medecineList.forEach(function (v, i) {
					v.isTouchMove = false;
					//滑动超过30度角 return
					if (Math.abs(angle) > 30) return;
					if (i == index) {
						if (touchMoveX > startX) {//右滑
						v.isTouchMove = false;
						}else{//左滑
						v.isTouchMove = true;
						} 
					}
				})
				self.setData({
					medecineList: self.data.medecineList
				});
			}else {
				self.data.storeList.forEach(function (v, i) {
					v.isTouchMove = false;
					//滑动超过30度角 return
					if (Math.abs(angle) > 30) return;
					if (i == index) {
						if (touchMoveX > startX) {//右滑
						v.isTouchMove = false;
						}else{//左滑
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
        angle: function (start, end) {
			var _X = end.X - start.X,
			_Y = end.Y - start.Y
			//返回角度 /Math.atan()返回数字的反正切值
			return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
        },
        //删除事件
        del: function (e) {
			this.data.medecineList.splice(e.currentTarget.dataset.index, 1)
			this.setData({
				medecineList: this.data.medecineList
		
			})
        },
        onMgtTap: function (e) {
			let self = this;
			self.setData({
				isMgt: !self.data.isMgt
			})
        },
        onAccountTap: function (e) {
			let self = this;
			_g.navigateTo({
				url:'pages/pay/account'
			},self)
        },
        onDelectTap: function (e) {
			let self = this;
			wx.showModal({
				content: '确认删除该商品？',
				confirmText: '删除',
				cancelText: '我再想想',
				cancelColor: '#007AFF',
				confirmColor: '#007AFF',
				success (res) {
				if (res.confirm) {
					console.log('用户点击确定')
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
				}
			})
		},
		getCartList: function () {
			let self  = this;
			Goods.cartList(self, {
			}).then((ret)=>{
				let data = ret.data;
				self.setData({
				    cartList: data
				});
			},(err)=>{
		
			});
		},
		addNum: function () {
			Goods.addNum(self, {
				id: 1
			}).then((ret)=>{
				
			},(err)=>{
		
			});
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