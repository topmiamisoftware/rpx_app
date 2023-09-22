"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BottomAdBannerComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const account_type_enum_1 = require("../../../helpers/enum/account-type.enum");
const info_object_type_enum_1 = require("../../../helpers/enum/info-object-type.enum");
const measure_units_helper_1 = require("../../../helpers/measure-units.helper");
const ad_1 = require("../../../models/ad");
const business_1 = require("../../../models/business");
const map_extras_1 = require("../../map/map_extras/map_extras");
const numbers_helper_1 = require("../../../helpers/numbers.helper");
const rxjs_1 = require("rxjs");
const preferences_1 = require("@capacitor/preferences");
const PLACE_TO_EAT_AD_IMAGE = 'assets/images/def/places-to-eat/footer_banner_in_house.jpg';
const PLACE_TO_EAT_AD_IMAGE_MOBILE = 'assets/images/def/places-to-eat/featured_banner_in_house.jpg';
const SHOPPING_AD_IMAGE = 'assets/images/def/shopping/footer_banner_in_house.jpg';
const SHOPPING_AD_IMAGE_MOBILE = 'assets/images/def/shopping/featured_banner_in_house.jpg';
const EVENTS_AD_IMAGE = 'assets/images/def/events/footer_banner_in_house.jpg';
const EVENTS_AD_IMAGE_MOBILE = 'assets/images/def/events/featured_banner_in_house.jpg';
const BOTTOM_BANNER_TIMER_INTERVAL = 16000;
let BottomAdBannerComponent = class BottomAdBannerComponent {
    constructor(adsService, deviceDetectorService, loyaltyPointsService) {
        this.adsService = adsService;
        this.deviceDetectorService = deviceDetectorService;
        this.loyaltyPointsService = loyaltyPointsService;
        this.business = new business_1.Business();
        this.ad = null;
        this.accountType = null;
        this.editMode = false;
        this.eventsClassification = null;
        this.isMobile = false;
        this.isDesktop = false;
        this.displayAd$ = new rxjs_1.BehaviorSubject(false);
        this.distance = 0;
        this.totalRewards = 0;
        this.categoriesListFriendly = [];
        this.communityMemberOpen = false;
        this.currentCategoryList = [];
        this.categoryListForUi = null;
        this.genericAdImage = PLACE_TO_EAT_AD_IMAGE;
        this.genericAdImageMobile = PLACE_TO_EAT_AD_IMAGE_MOBILE;
        this.switchAdInterval = false;
        this.loyaltyPointsService.userLoyaltyPoints$.subscribe(loyaltyPointBalance => {
            this.loyaltyPointBalance = loyaltyPointBalance;
        });
    }
    async getBottomHeader() {
        let adId = null;
        let accountType;
        // Stop the service if there's a window on top of the ad component.
        const needleElement = document.getElementsByClassName('sb-closeButton');
        if (needleElement.length > 1) {
            // There's a component on top of the bottom header.
            // I know this a rudimentary way for doing this but yeah.
            return;
        }
        if (this.editMode) {
            if (!this.ad) {
                this.ad = new ad_1.Ad();
                this.ad.id = 2;
                adId = this.ad.id;
            }
            else {
                adId = this.ad.id;
            }
            const retAccType = await preferences_1.Preferences.get({ key: 'spotbie_userType' });
            const accType = retAccType.value;
            accountType = parseInt(accType, 10);
            switch (accountType) {
                case 1:
                    this.genericAdImage = PLACE_TO_EAT_AD_IMAGE;
                    this.genericAdImageMobile = PLACE_TO_EAT_AD_IMAGE_MOBILE;
                    break;
                case 2:
                    this.genericAdImage = SHOPPING_AD_IMAGE;
                    this.genericAdImageMobile = SHOPPING_AD_IMAGE_MOBILE;
                    break;
                case 3:
                    this.genericAdImage = EVENTS_AD_IMAGE;
                    this.genericAdImageMobile = EVENTS_AD_IMAGE_MOBILE;
                    this.categories = this.eventsClassification;
                    break;
            }
        }
        else {
            accountType = this.accountType ? this.accountType : (0, numbers_helper_1.getRandomInt)(1, 3);
            switch (accountType) {
                case 'food':
                    accountType = 1;
                    this.genericAdImage = PLACE_TO_EAT_AD_IMAGE;
                    this.genericAdImageMobile = PLACE_TO_EAT_AD_IMAGE_MOBILE;
                    break;
                case 'shopping':
                    accountType = 2;
                    this.genericAdImage = SHOPPING_AD_IMAGE;
                    this.genericAdImageMobile = SHOPPING_AD_IMAGE_MOBILE;
                    break;
                case 'events':
                    accountType = 3;
                    this.genericAdImage = EVENTS_AD_IMAGE;
                    this.genericAdImageMobile = EVENTS_AD_IMAGE_MOBILE;
                    this.categories = this.eventsClassification;
                    break;
            }
        }
        const searchObjSb = {
            loc_x: this.lat,
            loc_y: this.lng,
            categories: this.categories,
            id: adId,
            account_type: accountType,
        };
        // Retrieve the SpotBie Ads
        this.adsService.getBottomHeader(searchObjSb).subscribe(resp => {
            this.getBottomHeaderCb(resp);
        });
    }
    getAdStyle() {
        if (this.editMode) {
            return {
                position: 'relative',
                margin: '0 auto',
                right: '0',
            };
        }
    }
    getAdWrapperClass() {
        if (!this.isMobile)
            return 'spotbie-ad-wrapper-header';
        if (this.isMobile)
            return 'spotbie-ad-wrapper-header sb-mobileAdWrapper';
    }
    async getBottomHeaderCb(resp) {
        if (resp.success) {
            this.ad = resp.ad;
            this.business = resp.business;
            if (!this.editMode && resp.business) {
                switch (this.business.user_type) {
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
                    if (resp.business.categories.indexOf(currentIndex) > -1)
                        this.categoriesListFriendly.push(this.currentCategoryList[currentIndex]);
                    return currentValue;
                });
                this.business.is_community_member = true;
                this.business.type_of_info_object = info_object_type_enum_1.InfoObjectType.SpotBieCommunity;
                if (!this.editMode) {
                    this.distance = (0, measure_units_helper_1.getDistanceFromLatLngInMiles)(this.business.loc_x, this.business.loc_y, this.lat, this.lng);
                }
                else {
                    this.distance = 5;
                }
            }
            this.totalRewards = resp.totalRewards;
            this.displayAd$.next(true);
        }
        else {
            console.log('getSingleAdListCb', resp);
            if (!this.switchAdInterval) {
                this.switchAdInterval = setInterval(() => {
                    if (!this.editMode)
                        this.getBottomHeader();
                }, BOTTOM_BANNER_TIMER_INTERVAL);
            }
        }
    }
    spotbieAdWrapperStyles() {
        if (this.editMode)
            return { 'margin-top': '45px' };
    }
    openAd() {
        if (this.business) {
            this.communityMemberOpen = true;
        }
        else {
            window.open('/business', '_blank');
        }
        // this.router.navigate([`/business-menu/${this.business.qr_code_link}`])
    }
    closeRewardMenu() {
        this.communityMemberOpen = false;
    }
    switchAd() {
        this.categoriesListFriendly = [];
        this.categoryListForUi = null;
        this.getBottomHeader();
    }
    clickGoToSponsored() {
        window.open('/business', '_blank');
    }
    updateAdImage(image = '') {
        if (image) {
            this.ad.images = image;
            this.genericAdImage = image;
        }
    }
    updateAdImageMobile(image) {
        if (image) {
            this.ad.images_mobile = image;
            this.genericAdImageMobile = image;
        }
    }
    ngOnInit() {
        this.isDesktop = this.deviceDetectorService.isDesktop();
        if (!this.isMobile) {
            this.isMobile =
                this.deviceDetectorService.isMobile() ||
                    this.deviceDetectorService.isTablet();
        }
        else {
            this.isDesktop = false;
        }
        this.getBottomHeader();
    }
    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        clearInterval(this.switchAdInterval);
        this.switchAdInterval = false;
    }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], BottomAdBannerComponent.prototype, "lat", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], BottomAdBannerComponent.prototype, "lng", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], BottomAdBannerComponent.prototype, "business", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], BottomAdBannerComponent.prototype, "ad", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], BottomAdBannerComponent.prototype, "accountType", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], BottomAdBannerComponent.prototype, "categories", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], BottomAdBannerComponent.prototype, "editMode", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], BottomAdBannerComponent.prototype, "eventsClassification", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], BottomAdBannerComponent.prototype, "isMobile", void 0);
BottomAdBannerComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-bottom-ad-banner',
        templateUrl: './bottom-ad-banner.component.html',
        styleUrls: ['./bottom-ad-banner.component.css'],
    })
], BottomAdBannerComponent);
exports.BottomAdBannerComponent = BottomAdBannerComponent;
//# sourceMappingURL=bottom-ad-banner.component.js.map