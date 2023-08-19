"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLoggedInComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const account_type_enum_1 = require("../../helpers/enum/account-type.enum");
const logout_callback_1 = require("../../helpers/logout-callback");
let MenuLoggedInComponent = class MenuLoggedInComponent {
    constructor(userAuthService, deviceService, loyaltyPointsService, router) {
        this.userAuthService = userAuthService;
        this.deviceService = deviceService;
        this.loyaltyPointsService = loyaltyPointsService;
        this.router = router;
        this.userBackgroundEvent = new core_1.EventEmitter();
        this.foodWindow = { open: false };
        this.mapApp = { open: true };
        this.settingsWindow = { open: false };
        this.menuActive = false;
        this.userLoyaltyPoints$ = this.loyaltyPointsService.userLoyaltyPoints$;
        this.userName = null;
        this.qrCode = false;
        this.business = false;
        this.eventMenuOpen = false;
        this.isMobile = this.deviceService.isMobile();
        this.isDesktop = this.deviceService.isDesktop();
        this.isTablet = this.deviceService.isTablet();
        this.userType = parseInt(localStorage.getItem('spotbie_userType'));
        if (this.userType === account_type_enum_1.AllowedAccountTypes.Personal) {
            this.business = false;
        }
        else {
            this.business = true;
        }
        this.userName = localStorage.getItem('spotbie_userLogin');
        this.getLoyaltyPointBalance();
    }
    myFavorites() {
        this.menuActive = false;
        this.spotbieMap.myFavorites();
    }
    toggleLoyaltyPoints() {
        this.spotbieMap.goToLp();
    }
    toggleQRScanner() {
        this.spotbieMap.goToQrCode();
    }
    toggleRewardMenu(ac) {
        this.spotbieMap.goToRewardMenu();
    }
    spawnCategories(category) {
        this.slideMenu();
        const obj = {
            category,
        };
        this.spotbieMap.spawnCategories(obj);
    }
    home() {
        this.settingsWindow.open = false;
        this.foodWindow.open = false;
        this.eventMenuOpen = false;
        this.spotbieMap.openWelcome();
        this.spotbieMap.closeCategories();
    }
    slideMenu() {
        if (this.settingsWindow.open) {
            this.settingsWindow.open = false;
        }
        else {
            this.menuActive = !this.menuActive;
        }
    }
    getMenuStyle() {
        if (this.menuActive === false) {
            return { 'background-color': 'transparent' };
        }
    }
    openWindow(window) {
        window.open = true;
    }
    closeWindow(window) {
        window.open = false;
    }
    logOut() {
        this.userAuthService.logOut().subscribe(resp => {
            (0, logout_callback_1.logOutCallback)(resp, false);
            this.router.navigate(['/home']);
        });
    }
    usersAroundYou() {
        this.spotbieMap.mobileStartLocation();
    }
    async getLoyaltyPointBalance() {
        await this.loyaltyPointsService.getLoyaltyPointBalance();
    }
    getPointsWrapperStyle() {
        if (this.isMobile) {
            return { 'width:': '85%', 'text-align': 'right' };
        }
        else {
            return { width: '45%' };
        }
    }
    openEvents() {
        this.eventMenuOpen = true;
    }
    closeEvents() {
        this.eventMenuOpen = false;
    }
    ngAfterViewInit() {
        this.mapApp.open = true;
    }
};
tslib_1.__decorate([
    (0, core_1.Output)()
], MenuLoggedInComponent.prototype, "userBackgroundEvent", void 0);
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
        styleUrls: ['../menu.component.css', './menu-logged-in.component.css'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], MenuLoggedInComponent);
exports.MenuLoggedInComponent = MenuLoggedInComponent;
//# sourceMappingURL=menu-logged-in.component.js.map