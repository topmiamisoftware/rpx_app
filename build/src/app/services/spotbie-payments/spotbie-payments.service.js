"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotbiePaymentsService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const error_helper_1 = require("../../helpers/error-helper");
const environment_1 = require("../../../environments/environment");
let SpotbiePaymentsService = class SpotbiePaymentsService {
    constructor(http) {
        this.http = http;
    }
    savePayment(saveAdsObj, apiUrl) {
        const saveAdsApi = `${environment_1.environment.apiEndpoint}${apiUrl}`;
        return this.http
            .post(saveAdsApi, saveAdsObj)
            .pipe((0, rxjs_1.catchError)((0, error_helper_1.handleError)('saveAdPayment')));
    }
    checkBusinessMembershipStatus(businessUuidObj) {
        const saveAdsApi = `${environment_1.environment.apiEndpoint}user/membership-status`;
        return this.http
            .post(saveAdsApi, businessUuidObj)
            .pipe((0, rxjs_1.catchError)((0, error_helper_1.handleError)('saveAdPayment')));
    }
    cancelBusinessMembership() {
        const saveAdsApi = `${environment_1.environment.apiEndpoint}user/cancel-membership`;
        return this.http
            .post(saveAdsApi, null)
            .pipe((0, rxjs_1.catchError)((0, error_helper_1.handleError)('cancelBusinessMembership')));
    }
};
SpotbiePaymentsService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], SpotbiePaymentsService);
exports.SpotbiePaymentsService = SpotbiePaymentsService;
//# sourceMappingURL=spotbie-payments.service.js.map