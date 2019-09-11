const app = getApp();
const _g = app.base;
const event = app.event;
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        message: {
            type: String,
            value: '',
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                    message: newVal
                });
            }
        },
        isHidden: {
            type: Boolean,
            value: true,
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                    isHidden: newVal
                });
            }
        },
        eventName: {
            type: String,
            value: true,
            observer(newVal, oldVal, changedPath) {
                const self = this;
                self.setData({
                    eventName: newVal
                });
            }
        },
    },
    ready() {

    },
    data: {
        message: '',
        isHidden: true,
        eventName: '',
        type: ''
    },
    methods: {
        openSettingTap(e) {
            const self = this;
            event.emit(self.data.eventName, e);
        }
    }
});