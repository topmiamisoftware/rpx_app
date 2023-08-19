"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessMenuServiceService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const spotbieGlobals = require("../../../globals");
const error_helper_1 = require("../../../helpers/error-helper");
const operators_1 = require("rxjs/operators");
const REWARD_API = `${spotbieGlobals.API}reward`;
const BUSINESS_API = `${spotbieGlobals.API}business`;
let BusinessMenuServiceService = class BusinessMenuServiceService {
    constructor(http) {
        this.http = http;
    }
    fetchRewards(fetchRewardsReq = null) {
        const rewardsApi = `${REWARD_API}/index`;
        return this.http
            .post(rewardsApi, fetchRewardsReq)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('fetchRewards')));
    }
    getCommunityMember(fetchRewardsReq) {
        const communityMemberApi = `${BUSINESS_API}/show`;
        return this.http
            .post(communityMemberApi, fetchRewardsReq)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('fetchRewards')));
    }
};
BusinessMenuServiceService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], BusinessMenuServiceService);
exports.BusinessMenuServiceService = BusinessMenuServiceService;
//# sourceMappingURL=business-menu-service.service.js.map