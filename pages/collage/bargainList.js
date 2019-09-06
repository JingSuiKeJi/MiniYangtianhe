// pages/collage/bargainList.js
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;
// 初始化数据
const data = {
  classfity: ['全部','中西药品','营养保健','养生花茶','情趣计生',],
  isSelect: 0,
  allList: [
    {
      url: 'renshen.png',
      title: '中药人参红枣',
      useful: '补血活血，调经止痛，润肠通便。用于血虚萎黄，眩晕心悸，月经不调，经闭痛…月经不调',
      prePrice: '19.00',
      scale: '3124',
      nowPrice: '9.99',
      personNum: '245'

    }
  ],
  personList: [
    {
      url: 'people.png',
      name: 'Amy',
    },
    {
      url: 'people.png',
      name: 'Amy',
    }
  ],
  top: 200,
  hideModal:true, //模态框的状态  true-隐藏  false-显示
  animationData:{},//
};

// 页面onLoad方法
const onLoad = function (self) {
    self.moveBarrage();
};

// 页面onShow方法
const onShow = function (self) {
    
};

// 页面中的方法
const methods = {
  onSelectTap: function (e) {
    let self = this;
    self.setData({
      isSelect: e.target.dataset.type
    })
    
  },
  onSkipTap: function (e) {
    let self = this;
    console.log(22)
    _g.navigateTo({
      url: 'pages/collage/bargain',
    },self)
  },
  
  onBargainTap: function (e) {
    let self = this;
    console.log(22);
    _g.navigateTo({
      url: 'pages/collage/myBargain',
    },self)
  },
  moveBarrage: function () {
    let self = this;
    let length= self.data.personList.length;
    let dis = (length - 1) * 76 + 300;
    let second = dis/37.5;
    let top = self.data.top - dis;
    self.setData({
      top,
      second
    });
  },
  // 显示遮罩层
  showModal: function () {
    var that=this;
    that.setData({
      hideModal:false
    })
  },
  // 隐藏遮罩层
  hideModal: function () {
    var that=this; 
    that.setData({
      hideModal:true
    })  
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
});
Page(initPage);