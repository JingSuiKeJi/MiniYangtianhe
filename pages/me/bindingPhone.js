// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
const _t = app.temps;
const event = app.event;
let data = {
  phoneValue: '',//手机号
	securityCodeValue:'',//验证码
  isShow: false,//显示隐藏绑定成功弹出框
	timeFlag:false,//计时开关
	count:60,//重新发送的倒计时
};
const onLoad = function (self) {
	
};
const onShow = function (self) { };
const onReady = function (self) { };
const onUnload = function (self) { };
const methods = {
  //双向绑定输入手机号
  onPhoneInputName: function (e) {
    const self = this;
    const phoneValue = self.data.phoneValue;
    self.setData({
      phoneValue: e.detail.value
    })
  },
	//双向数据绑定输入的验证码
	onSecurityCodeInputName:function(e){
		const self = this;
		const securityCodeValue = self.data.securityCodeValue;
		self.setData({
		  securityCodeValue: e.detail.value
		})
	},
  //绑定微信
  onSaveTap: function () {
    let self = this;
    // _g.toast({
    // 	title: '提交成功',
    // 	icon:'success'
    // });
    const isShow = self.data.isShow;
    self.setData({
      isShow: true
    });
    setTimeout(function () {//toast消失
      self.setData({
        isShow: false
      });
    }, 1500);
  },
	//获取验证码并开始倒计时
	onGetCodeSent:function () {
		const self = this;
		
		//计时器
		const count = self.data.count;
		const timeFlag = true;
		self.setData({
			timeFlag:timeFlag
		});
		if(timeFlag){
			var timer = setTimeout(function(){
				self.setData({
					count: count-1
				});
				clearTimeout(timer);
				self.onGetCodeSent();
			},1000)
		}
		if (count == 0) {
			clearTimeout(timer);
			//关闭计时，允许发送验证码
			const timeFlag = !self.data.timeFlag;
			self.setData({
				timeFlag:timeFlag
			});
			self.setData({
				count:60
			});
			return
		}
	},
};

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