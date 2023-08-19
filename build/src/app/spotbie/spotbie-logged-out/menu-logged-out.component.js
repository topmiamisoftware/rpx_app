"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLoggedOutComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const web_intent_1 = require("../../helpers/cordova/web-intent");
let MenuLoggedOutComponent = class MenuLoggedOutComponent {
    constructor(location, platform, router) {
        this.location = location;
        this.platform = platform;
        this.router = router;
        this.myFavoritesEvt = new core_1.EventEmitter();
        this.spawnCategoriesOut = new core_1.EventEmitter();
        this.openHome = new core_1.EventEmitter();
        this.logInWindow = { open: true };
        this.signUpWindow = { open: false };
        this.menuActive = false;
        this.business = false;
    }
    ngOnInit() {
        const activatedRoute = this.location.path();
        this.isMobile = this.platform.is('mobile');
        this.isDesktop = this.platform.is('desktop');
        this.isTablet = this.platform.is('tablet');
        // check if we need to auto log-in
        const cookiedRememberMe = localStorage.getItem('spotbie_rememberMe');
        const loggedIn = localStorage.getItem('spotbie_rememberMe');
        if (activatedRoute.indexOf('/business') > -1) {
            this.business = true;
        }
        if (cookiedRememberMe === '1' &&
            activatedRoute.indexOf('/home') > -1 &&
            loggedIn !== '1') {
            this.logInWindow.open = true;
        }
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.spotbieMainMenu.nativeElement.style.display = 'table';
        }, 750);
    }
    spawnCategories(type, slideMenu = true) {
        this.logInWindow.open = false;
        this.signUpWindow.open = false;
        if (slideMenu) {
            this.slideMenu();
        }
        this.spawnCategoriesOut.emit(type);
    }
    goToBlog() {
        (0, web_intent_1.externalBrowserOpen)('https://blog.spotbie.com/');
    }
    openWindow(window) {
        window.open = !window.open;
    }
    closeWindow(window) {
        window.open = false;
    }
    goToBusiness() {
        this.router.navigate(['/business']);
    }
    goToAppUser() {
        this.router.navigate(['/home']);
    }
    signUp() {
        this.logInWindow.open = false;
        this.signUpWindow.open = !this.signUpWindow.open;
    }
    logIn() {
        this.signUpWindow.open = false;
        this.logInWindow.open = !this.logInWindow.open;
    }
    slideMenu() {
        this.menuActive = !this.menuActive;
    }
    getMenuStyle() {
        if (!this.menuActive) {
            return { 'background-color': 'transparent' };
        }
    }
    scrollTo(el) {
        const element = document.getElementById(el);
        element.scrollIntoView();
    }
    myFavorites() {
        this.menuActive = false;
        this.myFavoritesEvt.next(null);
    }
    home() {
        this.menuActive = false;
        this.signUpWindow.open = false;
        this.logInWindow.open = true;
    }
};
tslib_1.__decorate([
    (0, core_1.Output)()
], MenuLoggedOutComponent.prototype, "myFavoritesEvt", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], MenuLoggedOutComponent.prototype, "spawnCategoriesOut", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], MenuLoggedOutComponent.prototype, "openHome", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieMainMenu')
], MenuLoggedOutComponent.prototype, "spotbieMainMenu", void 0);
MenuLoggedOutComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-menu-logged-out',
        templateUrl: './menu-logged-out.component.html',
        styleUrls: ['../menu.component.css'],
    })
], MenuLoggedOutComponent);
exports.MenuLoggedOutComponent = MenuLoggedOutComponent;
//# sourceMappingURL=menu-logged-out.component.js.map