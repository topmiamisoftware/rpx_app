"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderAdBannerComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const business_1 = require("../../../models/business");
const measure_units_helper_1 = require("../../../helpers/measure-units.helper");
const ad_1 = require("../../../models/ad");
const map_extras_1 = require("../../map/map_extras/map_extras");
const account_type_enum_1 = require("../../../helpers/enum/account-type.enum");
const info_object_type_enum_1 = require("../../../helpers/enum/info-object-type.enum");
const app_launcher_1 = require("@capacitor/app-launcher");
const rxjs_1 = require("rxjs");
const preferences_1 = require("@capacitor/preferences");
const PLACE_TO_EAT_AD_IMAGE = 'assets/images/def/places-to-eat/header_banner_in_house.jpg';
const PLACE_TO_EAT_AD_IMAGE_MOBILE = 'assets/images/def/places-to-eat/featured_banner_in_house.jpg';
const SHOPPING_AD_IMAGE = 'assets/images/def/shopping/header_banner_in_house.jpg';
const SHOPPING_AD_IMAGE_MOBILE = 'assets/images/def/shopping/featured_banner_in_house.jpg';
const EVENTS_AD_IMAGE = 'assets/images/def/events/header_banner_in_house.jpg';
const EVENTS_AD_IMAGE_MOBILE = 'assets/images/def/events/featured_banner_in_house.jpg';
const HEADER_TIMER_INTERVAL = 16000;
let HeaderAdBannerComponent = class HeaderAdBannerComponent {
    constructor(adsService, deviceDetectorService) {
        this.adsService = adsService;
        this.deviceDetectorService = deviceDetectorService;
        this.business = new business_1.Business();
        this.ad = null;
        this.accountType = null;
        this.editMode = false;
        this.eventsClassification = null;
        this.isMobile = false;
        this.isDesktop = false;
        this.displayAd$ = new rxjs_1.BehaviorSubject(false);
        this.whiteIconSvg = 'assets/images/home_imgs/spotbie-white-icon.svg';
        this.distance = 0;
        this.totalRewards = 0;
        this.categoriesListFriendly = [];
        this.adIsOpen = false;
        this.communityMemberOpen = false;
        this.currentCategoryList = [];
        this.categoryListForUi = null;
        this.adTypeWithId = false;
        this.genericAdImage = PLACE_TO_EAT_AD_IMAGE;
        this.genericAdImageMobile = PLACE_TO_EAT_AD_IMAGE_MOBILE;
        this.switchAdInterval = false;
    }
    async getHeaderBanner() {
        let adId = null;
        let accountType;
        // Stop the service if there's a window on top of the ad component.
        const needleElement = document.getElementsByClassName('sb-closeButton');
        if (needleElement.length > 0) {
            // There's a componenet on top of the bottom header.
            return; //bounce this request
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
            const accountType = parseInt(retAccType.value);
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
            switch (this.accountType) {
                case 1:
                    accountType = 1;
                    this.genericAdImage = PLACE_TO_EAT_AD_IMAGE;
                    this.genericAdImageMobile = PLACE_TO_EAT_AD_IMAGE_MOBILE;
                    break;
                case 2:
                    accountType = 2;
                    this.genericAdImage = SHOPPING_AD_IMAGE;
                    this.genericAdImageMobile = SHOPPING_AD_IMAGE_MOBILE;
                    break;
                case 3:
                    accountType = 3;
                    this.genericAdImage = EVENTS_AD_IMAGE;
                    this.genericAdImageMobile = EVENTS_AD_IMAGE_MOBILE;
                    this.categories = this.eventsClassification;
                    break;
            }
        }
        const headerBannerReqObj = {
            loc_x: this.lat,
            loc_y: this.lng,
            categories: this.categories,
            id: adId,
            account_type: accountType,
        };
        // Retrieve the SpotBie Ads
        this.adsService.getHeaderBanner(headerBannerReqObj).subscribe(resp => {
            this.getHeaderBannerAdCallback(resp);
        });
    }
    async getHeaderBannerAdCallback(resp) {
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
                    if (resp.business.categories.indexOf(currentIndex) > -1) {
                        this.categoriesListFriendly.push(this.currentCategoryList[currentIndex]);
                    }
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
            this.displayAd$.next(true);
            this.totalRewards = resp.totalRewards;
        }
        else {
            console.log('getHeaderBannerAdCallback', resp);
        }
        if (!this.switchAdInterval) {
            this.switchAdInterval = setInterval(() => {
                if (!this.editMode) {
                    this.getHeaderBanner();
                }
            }, HEADER_TIMER_INTERVAL);
        }
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
    closeRewardMenu() {
        this.communityMemberOpen = false;
    }
    clickGoToSponsored() {
        window.open('/business', '_blank');
    }
    switchAd() {
        this.categoriesListFriendly = [];
        this.categoryListForUi = null;
        this.getHeaderBanner();
    }
    async openAd() {
        if (this.business) {
            this.communityMemberOpen = true;
        }
        else {
            await app_launcher_1.AppLauncher.openUrl({ url: 'https://spotbie.com/business' });
        }
        return;
    }
    updateAdImage(image = '') {
        if (image) {
            this.ad.images = image;
            this.genericAdImage = image;
        }
    }
    updateAdImageMobile(image_mobile) {
        if (image_mobile) {
            this.ad.images_mobile = image_mobile;
            this.genericAdImageMobile = image_mobile;
        }
    }
    getAdWrapperClass() {
        if (!this.isMobile) {
            return 'spotbie-ad-wrapper-header';
        }
        if (this.isMobile) {
            return 'spotbie-ad-wrapper-header sb-mobileAdWrapper';
        }
    }
    ngOnInit() { }
    ngAfterViewInit() {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this.isDesktop = this.deviceDetectorService.isDesktop();
        if (!this.isMobile) {
            this.isMobile =
                this.deviceDetectorService.isMobile() ||
                    this.deviceDetectorService.isTablet();
        }
        this.getHeaderBanner();
    }
    ngOnDestroy() {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        clearInterval(this.switchAdInterval);
        this.switchAdInterval = false;
    }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], HeaderAdBannerComponent.prototype, "lat", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], HeaderAdBannerComponent.prototype, "lng", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], HeaderAdBannerComponent.prototype, "business", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], HeaderAdBannerComponent.prototype, "ad", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], HeaderAdBannerComponent.prototype, "accountType", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], HeaderAdBannerComponent.prototype, "categories", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], HeaderAdBannerComponent.prototype, "editMode", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], HeaderAdBannerComponent.prototype, "eventsClassification", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], HeaderAdBannerComponent.prototype, "isMobile", void 0);
HeaderAdBannerComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-header-ad-banner',
        templateUrl: './header-ad-banner.component.html',
        styleUrls: ['./header-ad-banner.component.css'],
    })
], HeaderAdBannerComponent);
exports.HeaderAdBannerComponent = HeaderAdBannerComponent;
//# sourceMappingURL=header-ad-banner.component.js.map