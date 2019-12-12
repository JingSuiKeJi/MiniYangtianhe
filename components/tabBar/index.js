const app = getApp();
Component({
	properties: {
		selected: {
			type: Number,
			value: 0
		}
	},
  //数据
  data: {
	flag: true,
    color: "#8E8E93",//未选中tabBar时的文字颜色
    selectedColor: "#03B8AB",//选中时tabBar文字颜色
    // tabBar对象集合
    list: [
		{
			"iconPath": "/images/tabbarIcon/tabbar_pharmacy.png",
			"selectedIconPath": "/images/tabbarIcon/tabbar_selectPharmacy.png",
			"pagePath": "/pages/home/index",
			"text": "养乐药房"
		},
		{
			"iconPath": "/images/tabbarIcon/tabbar_market.png",
			"selectedIconPath": "/images/tabbarIcon/tabbar_selectmarket.png",
			"pagePath": "/pages/store/store",
			"text": "养乐商城"
		},
		{
			"iconPath": "/images/tabbarIcon/raiseHappyStep.png",
			"selectedIconPath": "/images/tabbarIcon/raiseHappyStep.png",
			"pagePath": "/pages/step/index",
			"text": "养乐步"
		},
		{
			"iconPath": "/images/tabbarIcon/tabbar_cart.png",
			"selectedIconPath": "/images/tabbarIcon/tabbar_selectCart.png",
			"pagePath": "/pages/store/cart",
			"text": "购物车"
		},
		{
			"iconPath": "/images/tabbarIcon/tabbar_me.png",
			"selectedIconPath": "/images/tabbarIcon/tabbar_selectMe.png",
			"pagePath": "/pages/me/index",
			"text": "我的"
		}
    ]
  },
  methods: {
    // tabBar切换事件
    tab_bar_index(e) {
		const url = e.currentTarget.dataset.path;
		wx.switchTab({url})
    },
  }
})