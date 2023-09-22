"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NearbyFeaturedAdComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const account_type_enum_1 = require("../../../helpers/enum/account-type.enum");
const info_object_type_enum_1 = require("../../../helpers/enum/info-object-type.enum");
const measure_units_helper_1 = require("../../../helpers/measure-units.helper");
const ad_1 = require("../../../models/ad");
const business_1 = require("../../../models/business");
const map_extras_1 = require("../../map/map_extras/map_extras");
const app_launcher_1 = require("@capacitor/app-launcher");
const numbers_helper_1 = require("../../../helpers/numbers.helper");
const preferences_1 = require("@capacitor/preferences");
const PLACE_TO_EAT_AD_IMAGE = 'assets/images/def/places-to-eat/featured_banner_in_house.jpg';
const SHOPPING_AD_IMAGE = 'assets/images/def/shopping/featured_banner_in_house.jpg';
const EVENTS_AD_IMAGE = 'assets/images/def/events/featured_banner_in_house.jpg';
const FEATURED_BANNER_TIMER_INTERVAL = 16000;
let NearbyFeaturedAdComponent = class NearbyFeaturedAdComponent {
    constructor(adsService, deviceDetectorService) {
        this.adsService = adsService;
        this.deviceDetectorService = deviceDetectorService;
        this.business = new business_1.Business();
        this.ad = null;
        this.accountType = null;
        this.editMode = false;
        this.eventsClassification = null;
        this.displayAd = false;
        this.whiteIconSvg = 'assets/images/home_imgs/spotbie-white-icon.svg';
        this.distance = 0;
        this.totalRewards = 0;
        this.categoriesListFriendly = [];
        this.adIsOpen = false;
        this.communityMemberOpen = false;
        this.isMobile = false;
        this.currentCategoryList = [];
        this.categoryListForUi = null;
        this.adTypeWithId = false;
        this.adList = [];
        this.genericAdImage = PLACE_TO_EAT_AD_IMAGE;
        this.businessReady = false;
        this.switchAdInterval = false;
    }
    ngOnInit() {
        this.isMobile = this.deviceDetectorService.isMobile();
        this.getNearByFeatured();
    }
    ngOnDestroy() {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        clearInterval(this.switchAdInterval);
        this.switchAdInterval = false;
    }
    async getNearByFeatured() {
        let adId = null;
        let accountType;
        //Stop the service if there's a window on top of the ad component.
        const needleElement = document.getElementsByClassName('sb-closeButton');
        if (needleElement.length > 1) {
            //There's a componenet aside from the infoObjectWindow
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
            accountType = retAccType.value;
            switch (accountType) {
                case '1':
                    this.genericAdImage = PLACE_TO_EAT_AD_IMAGE;
                    break;
                case '2':
                    this.genericAdImage = SHOPPING_AD_IMAGE;
                    break;
                case '3':
                    this.genericAdImage = EVENTS_AD_IMAGE;
                    this.categories = this.eventsClassification;
                    break;
            }
        }
        else {
            accountType = (0, numbers_helper_1.getRandomInt)(1, 3).toString();
            switch (this.accountType) {
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
            this.ad = resp.ad;
            this.business = resp.business;
            this.businessReady = true;
            if (!this.editMode && this.business) {
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
                this.business.is_community_member = true;
                this.business.type_of_info_object = info_object_type_enum_1.InfoObjectType.SpotBieCommunity;
                this.totalRewards = resp.totalRewards;
                this.currentCategoryList.reduce((previousValue, currentValue, currentIndex, array) => {
                    if (resp.business.categories.indexOf(currentIndex) > -1) {
                        this.categoriesListFriendly.push(this.currentCategoryList[currentIndex]);
                    }
                    return currentValue;
                });
                this.distance = (0, measure_units_helper_1.getDistanceFromLatLngInMiles)(this.business.loc_x, this.business.loc_y, this.lat, this.lng);
            }
            else {
                this.distance = 5;
            }
            this.displayAd = true;
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
    getAdStyle() {
        if (this.adTypeWithId) {
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
        this.getNearByFeatured();
    }
    async openAd() {
        if (this.business !== null) {
            this.communityMemberOpen = true;
        }
        else {
            await app_launcher_1.AppLauncher.openUrl({ url: 'https://spotbie.com/business' });
        }
        return;
    }
    updateAdImage(image = '') {
        if (image !== '') {
            this.ad.images = image;
            this.genericAdImage = image;
        }
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
], NearbyFeaturedAdComponent.prototype, "business", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyFeaturedAdComponent.prototype, "ad", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyFeaturedAdComponent.prototype, "accountType", void 0);
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