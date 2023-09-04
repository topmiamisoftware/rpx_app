"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let HomeComponent = class HomeComponent {
    constructor(router) {
        this.router = router;
        this.arrowOn = false;
        this.getStartedPrompt = true;
    }
    getStarted() {
        this.getStartedPrompt = false;
    }
    spawnCategories(category) {
        this.appMap.spawnCategories(category);
    }
    openHome() {
        this.appMap.openWelcome();
    }
    myFavorites() {
        this.appMap.myFavorites();
    }
    async ngOnInit() {
        const isLoggedIn = localStorage.getItem('spotbie_loggedIn');
        if (isLoggedIn === '1') {
            this.router.navigate(['/user-home']);
        }
    }
};
tslib_1.__decorate([
    (0, core_1.ViewChild)('appMap')
], HomeComponent.prototype, "appMap", void 0);
HomeComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-home',
        templateUrl: './home.component.html',
        styleUrls: ['./home.component.css'],
    })
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map