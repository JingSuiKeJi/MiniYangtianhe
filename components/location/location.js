const app = getApp();
const _g = app.base;
const event = app.event;
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        hiddenLocationPopup: {
            type: Boolean,
            value: true,
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                  hiddenLocationPopup: newVal
                });
            }
        }
    },
    ready() {

    },
    data: {
        message: '请开启定位',
        hiddenLocationPopup: true,
        // eventName: '',
        type: ''
    },
    methods: {
        openSettingTap(e) {
            const self = this;
            event.emit('setLocationConfig', e);
        }
    }
});