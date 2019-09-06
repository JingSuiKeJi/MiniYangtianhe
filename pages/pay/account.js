// pages/pay/account.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;

// 初始化数据
const data = {
   list:[
     { 
       url: 'order_icon.png',
       title: '养生堂维C+',
       scale: '250gx两盒装',
       price: '99.00',
       num: '2',
     }
   ],
   postType: '请输入配送方式', 
   type: -1,
   pickerValue: [0, 0],
   timeList: [['2019-07-25', '2019-07-26'], ['12:00-13:00', '13:00-14:00']],
   postTime: '请选择配送时间',
   infoList: [
     {
       name: '周周周',
       phone: '15677220282',
       address: '广州市天河区天盈广场东塔3004'
     }
   ],
   pointsFlag: true,//有积分可用
   flag: true,//有优惠卷可用,
   isSelect: false,//是否使用积分
   remark: '',
};

// 页面onLoad方法
const onLoad = function (self) {
   
};

// 页面onShow方法
const onShow = function (self) {
    
};
const onUnload= function (self) {
    
}
// 页面中的方法
const methods = {
        onPostTap: function (e) {
          let self = this;
          if (e.target.dataset.type == 0) {
            self.setData({
              postType: '立即配送', 
              type: 0
            })
            console.log(111,self.data.type)
          } else if (e.target.dataset.type == 1){
            self.setData({
              postType: '预约配送', 
              type: e.target.dataset.type
            })
          }else if (e.target.dataset.type == 2){
            self.setData({
              postType: '到店自取', 
              type: e.target.dataset.type
            })
          } 
        },
        onPickerTap: function (e) {
          let self = this;
          let pickerValue = e.detail.value;
          let postTime = self.data.timeList[0][pickerValue[0]] +   self.data.timeList[1][pickerValue[1]]
          this.setData({
            pickerValue: pickerValue,
            postTime: postTime
          })
        }, 
        onSelectTap: function (e){
          let self = this;
          self.setData({
            isSelect: !self.data.isSelect
          })
        },
        onSubmitTap: function (e) {
          let self = this;
          console.log(22)
        
        }
 }

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