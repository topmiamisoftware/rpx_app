"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastHelperComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let ToastHelperComponent = class ToastHelperComponent {
    constructor() {
        this.dismiss_toast = new core_1.EventEmitter();
    }
    dismissToast() {
        const toast_response = { type: 'acknowledge', callback: this.helper_config.actions.acknowledge };
        this.dismiss_toast.emit(toast_response);
    }
    confirm() {
        const toast_response = { type: 'confirm', confirm: true, callback: this.helper_config.actions.confirm };
        this.dismiss_toast.emit(toast_response);
    }
    decline() {
        const toast_response = { type: 'confirm', confirm: false, callback: this.helper_config.actions.decline };
        this.dismiss_toast.emit(toast_response);
    }
    ngOnInit() {
        this.bg_color = localStorage.getItem('spotbie_backgroundColor');
        //console.log("Current Config: ", this.helper_config)
        //Let's find out what type of toast message we are showing
        switch (this.helper_config.type) {
            case 'acknowledge':
                //set time out to disappear
                setTimeout(function () {
                    this.dismissToast();
                }.bind(this), 1500);
                break;
            case 'confirm':
                break;
        }
    }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], ToastHelperComponent.prototype, "helper_config", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], ToastHelperComponent.prototype, "dismiss_toast", void 0);
ToastHelperComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-toast-helper',
        templateUrl: './toast-helper.component.html',
        styleUrls: ['./toast-helper.component.css']
    })
], ToastHelperComponent);
exports.ToastHelperComponent = ToastHelperComponent;
//# sourceMappingURL=toast-helper.component.js.map