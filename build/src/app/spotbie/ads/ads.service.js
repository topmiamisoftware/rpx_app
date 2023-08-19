"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
const error_helper_1 = require("../../helpers/error-helper");
const spotbieGlobals = require("../../globals");
const ADS_API = spotbieGlobals.API + 'in-house';
let AdsService = class AdsService {
    constructor(http) {
        this.http = http;
    }
    getHeaderBanner(headerBannerReqObj) {
        const getAd = `${ADS_API}/header-banner`;
        return this.http
            .post(getAd, headerBannerReqObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getHeaderBanner')));
    }
    getNearByFeatured(nearByFeaturedReqObj) {
        const getAd = `${ADS_API}/featured-ad-list`;
        return this.http
            .post(getAd, nearByFeaturedReqObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getNearByFeatured')));
    }
    getAds() {
        const getAdsApi = `${ADS_API}/index`;
        return this.http
            .post(getAdsApi, null)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getAds')));
    }
    getAdByUUID(searchObjSb) {
        const getAdsApi = `${ADS_API}/get-by-uuid`;
        return this.http
            .post(getAdsApi, searchObjSb)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getAdByUUID')));
    }
    getBottomHeader(searchObjSb) {
        const getAdsApi = `${ADS_API}/footer-banner`;
        return this.http
            .post(getAdsApi, searchObjSb)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getBottomHeader')));
    }
};
AdsService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], AdsService);
exports.AdsService = AdsService;
//# sourceMappingURL=ads.service.js.map