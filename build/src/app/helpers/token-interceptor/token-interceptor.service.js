"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInterceptor = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const preferences_1 = require("@capacitor/preferences");
let TokenInterceptor = class TokenInterceptor {
    intercept(req, next) {
        return (0, rxjs_1.from)(preferences_1.Preferences.get({ key: 'spotbiecom_session' })).pipe((0, rxjs_1.switchMap)(getRes => {
            const token = getRes.value;
            let modifiedReq;
            if (token && token !== 'null') {
                modifiedReq = req.clone({
                    withCredentials: true,
                    setHeaders: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            else {
                modifiedReq = req.clone({
                    withCredentials: true,
                });
            }
            return next.handle(modifiedReq);
        }));
    }
};
TokenInterceptor = tslib_1.__decorate([
    (0, core_1.Injectable)()
], TokenInterceptor);
exports.TokenInterceptor = TokenInterceptor;
//# sourceMappingURL=token-interceptor.service.js.map