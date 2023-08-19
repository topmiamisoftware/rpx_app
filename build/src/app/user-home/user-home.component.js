"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHomeComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let UserHomeComponent = class UserHomeComponent {
    constructor() {
        this.openSettingsEvt = new core_1.EventEmitter();
    }
};
tslib_1.__decorate([
    (0, core_1.Output)()
], UserHomeComponent.prototype, "openSettingsEvt", void 0);
UserHomeComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-user-home',
        templateUrl: './user-home.component.html',
        styleUrls: ['./user-home.component.css'],
    })
], UserHomeComponent);
exports.UserHomeComponent = UserHomeComponent;
//# sourceMappingURL=user-home.component.js.map