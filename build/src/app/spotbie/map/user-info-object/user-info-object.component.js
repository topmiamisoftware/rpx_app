"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfoObjectComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let UserInfoObjectComponent = class UserInfoObjectComponent {
    constructor(router) {
        this.router = router;
        this.close = new core_1.EventEmitter();
    }
    viewProfile(username) {
        if (username === 'User is a Ghost') {
            return;
        }
        this.router.navigate(['/user-profile/' + username]);
    }
    closeThis() {
        this.close.emit();
    }
    ngOnInit() { }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], UserInfoObjectComponent.prototype, "currentMarker", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], UserInfoObjectComponent.prototype, "close", void 0);
UserInfoObjectComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-user-info-object',
        templateUrl: './user-info-object.component.html',
        styleUrls: ['./user-info-object.component.css', '../map.component.css'],
    })
], UserInfoObjectComponent);
exports.UserInfoObjectComponent = UserInfoObjectComponent;
//# sourceMappingURL=user-info-object.component.js.map