const app = getApp();
const _g = app.base;
const event = app.event;
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        hiddenWerunPopup: {
            type: Boolean,
            value: true,
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                  hiddenWerunPopup: newVal
                });
            }
        }
    },
    ready() {

    },
    data: {
        message: '获取不到您的微信步数，请开启服务',
        hiddenWerunPopup: true,
        // eventName: '',
        type: ''
    },
    methods: {
        openSettingTap(e) {
            const self = this;
            event.emit('werun-getSettingData', e);
        }
    }
});