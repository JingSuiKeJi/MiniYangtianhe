/*
    //https://github.com/dannnney/weapp-event
    //举个栗子:
    //每个页面需要引入event
    const event = app.event;
    //pageA addListener
    //第一个参数为事件名称,callback中的data为sendEvent中的第二个参数
    event.on('test', self, function(data) {
        //do something
    })
    //pageB sendEvent
    //第一个参数为事件名称 第二个参数为改变的字段的值
    event.emit('test', {
        key: 'value'
    });

    //使用了监听器后,在页面销毁时需要把事件remove掉,防止发生内存泄漏,什么叫内存泄漏我也不知道,哈哈哈
    const onUnload = function (self) {
        event.remove('test', self);
    };
*/

var events = {};
function on(name, self, callback) {
    var tuple = [self, callback];
    var callbacks = events[name];
    if (Array.isArray(callbacks)) {
        callbacks.push(tuple);
    }
    else {
        events[name] = [tuple];
    }
}
function remove(name, self) {
    var callbacks = events[name];
    if (Array.isArray(callbacks)) {
        events[name] = callbacks.filter((tuple) => {
            return tuple[0] != self;
        })
    }
}
function emit(name, data) {
    var callbacks = events[name];
    if (Array.isArray(callbacks)) {
        callbacks.map((tuple) => {
            var self = tuple[0];
            var callback = tuple[1];
            callback.call(self, data);
        })
    }
}
exports.on = on;
exports.remove = remove;
exports.emit = emit;