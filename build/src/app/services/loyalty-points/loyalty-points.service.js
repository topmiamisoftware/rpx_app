"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyPointsService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
const error_helper_1 = require("../../helpers/error-helper");
const loyalty_points_actions_1 = require("../../spotbie/spotbie-logged-in/loyalty-points/loyalty-points.actions");
const spotbieGlobals = require("../../globals");
const LOYATLY_POINTS_API = spotbieGlobals.API + 'loyalty-points';
const LOYATLY_POINTS_TIER_API = spotbieGlobals.API + 'lp-tiers';
const REDEEMABLE_API = spotbieGlobals.API + 'redeemable';
let LoyaltyPointsService = class LoyaltyPointsService {
    constructor(http, store) {
        this.http = http;
        this.store = store;
        this.userLoyaltyPoints$ = this.store.select('loyaltyPoints');
        this.existingTiers = [];
    }
    getLedger(request) {
        const apiUrl = `${REDEEMABLE_API}/ledger?page=${request.page}`;
        return this.http
            .get(apiUrl, request)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getLedger')));
    }
    getBalanceList(request) {
        const apiUrl = `${REDEEMABLE_API}/balance-list?page=${request.page}`;
        return this.http
            .get(apiUrl, request)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getBalanceList')));
    }
    getRedeemed(request) {
        const apiUrl = `${REDEEMABLE_API}/lp-redeemed?page=${request.page}`;
        return this.http
            .get(apiUrl, request)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getRedeemed')));
    }
    getRewards(request) {
        const apiUrl = `${REDEEMABLE_API}/index?page=${request.page}`;
        return this.http
            .get(apiUrl, request)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getRewards')));
    }
    getLoyaltyPointBalance() {
        const apiUrl = `${LOYATLY_POINTS_API}/show`;
        this.http
            .post(apiUrl, null)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getLoyaltyPointBalance')))
            .subscribe(resp => {
            if (resp.success) {
                const loyaltyPointBalance = resp.loyalty_points;
                this.store.dispatch((0, loyalty_points_actions_1.setValue)({ loyaltyPointBalance }));
            }
        });
    }
    saveLoyaltyPoint(businessLoyaltyPointsObj) {
        const apiUrl = `${LOYATLY_POINTS_API}/store`;
        return this.http
            .post(apiUrl, businessLoyaltyPointsObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('saveLoyaltyPoint')));
    }
    addLoyaltyPoints(businessLoyaltyPointsObj, callback) {
        const apiUrl = `${REDEEMABLE_API}/redeem`;
        this.http
            .post(apiUrl, businessLoyaltyPointsObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('saveLoyaltyPoint')))
            .subscribe(resp => {
            if (resp.success) {
                const loyaltyPointBalance = resp.loyalty_points;
                this.store.dispatch((0, loyalty_points_actions_1.setValue)({ loyaltyPointBalance }));
            }
            callback(resp);
        });
    }
    getExistingTiers() {
        const apiUrl = `${LOYATLY_POINTS_TIER_API}/index`;
        return this.http.get(apiUrl).pipe((0, operators_1.tap)(existingTiers => {
            existingTiers.data.forEach(tier => {
                tier.entranceValue = tier.lp_entrance;
                this.existingTiers.push(tier);
            });
        }), (0, operators_1.catchError)((0, error_helper_1.handleError)('existingTiers')));
    }
};
LoyaltyPointsService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], LoyaltyPointsService);
exports.LoyaltyPointsService = LoyaltyPointsService;
//# sourceMappingURL=loyalty-points.service.js.map