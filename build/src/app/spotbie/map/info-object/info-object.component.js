"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoObjectComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const date_format_pipe_1 = require("../../../pipes/date-format.pipe");
const info_object_helper_1 = require("../../../helpers/info-object-helper");
const spotbie_1 = require("../../../constants/spotbie");
const environment_1 = require("../../../../environments/environment");
const info_object_type_enum_1 = require("../../../helpers/enum/info-object-type.enum");
const rxjs_1 = require("rxjs");
const app_launcher_1 = require("@capacitor/app-launcher");
const preferences_1 = require("@capacitor/preferences");
const share_1 = require("@capacitor/share");
const YELP_BUSINESS_DETAILS_API = 'https://api.yelp.com/v3/businesses/';
const SPOTBIE_META_DESCRIPTION = spotbie_1.spotbieMetaDescription;
const SPOTBIE_META_TITLE = spotbie_1.spotbieMetaTitle;
const SPOTBIE_META_IMAGE = spotbie_1.spotbieMetaImage;
let InfoObjectComponent = class InfoObjectComponent {
    set info_object(infoObject) {
        this.accountType = infoObject.user_type;
        this.infoObject$.next(infoObject);
    }
    constructor(infoObjectService, router, activatedRoute, spotbieMetaService) {
        this.infoObjectService = infoObjectService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.spotbieMetaService = spotbieMetaService;
        this.fullScreenMode = false;
        this.lat = null;
        this.lng = null;
        this.eventsClassification = null;
        this.closeWindow = new core_1.EventEmitter();
        this.removeFavoriteEvent = new core_1.EventEmitter();
        this.loading$ = new rxjs_1.BehaviorSubject(false);
        this.rewardMenuUp$ = new rxjs_1.BehaviorSubject(false);
        this.infoObject$ = new rxjs_1.BehaviorSubject(null);
        this.isLoggedIn$ = new rxjs_1.BehaviorSubject(null);
        this.objectCategories = '';
        this.eInfoObjectType = info_object_type_enum_1.InfoObjectType;
    }
    getFullScreenModeClass() {
        if (this.fullScreenMode)
            return 'fullScreenMode';
        else
            return '';
    }
    closeWindowX() {
        if (this.router.url.indexOf('event') > -1 ||
            this.router.url.indexOf('place-to-eat') > -1 ||
            this.router.url.indexOf('shopping') > -1 ||
            this.router.url.indexOf('community') > -1) {
            this.router.navigate(['/home']);
        }
        else {
            this.closeWindow.emit(null);
            this.spotbieMetaService.setTitle(SPOTBIE_META_TITLE);
            this.spotbieMetaService.setDescription(SPOTBIE_META_DESCRIPTION);
            this.spotbieMetaService.setImage(SPOTBIE_META_IMAGE);
        }
    }
    pullInfoObject() {
        console.log('pullInfoObject');
        if (this.router.url.indexOf('event') > -1) {
            const infoObjectId = this.activatedRoute.snapshot.paramMap.get('id');
            this.urlApi = `id=${infoObjectId}`;
        }
        const infoObjToPull = {
            config_url: this.urlApi,
        };
        if (this.router.url.indexOf('event') > -1) {
            this.infoObjectService.pullEventObject(infoObjToPull).subscribe(resp => {
                this.getEventCallback(resp);
            });
        }
        else {
            this.infoObjectService.pullInfoObject(infoObjToPull).subscribe(resp => {
                this.pullInfoObjectCallback(resp);
            });
        }
    }
    pullInfoObjectCallback(httpResponse) {
        console.log('httpResponse', httpResponse);
        console.log('this.infoObjectCategory;', this.infoObjectCategory);
        if (httpResponse.success) {
            const infoObject = httpResponse.data;
            infoObject.type_of_info_object_category = this.infoObjectCategory;
            if (infoObject.is_community_member) {
                this.infoObjectImageUrl =
                    'assets/images/home_imgs/spotbie-green-icon.svg';
            }
            else {
                this.infoObjectImageUrl =
                    'assets/images/home_imgs/spotbie-white-icon.svg';
            }
            if (this.router.url.indexOf('place-to-eat') > -1 ||
                infoObject.type_of_info_object_category === 1) {
                infoObject.type_of_info_object = info_object_type_enum_1.InfoObjectType.Yelp;
                infoObject.type_of_info_object_category = 1;
                this.infoObjectLink = `${environment_1.environment.baseUrl}place-to-eat/${infoObject.alias}/${infoObject.id}`;
            }
            if (this.router.url.indexOf('shopping') > -1 ||
                infoObject.type_of_info_object_category === 2) {
                infoObject.type_of_info_object = info_object_type_enum_1.InfoObjectType.Yelp;
                infoObject.type_of_info_object_category = 2;
                this.infoObjectLink = `${environment_1.environment.baseUrl}shopping/${infoObject.alias}/${infoObject.id}`;
            }
            if (this.router.url.indexOf('events') > -1 ||
                infoObject.type_of_info_object_category === 3) {
                infoObject.type_of_info_object = info_object_type_enum_1.InfoObjectType.TicketMaster;
                infoObject.type_of_info_object_category = 3;
                this.infoObjectLink = `${environment_1.environment.baseUrl}event/${infoObject.alias}/${infoObject.id}`;
            }
            if (infoObject.is_community_member) {
                infoObject.type_of_info_object = info_object_type_enum_1.InfoObjectType.SpotBieCommunity;
                infoObject.image_url = infoObject.photo;
                this.infoObjectLink = `${environment_1.environment.baseUrl}${infoObject.name}/${infoObject.id}`;
            }
            if (infoObject.hours) {
                infoObject.hours.forEach(hours => {
                    if (hours.hours_type === 'REGULAR') {
                        infoObject.isOpenNow = hours.is_open_now;
                    }
                });
            }
            if (!infoObject.is_community_member) {
                this.objectDisplayAddress = `${infoObject.location.display_address[0]}, ${infoObject.location.display_address[1]}`;
            }
            else {
                this.objectDisplayAddress = infoObject.address;
            }
            infoObject.categories.forEach(category => {
                this.objectCategories = `${this.objectCategories}, ${category.title}`;
            });
            this.objectCategories = this.objectCategories.substring(2, this.objectCategories.length);
            switch (infoObject.type_of_info_object_category) {
                case 1:
                    this.infoObjectTitle = `${infoObject.name} - ${this.objectCategories} - ${this.objectDisplayAddress}`;
                    this.infoObjectDescription = `Let's go eat at ${infoObject.name}. I know you'll enjoy some of these categories ${this.objectCategories}. They are located at ${this.objectDisplayAddress}.`;
                    break;
                case 2:
                    this.infoObjectTitle = `${infoObject.name} - ${this.objectCategories} - ${this.objectDisplayAddress}`;
                    this.infoObjectDescription = `I really recommend you go shopping at ${infoObject.name}!`;
                    break;
            }
            infoObject.rating_image = (0, info_object_helper_1.setYelpRatingImage)(infoObject.rating);
            this.spotbieMetaService.setTitle(this.infoObjectTitle);
            this.spotbieMetaService.setDescription(this.infoObjectDescription);
            this.spotbieMetaService.setImage(this.infoObjectImageUrl);
            this.infoObject$.next(infoObject);
            this.loading$.next(false);
        }
        else {
            console.log('pullInfoObjectCallback', httpResponse);
        }
    }
    async openWithGoogleMaps() {
        const confirmNav = confirm("We will try to open and navigate on your device's default navigation app.");
        let displayAddress = '';
        this.infoObject$.getValue().location.display_address.forEach(element => {
            displayAddress = displayAddress + ' ' + element;
        });
        if (confirmNav) {
            await app_launcher_1.AppLauncher.openUrl({
                url: `http://www.google.com/maps/place/${encodeURI(displayAddress)}`,
            });
        }
        return;
    }
    share() {
        console.log('infoObjectTitle', this.infoObjectTitle);
        console.log('infoObjectDescription', this.infoObjectDescription);
        console.log('infoObjectLink', this.infoObjectLink);
        share_1.Share.share({
            title: this.infoObjectTitle,
            text: this.infoObjectDescription,
            url: this.infoObjectLink,
            dialogTitle: 'Share Spot...',
        });
    }
    getIconStyle() {
        if (this.infoObject$.getValue().type_of_info_object ===
            info_object_type_enum_1.InfoObjectType.SpotBieCommunity) {
            return { color: 'white' };
        }
        else {
            return { color: '#333' };
        }
    }
    async goToTicket() {
        await app_launcher_1.AppLauncher.openUrl({ url: this.infoObject$.getValue().url });
        return;
    }
    getTitleStyling() {
        let className = 'sb-titleGrey text-uppercase';
        if (this.infoObject$.getValue().is_community_member) {
            className = 'spotbie-text-gradient sb-titleGreen text-uppercase';
        }
        return className;
    }
    getCloseButtonStyling() {
        let style = { color: 'white' };
        if (!this.infoObject$.getValue().is_community_member) {
            style = { color: '#332f3e' };
        }
        return style;
    }
    getOverlayWindowStyling() {
        let className = 'spotbie-overlay-window infoObjectWindow has-header';
        if (this.infoObject$.getValue().is_community_member) {
            className = 'spotbie-overlay-window communityMemberWindow has-header';
        }
        return className;
    }
    getFontClasses() {
        let className = 'text-uppercase';
        if (this.infoObject$.getValue().is_community_member) {
            className = 'spotbie-text-gradient text-uppercase';
        }
        return className;
    }
    getEventCallback(httpResponse) {
        const eventObject = httpResponse.data._embedded.events[0] ?? undefined;
        if (httpResponse.success && eventObject) {
            eventObject.coordinates = {
                latitude: '',
                longitude: '',
            };
            eventObject.coordinates.latitude = parseFloat(eventObject._embedded.venues[0].location.latitude);
            eventObject.coordinates.longitude = parseFloat(eventObject._embedded.venues[0].location.longitude);
            eventObject.icon = eventObject.images[0].url;
            eventObject.image_url = eventObject.images[8].url;
            eventObject.type_of_info_object = 'ticketmaster_event';
            const datetObj = new Date(eventObject.dates.start.localDate);
            const timeDate = new date_format_pipe_1.DateFormatPipe().transform(datetObj);
            const timeHr = new date_format_pipe_1.TimeFormatPipe().transform(eventObject.dates.start.localTime);
            eventObject.dates.start.spotbieDate = timeDate;
            eventObject.dates.start.spotbieHour = timeHr;
            this.infoObject$.next(eventObject);
            this.setEventMetaData();
        }
        else {
            console.log('getEventsSearchCallback Error: ', httpResponse);
        }
        this.loading$.next(false);
        return;
    }
    setEventMetaData() {
        const infoObject = this.infoObject$.getValue();
        const alias = infoObject.name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[-]+/g, '-')
            .replace(/[^\w-]+/g, '');
        const title = `${infoObject.name} at ${infoObject._embedded.venues[0].name}`;
        if (infoObject.is_community_member) {
            this.infoObjectImageUrl = `${environment_1.environment.baseUrl}${infoObject.type_of_info_object_category}/${infoObject.id}`;
        }
        else {
            this.infoObjectLink = `${environment_1.environment.baseUrl}event/${alias}/${infoObject.id}`;
        }
        this.infoObjectDescription = `Hey! Let's go to ${infoObject.name} together. It's at ${infoObject._embedded.venues[0].name} located in ${infoObject._embedded.venues[0].address.line1}, ${infoObject._embedded.venues[0].city.name} ${infoObject._embedded.venues[0].postalCode}. Prices range from $${infoObject.priceRanges[0].min} to $${infoObject.priceRanges[0].min}`;
        this.infoObjectTitle = title;
        this.spotbieMetaService.setTitle(title);
        this.spotbieMetaService.setDescription(this.infoObjectDescription);
        this.spotbieMetaService.setImage(infoObject.image_url);
        return;
    }
    async visitInfoObjectPage() {
        const infoObject = this.infoObject$.getValue();
        if (infoObject.type_of_info_object === info_object_type_enum_1.InfoObjectType.Yelp) {
            await app_launcher_1.AppLauncher.openUrl({ url: `${infoObject.url}` });
        }
        else if (infoObject.type_of_info_object === info_object_type_enum_1.InfoObjectType.TicketMaster) {
            this.goToTicket();
        }
        return;
    }
    clickGoToSponsored() {
        app_launcher_1.AppLauncher.openUrl({ url: 'https://spotbie.com/business' });
    }
    async ngAfterViewInit() {
        // I'm sure there's a better way to do this but I don't have time right now.
        const closeButton = document.getElementById('sb-closeButtonInfoObject');
        const isLoggedInRet = await preferences_1.Preferences.get({ key: 'spotbie_loggedIn' });
        this.isLoggedIn$.next(isLoggedInRet.value);
        const p = this.isLoggedIn$.getValue() === '0' || !this.isLoggedIn$.getValue()
            ? document.getElementById('ionToolbarLoggedOut').offsetHeight
            : document.getElementById('ionToolbarLoggedIn').offsetHeight;
        closeButton.style.top = p + 'px';
    }
    ngOnInit() {
        this.loading$.next(true);
        const infoObject = this.infoObject$.getValue();
        if (infoObject) {
            this.infoObjectCategory = infoObject.type_of_info_object_category;
            switch (infoObject.type_of_info_object) {
                case info_object_type_enum_1.InfoObjectType.Yelp:
                    this.urlApi = YELP_BUSINESS_DETAILS_API + infoObject.id;
                    break;
                case info_object_type_enum_1.InfoObjectType.TicketMaster:
                    this.loading$.next(false);
                    return;
                case info_object_type_enum_1.InfoObjectType.SpotBieCommunity:
                    this.rewardMenuUp$.next(true);
                    if (infoObject.user_type === 1 ||
                        infoObject.user_type === 2 ||
                        infoObject.user_type === 3) {
                        this.infoObjectLink = `${environment_1.environment.baseUrl}community/${infoObject.qr_code_link}`;
                        switch (infoObject.user_type) {
                            case 1:
                                this.infoObjectTitle = `${infoObject.name} - ${infoObject.cleanCategories} - ${infoObject.address}`;
                                this.infoObjectDescription = `Let's go eat at ${infoObject.name}. I know you'll enjoy some of these categories ${this.infoObjectCategory}. They are located at ${this.objectDisplayAddress}.`;
                                break;
                            case 2:
                                this.infoObjectTitle = `${infoObject.name} - ${infoObject.cleanCategories} - ${infoObject.address}`;
                                this.infoObjectDescription = `I really recommend you go shopping at ${infoObject.name}!`;
                                break;
                            case 3:
                                this.infoObjectTitle = `${infoObject.name} - ${infoObject.cleanCategories} - ${infoObject.address}`;
                                this.infoObjectDescription = `Let's go to ${infoObject.name}!`;
                                break;
                        }
                    }
                    this.loading$.next(false);
                    return;
            }
        }
        else {
            if (this.router.url.indexOf('shopping') > -1 ||
                this.router.url.indexOf('place-to-eat') > -1 ||
                this.router.url.indexOf('events') > -1) {
                const infoObjectId = this.activatedRoute.snapshot.paramMap.get('id');
                this.urlApi = YELP_BUSINESS_DETAILS_API + infoObjectId;
            }
        }
        this.pullInfoObject();
    }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], InfoObjectComponent.prototype, "info_object", null);
tslib_1.__decorate([
    (0, core_1.Input)()
], InfoObjectComponent.prototype, "ad", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], InfoObjectComponent.prototype, "fullScreenMode", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], InfoObjectComponent.prototype, "lat", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], InfoObjectComponent.prototype, "lng", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], InfoObjectComponent.prototype, "accountType", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], InfoObjectComponent.prototype, "eventsClassification", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], InfoObjectComponent.prototype, "categories", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], InfoObjectComponent.prototype, "closeWindow", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], InfoObjectComponent.prototype, "removeFavoriteEvent", void 0);
InfoObjectComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-info-object',
        templateUrl: './info-object.component.html',
        styleUrls: ['./info-object.component.css'],
    })
], InfoObjectComponent);
exports.InfoObjectComponent = InfoObjectComponent;
//# sourceMappingURL=info-object.component.js.map