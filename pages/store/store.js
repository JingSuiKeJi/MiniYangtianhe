// pages/store/store.js
// js库引入
const app = getApp();
const _ = app.underscore;
const _g = app.base;
const _c = app.config;

// 初始化数据
const data = {
  imgUrls: [
    'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
    'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
    'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
  ],
  classList: [
    {
      url: 'ganmaoling.png',
      text: '感冒发烧'
    },
    {
      url: 'water.png',
      text: '美妆个护'
    },
    {
      url: 'baojian.png',
      text: '营养保健'
    },
    {
      url: 'zibu.png',
      text: '滋补调养'
    },
    {
      url: 'nvxing.png',
      text: '女性用药'
    },
    {
      url: 'myyy.png',
      text: '母婴孕产'
    },
    {
      url: 'nanjk.png',
      text: '成人计生'
    },
    {
      url: 'xinnaoyao.png',
      text: '心脑用药'
    },
    {
      url: 'chengrenyao.png',
      text: '男科健康'
    },
    {
      url: 'allclass.png',
      text: '全部分类'
    },
  ],
  collageList:  [
    {
      imgUrl: 'guilinggao.png',
      title: '生和堂红豆龟苓膏',
      nowPrice: 10.00,
      prePrice: 14.00
    },
    {
      imgUrl: 'e_c.png',
      title: '养生堂VE+C',
      nowPrice: 99.00,
      prePrice: 133.00
    },
    {
      imgUrl: 'jieshibang.png',
      title: '杰士邦黄金持久避孕套套套',
      nowPrice: 59.90,
      prePrice: 99.00
    },
    {
      imgUrl: 'guilinggao.png',
      title: '生和堂红豆龟苓膏',
      nowPrice: 10.00,
      prePrice: 14.00
    }
  ],
  currentIndex: 1,
  medicineList:['感冒药','消炎药','胃药','解暑药','腹泻','胃药'],
  list: [1,2],
  classifyType: 0,
  goodList:[
    {
      imgUrl: 'guilinggao.png',
      title: '生和堂红豆龟苓膏',
      nowPrice: 10.00,
      prePrice: 14.00
    },
    {
      imgUrl: 'e_c.png',
      title: '养生堂VE+C',
      nowPrice: 99.00,
      prePrice: 133.00
    },
    {
      imgUrl: 'jieshibang.png',
      title: '杰士邦黄金持久避孕套',
      nowPrice: 59.90,
      prePrice: 99.00
    },
    {
      imgUrl: 'guilinggao.png',
      title: '生和堂红豆龟苓膏',
      nowPrice: 10.00,
      prePrice: 14.00
    }
  ],
  imgTopList:['tangcheng.png','renhe.png','shike.png','tangcheng.png'],
  imgBottomList: ['zhongsheng.png','gangben.png','yansheng.png','zhongsheng.png'],
  tapList:['应季热销','驱蚊止痒','养生花茶','皮肤用药'],
  active: 0,
  list: [
    {
      title: '红豆口味，清热解毒，男女老少都爱吃',
      scale: '【4盒装】 [生和堂] 红豆龟苓膏 200gx4盒',
      prePrice: '14.00',
      nowPrice: '10.00' ,
      count: '3125',
      url: 'shangtu.png',
      reward: '1.53'
   }
  ],
  isSlide: false,
};

// 页面onLoad方法
const onLoad = function (self) {
    self.getData();
		self.getTabBar().setData({
			selected: 1
		});
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
          },
          onMoreTap: function (e) {
            let self = this;
            _g.navigateTo({
              url: 'pages/collage/index'
            },self)
            console.log(222)
          },
          onSkipTap: function() {
            let self = this;
            _g.navigateTo({
              url: 'pages/search/search',
            }, self);
          },
          onChangeTap: function(e) {
            let self = this;
            self.setData({
              currentIndex : e.detail.current
            })
          },
        onClickTap: function(e) {
          let self = this;
          console.log(e.target.dataset.type)
          self.setData({
            active: e.target.dataset.type 
          })
        },
        onSlideTap: function(e) {
          let self = this;
        console.log(self.data.isSlide)
        self.setData({
          isSlide: !self.data.isSlide
        })

        },
        onClassifyTap: function (e) {
          let self = this;
          self.setData({
          classifyType: e.detail.current,
          });
        },
        onListTap: function (e) {
          let self = this;
          _g.navigateTo({
            url: 'pages/search/classify',
          }, self);
        },
        onDetailTap: function (e) {
          let self = this;
          _g.navigateTo({
            url: 'pages/collage/detail',
          }, self);
        },
        onBrandsTap: function (e) {
          let self = this;
          _g.navigateTo({
            url: 'pages/search/brandList',
          }, self);
        },
        onAllBrandsTap: function (e) {
          let self = this;
          _g.navigateTo({
            url: 'pages/search/brand',
          }, self);
        },
        onResultTap: function (e) {
          let self = this;
          _g.navigateTo({
           url: 'pages/search/detailList',
           param: {
               id: e.target.dataset.id,
               value: e.target.dataset.id,
             }
         }, self);
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