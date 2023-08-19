"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const spotbieGlobals = require("../../../globals");
const SIGN_UP_API = spotbieGlobals.API + 'user';
let SignUpService = class SignUpService {
    constructor(http) {
        this.http = http;
    }
    initRegister(register_object) {
        const sign_up_api = SIGN_UP_API + '/sign-up';
        return this.http.post(sign_up_api, register_object);
    }
};
SignUpService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], SignUpService);
exports.SignUpService = SignUpService;
//# sourceMappingURL=sign-up.service.js.map