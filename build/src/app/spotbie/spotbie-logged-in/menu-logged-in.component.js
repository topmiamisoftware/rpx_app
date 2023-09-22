"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLoggedInComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const account_type_enum_1 = require("../../helpers/enum/account-type.enum");
const logout_callback_1 = require("../../helpers/logout-callback");
const rxjs_1 = require("rxjs");
const preferences_1 = require("@capacitor/preferences");
let MenuLoggedInComponent = class MenuLoggedInComponent {
    constructor(userAuthService, deviceService, loyaltyPointsService, menuCtrl) {
        this.userAuthService = userAuthService;
        this.deviceService = deviceService;
        this.loyaltyPointsService = loyaltyPointsService;
        this.menuCtrl = menuCtrl;
        this.foodWindow = { open: false };
        this.mapApp$ = new rxjs_1.BehaviorSubject(false);
        this.settingsWindow$ = new rxjs_1.BehaviorSubject(false);
        this.userLoyaltyPoints$ = this.loyaltyPointsService.userLoyaltyPoints$;
        this.userName = null;
        this.qrCode = false;
        this.business = false;
        this.eventMenuOpen = false;
        this.isMobile = this.deviceService.isMobile();
        this.isDesktop = this.deviceService.isDesktop();
        this.isTablet = this.deviceService.isTablet();
        this.init();
    }
    async init() {
        const retAccType = await preferences_1.Preferences.get({ key: 'spotbie_userType' });
        this.userType = parseInt(retAccType.value);
        if (this.userType === account_type_enum_1.AllowedAccountTypes.Personal) {
            this.business = false;
        }
        else {
            this.business = true;
        }
        const retAccLogin = await preferences_1.Preferences.get({ key: 'spotbie_userLogin' });
        this.userName = retAccLogin.value;
        this.getLoyaltyPointBalance();
    }
    toggleLoyaltyPoints() {
        this.spotbieMap.goToLp();
    }
    toggleQRScanner() {
        this.spotbieMap.goToQrCode();
    }
    spawnCategories(category) {
        this.menuCtrl.close('logged-in-menu');
        this.slideMenu();
        this.spotbieMap.spawnCategories(category);
    }
    home() {
        this.menuCtrl.close('logged-in-menu');
        this.settingsWindow$.next(false);
        this.foodWindow.open = false;
        this.eventMenuOpen = false;
        this.spotbieMap.openWelcome();
        this.spotbieMap.closeCategories();
        this.spotbieMap.homeDashboard.closeQrScanner();
    }
    slideMenu() {
        if (this.settingsWindow$.getValue()) {
            this.settingsWindow$.next(false);
        }
    }
    openSettings() {
        this.menuCtrl.close('logged-in-menu');
        if (this.settingsWindow$.getValue()) {
            return;
        }
        this.settingsWindow$.next(true);
    }
    closeSettings() {
        this.settingsWindow$.next(false);
        // Refresh the settings.
        this.userAuthService.getSettings().pipe((0, rxjs_1.take)(1)).subscribe();
    }
    logOut() {
        this.userAuthService.logOut().subscribe(resp => {
            (0, logout_callback_1.logOutCallback)(resp);
        });
    }
    async getLoyaltyPointBalance() {
        await this.loyaltyPointsService.getLoyaltyPointBalance();
    }
    ngAfterViewInit() {
        this.mapApp$.next(true);
    }
};
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieMainMenu')
], MenuLoggedInComponent.prototype, "spotbieMainMenu", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieMap')
], MenuLoggedInComponent.prototype, "spotbieMap", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieSettings')
], MenuLoggedInComponent.prototype, "spotbieSettings", void 0);
MenuLoggedInComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-menu-logged-in',
        templateUrl: './menu-logged-in.component.html',
        styleUrls: ['../menu.component.css', './menu-logged-in.component.scss'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], MenuLoggedInComponent);
exports.MenuLoggedInComponent = MenuLoggedInComponent;
//# sourceMappingURL=menu-logged-in.component.js.map