"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLoggedOutComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const router_1 = require("@angular/router");
const operators_1 = require("rxjs/operators");
let MenuLoggedOutComponent = class MenuLoggedOutComponent {
    constructor(menuCtrl, router) {
        this.menuCtrl = menuCtrl;
        this.router = router;
        this.myFavoritesEvt = new core_1.EventEmitter();
        this.openHome = new core_1.EventEmitter();
        this.logInWindow$ = new rxjs_1.BehaviorSubject(true);
        this.signUpWindow$ = new rxjs_1.BehaviorSubject(false);
        this.onForgotPassword$ = new rxjs_1.BehaviorSubject(false);
        this.router.events
            .pipe((0, operators_1.filter)(event => event instanceof router_1.NavigationEnd))
            .subscribe(event => {
            const r = event;
            if (r.url.indexOf('forgot-password') > 0) {
                this.onForgotPassword$.next(true);
            }
        });
    }
    spawnCategories(type) {
        this.logInWindow$.next(false);
        this.signUpWindow$.next(false);
        this.menuCtrl.close('main-menu');
        this.appMap.spawnCategories(type);
    }
    logIn() {
        this.signUpWindow$.next(false);
        this.logInWindow$.next(!this.logInWindow$.getValue());
    }
    closeSignUp(event$) {
        this.signUpWindow$.next(false);
    }
    home() {
        this.menuCtrl.close('main-menu');
        this.signUpWindow$.next(false);
        this.logInWindow$.next(true);
        this.appMap.map$.next(false);
        this.appMap.searchResults$.next([]);
        this.appMap.showSearchResults$.next(false);
        if (this.onForgotPassword$.getValue()) {
            this.router.navigate(['/home']);
        }
    }
};
tslib_1.__decorate([
    (0, core_1.Output)()
], MenuLoggedOutComponent.prototype, "myFavoritesEvt", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], MenuLoggedOutComponent.prototype, "openHome", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieMainMenu')
], MenuLoggedOutComponent.prototype, "spotbieMainMenu", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('appLogin')
], MenuLoggedOutComponent.prototype, "appLogin", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('appMap')
], MenuLoggedOutComponent.prototype, "appMap", void 0);
MenuLoggedOutComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-menu-logged-out',
        templateUrl: './menu-logged-out.component.html',
        styleUrls: ['../menu.component.css'],
    })
], MenuLoggedOutComponent);
exports.MenuLoggedOutComponent = MenuLoggedOutComponent;
//# sourceMappingURL=menu-logged-out.component.js.map