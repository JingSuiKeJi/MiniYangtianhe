// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
const Order = require('../../service/Order');
let data = {
	storeList:[],
	showAfterModal:false,//选择售后原因模态框
	reasonFlag:'',//选择当前售后原因
	selectFinish:false,//确认选择
	reason:'',//售后原因
	description:'',//退款说明
	tempFilePaths:[],//本地照片地址
	showModal:false,//提交订单
	status: 1,
};
const onLoad = function(self) {
	self.setData({
		orderItemIds: self.data.orderItemIds
	})
	self.getData();
}
const onShow = function(self) {}
const onReady = function(self) {}
const onUnload = function(self) {}
const methods = {
	getData: function () {
	   const self = this;
       self.appayBefore();
	},
	appayBefore: function () {
		const self = this;
        Order.appayBefore(self, {
            orderItemIds: self.data.orderItemIds
        }).then((ret) => {
			let data = ret.data;
			let opts  = data.orderAfterSaleVO;
			let causeList = _.map(data.causeList,(item)=> {
				let param = {}
				param.reason = item;
				param.reasonFlag = false;
				return param
			})
			let type = 0;
			let title = '申请退款';
			if (opts.refundSwich) {
				type = 1;
				title = '申请退款';
			}
			if (opts.salesReturnSwich) {
				type = 2
				title = '申请退货';
			}
			if (opts.exchangeGoodsSwich) {
				type = 3
				title = '申请换货';
			}
			self.setData({
				storeList: opts.goodsVoList,
				totalPrice: opts.totalPrice,
				causeList: causeList,
				type: type,
				title: title
			})
        }, (err) => {

        });
	},
	afterSaleApply: function () {
		let self = this;
		let data = self.data;
		let param = {
			orderItemIds: data.orderItemIds,
			type: data.type,
			reason: data.reason,
			description: data.description,
			type: data.type
		}
		param.imgUrl = data.tempFilePaths.length ? data.tempFilePaths.join(',') : '';
		if (data.type == 1) {
			if (data.status == 1) {
				param.status = 1;//未收到
			} else {
				param.status = 2;//已收到
			}
		}
		if (data.type == 2) {
			if (data.status == 1) {
				param.status = 3;//未拆封
			} else {
				param.status = 4;//已拆封
			}
		}
		Order.afterSaleApply(self, param).then((ret) => {
			_g.navigateTo({
				url: 'pages/order/afterSale',
			}, self);
        }, (err) => {

        });
	},
	//退款说明//失去焦点
	areablur:function(){
		const self = this;
		self.setData({
		  auto_height:false
		})
	},
	//退款说明//获取焦点
	areafocus:function(){
		const self = this;
		self.setData({
		  auto_height: true
		})
	},
	//退款说明内容双向绑定
	onExplainTap:function(e){
		const self = this;
		self.setData({
			description: e.detail.value
		})
	},
	//添加照片
	onChooseImgTap:function () {
		let self = this; 
		let  tempFilePaths =  self.data.tempFilePaths;
		_g.chooseImage({
            success: function(ret) {   
                _g.onUpload({
                    imageList: ret.tempFilePaths,
                    success: function(ret) {
						tempFilePaths.push(ret[0])
                        self.setData({
                            tempFilePaths: tempFilePaths
						});
                    }
                   
                });
            }
        });
	},
	//删除照片
	onDeletePicTap:function(options){
		const self = this;
		const index = options.currentTarget.dataset.index;
		const tempFilePaths = self.data.tempFilePaths
		//删除
		tempFilePaths.splice(index,1);
		self.setData({  
			tempFilePaths:tempFilePaths
		})
	},
	//售后原因
	showAfterDialogBtn: function () {
		this.setData({
		  showAfterModal: true
		})
	},
	hideAfterModal: function () {
		let self = this;
		self.setData({
			reasonFlag:'',
		})
		self.setData({
		  showAfterModal: false
		});
	},
	//确认选择售后原因
	onAfterConfirm: function () {
		let self = this;
		let reason = '';
	    _.each(self.data.causeList,(item)=> {
            if (item.reasonFlag) {
			  return reason = item.reason
			}
		})
		self.setData({
			reason:reason
		})
		self.hideAfterModal()
	},
	//选择售后原因
	onSelectReasonTap:function(options){
		let self = this; 
		let causeList = self.data.causeList;
		let index = options.currentTarget.dataset.index;
		let idx = self.data.index;
		if((index != self.data.index) && (idx >= 0)){
			causeList[idx].reasonFlag = !causeList[idx].reasonFlag;
			causeList[index].reasonFlag = !causeList[index].reasonFlag;
		}else {
			causeList[index].reasonFlag = !causeList[index].reasonFlag;
		}
		self.setData({
			causeList: causeList,
			index: index
		})
	},
	//提交模态框
	showDialogBtn: function () {
		this.setData({
		  showModal: true
		})
	},
	hideModal: function () {
		this.setData({
		  showModal: false
		});
	},
	onCancel: function () {
		this.hideModal();
	},
	//提交售后申请
	onConfirm: function () {
		let self = this;
		self.afterSaleApply();
		self.hideModal();
	},
	onStatusTap: function (e) {
		let self = this;
		self.setData({
			status: e.currentTarget.dataset.status
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