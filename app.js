//app.js
App({
    onLaunch: function(opts) {
        // 引入相关js
        this.base = require('/libs/base.js');
        this.promise = require('/libs/q.js');
        this.underscore = require('/libs/underscore.js');
        this.event = require('/libs/event.js');
        this.config = require('/libs/config.js');
        this.temps = require('/templates/temps.js');
        var self = this;
        self.base.logger();
        wx.getSystemInfo({
            success(res) {
                if (res.environment == 'wxwork') {
                    self.base.setLS('isWork', true);
                }
                self.base.setLS('systemType', res.platform);
                self.base.setLS('systemInfo', res);
                //获取状态栏高度
                self.base.setLS('statusBarHeight', res.statusBarHeight);
                let bar2Bottom = 0;
                if (res.platform == 'ios') {
                    let model = res.model.split('<')[1].split('>')[0];
                    let modelType = model.split('iPhone')[1].split(',');
                    if (modelType[0] == 11) {
                        bar2Bottom = 34;
                    } else if (modelType[0] == 10 && modelType[1] == 2) {
                        bar2Bottom = 34;
                    } else {
                        bar2Bottom = 20;
                    }
                } else {
                    bar2Bottom = 20;
                }
                self.base.setLS('bar2Bottom', bar2Bottom);
            }
        });
        // getGoodsPosterBg
        self.base.rmLS('posterThumb');
        self.base.rmLS('avatarThumb');
        self.base.rmLS('myPosterUrl');
        self.base.rmLS('goodsPosterBg');
        self.base.getGoodsPosterBg(self);
    },
	globalData: {
		//状态栏高度
		statusBarHeight:wx.getSystemInfoSync()['statusBarHeight'],
		//手机屏幕可用高度
		screenHeight:wx.getSystemInfoSync()['screenHeight'],
    }

});