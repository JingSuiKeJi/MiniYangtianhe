/**
 * Created by hou on 19/05/2017.
 * 模板管理
 */
function temps() {
};

temps.prototype = {

    /**
     * demo模板定义
     */
    demo: {
        // 定义常量
        data: {
            test: 'test'
        },
        // 定义模板方法
        methods: {
            tempTap: function () {
                var self = this;
                var _g = getApp().base;
                _g.navigateTo({
                    self: self,
                    url: 'pages/demo1/demo',
                    param: {
                        a: 'demo temp navigate'
                    }
                });
            }
        }
    }
};

temps.prototype.constructor = temps;
module.exports = new temps();
