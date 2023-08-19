"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginGuardServiceService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const logout_callback_1 = require("../../helpers/logout-callback");
let LoginGuardServiceService = class LoginGuardServiceService {
    constructor(router, userAuthService) {
        this.router = router;
        this.userAuthService = userAuthService;
    }
    async canActivate(route, state) {
        const response = await this.userAuthService.checkIfLoggedIn();
        if (response.message === '1') {
            return true;
        }
        else {
            const resp = {
                success: true,
            };
            (0, logout_callback_1.logOutCallback)(resp);
            return false;
        }
    }
};
LoginGuardServiceService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], LoginGuardServiceService);
exports.LoginGuardServiceService = LoginGuardServiceService;
//# sourceMappingURL=login-guard-service.service.js.map