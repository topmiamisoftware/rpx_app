"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInterceptor = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let TokenInterceptor = class TokenInterceptor {
    intercept(req, next) {
        const token = localStorage.getItem('spotbiecom_session');
        let modifiedReq;
        if (token !== '' && token !== null && token !== 'null') {
            modifiedReq = req.clone({
                withCredentials: true,
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        else {
            modifiedReq = req.clone({
                withCredentials: true,
            });
        }
        return next.handle(modifiedReq);
    }
};
TokenInterceptor = tslib_1.__decorate([
    (0, core_1.Injectable)()
], TokenInterceptor);
exports.TokenInterceptor = TokenInterceptor;
//# sourceMappingURL=token-interceptor.service.js.map