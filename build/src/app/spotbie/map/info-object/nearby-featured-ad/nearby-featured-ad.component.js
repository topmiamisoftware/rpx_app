"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NearbyFeaturedAdComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const account_type_enum_1 = require("../../../../helpers/enum/account-type.enum");
const info_object_type_enum_1 = require("../../../../helpers/enum/info-object-type.enum");
const measure_units_helper_1 = require("../../../../helpers/measure-units.helper");
const ad_1 = require("../../../../models/ad");
const map_extras_1 = require("../../map_extras/map_extras");
const numbers_helper_1 = require("../../../../helpers/numbers.helper");
const rxjs_1 = require("rxjs");
const preferences_1 = require("@capacitor/preferences");
const PLACE_TO_EAT_AD_IMAGE = 'assets/images/def/places-to-eat/featured_banner_in_house.jpg';
const SHOPPING_AD_IMAGE = 'assets/images/def/shopping/featured_banner_in_house.jpg';
const EVENTS_AD_IMAGE = 'assets/images/def/events/featured_banner_in_house.jpg';
const FEATURED_BANNER_TIMER_INTERVAL = 16000;
let NearbyFeaturedAdComponent = class NearbyFeaturedAdComponent {
    set business(business) {
        this.business$.next(business);
    }
    set ad(ad) {
        this.ad$.next(ad);
    }
    set accountType(accType) {
        this.accountType$.next(accType);
    }
    constructor(adsService, deviceDetectorService, router, businessService) {
        this.adsService = adsService;
        this.deviceDetectorService = deviceDetectorService;
        this.router = router;
        this.businessService = businessService;
        this.editMode = false;
        this.eventsClassification = null;
        this.accountType$ = new rxjs_1.BehaviorSubject(null);
        this.ad$ = new rxjs_1.BehaviorSubject(null);
        this.displayAd = false;
        this.whiteIconSvg = 'assets/images/home_imgs/spotbie-white-icon.svg';
        this.distance = 0;
        this.totalRewards = 0;
        this.categoriesListFriendly = [];
        this.adIsOpen = false;
        this.rewardMenuOpen = false;
        this.isMobile = false;
        this.currentCategoryList = [];
        this.categoryListForUi = null;
        this.adTypeWithId = false;
        this.adList = [];
        this.genericAdImage = PLACE_TO_EAT_AD_IMAGE;
        this.business$ = new rxjs_1.BehaviorSubject(null);
        this.businessReady$ = new rxjs_1.BehaviorSubject(false);
        this.switchAdInterval = false;
    }
    async getNearByFeatured() {
        let adId = null;
        let accountType = null;
        const needleElement = document.getElementsByClassName('sb-closeButton');
        if (needleElement.length > 1) {
            return;
        }
        if (this.editMode) {
            if (!this.ad$.getValue()) {
                const ad = new ad_1.Ad();
                ad.id = 2;
                this.ad$.next(ad);
                adId = ad.id;
            }
            else {
                adId = this.ad$.getValue().id;
            }
            const retAccType = await preferences_1.Preferences.get({ key: 'spotbie_userType' });
            accountType = retAccType.value;
            switch (accountType) {
                case 1:
                    this.genericAdImage = PLACE_TO_EAT_AD_IMAGE;
                    break;
                case 2:
                    this.genericAdImage = SHOPPING_AD_IMAGE;
                    break;
                case 3:
                    this.genericAdImage = EVENTS_AD_IMAGE;
                    this.categories = this.eventsClassification;
                    break;
            }
        }
        else {
            accountType = (0, numbers_helper_1.getRandomInt)(1, 3).toString();
            switch (this.accountType$.getValue()) {
                case 1:
                    this.genericAdImage = PLACE_TO_EAT_AD_IMAGE;
                    break;
                case 2:
                    this.genericAdImage = SHOPPING_AD_IMAGE;
                    break;
                case 3:
                    this.genericAdImage = EVENTS_AD_IMAGE;
                    this.categories = this.eventsClassification;
                    break;
            }
        }
        const nearByFeaturedObj = {
            loc_x: this.lat,
            loc_y: this.lng,
            categories: this.categories,
            id: adId,
            account_type: accountType,
        };
        this.adsService.getNearByFeatured(nearByFeaturedObj).subscribe(resp => {
            this.getNearByFeaturedCallback(resp);
        });
    }
    async getNearByFeaturedCallback(resp) {
        if (resp.success) {
            this.ad$.next(resp.ad);
            const business = resp.business;
            if (!this.editMode && business) {
                switch (business.user_type) {
                    case account_type_enum_1.AllowedAccountTypes.PlaceToEat:
                        this.currentCategoryList = map_extras_1.FOOD_CATEGORIES;
                        break;
                    case account_type_enum_1.AllowedAccountTypes.Events:
                        this.currentCategoryList = map_extras_1.EVENT_CATEGORIES;
                        break;
                    case account_type_enum_1.AllowedAccountTypes.Shopping:
                        this.currentCategoryList = map_extras_1.SHOPPING_CATEGORIES;
                        break;
                }
                this.categoriesListFriendly = [];
                this.currentCategoryList.reduce((previousValue, currentValue, currentIndex, array) => {
                    if (resp.business.categories.indexOf(currentIndex) > -1) {
                        this.categoriesListFriendly.push(this.currentCategoryList[currentIndex]);
                    }
                    return currentValue;
                });
                business.is_community_member = true;
                business.type_of_info_object = info_object_type_enum_1.InfoObjectType.SpotBieCommunity;
                this.distance = (0, measure_units_helper_1.getDistanceFromLatLngInMiles)(business.loc_x, business.loc_y, this.lat, this.lng);
            }
            else {
                this.distance = 5;
            }
            this.displayAd = true;
            this.totalRewards = resp.totalRewards;
            this.businessReady$.next(true);
            this.business$.next(business);
            if (!this.switchAdInterval) {
                this.switchAdInterval = setInterval(() => {
                    if (!this.editMode) {
                        this.getNearByFeatured();
                    }
                }, FEATURED_BANNER_TIMER_INTERVAL);
            }
        }
        else {
            console.log('getNearByFeaturedCallback', resp);
        }
    }
    openAd() {
        window.open(`/business-menu/${this.business$.getValue().qr_code_link}`, '_blank');
    }
    ngOnInit() {
        this.isMobile = this.deviceDetectorService.isMobile();
        this.getNearByFeatured();
    }
    ngOnDestroy() {
        clearInterval(this.switchAdInterval);
        this.switchAdInterval = false;
    }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyFeaturedAdComponent.prototype, "lat", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyFeaturedAdComponent.prototype, "lng", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyFeaturedAdComponent.prototype, "business", null);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyFeaturedAdComponent.prototype, "ad", null);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyFeaturedAdComponent.prototype, "accountType", null);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyFeaturedAdComponent.prototype, "editMode", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyFeaturedAdComponent.prototype, "categories", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyFeaturedAdComponent.prototype, "eventsClassification", void 0);
NearbyFeaturedAdComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-nearby-featured-ad',
        templateUrl: './nearby-featured-ad.component.html',
        styleUrls: ['./nearby-featured-ad.component.css'],
    })
], NearbyFeaturedAdComponent);
exports.NearbyFeaturedAdComponent = NearbyFeaturedAdComponent;
//# sourceMappingURL=nearby-featured-ad.component.js.map