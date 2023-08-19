"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const environment_prod_1 = require("../environments/environment.prod");
const error_helper_1 = require("./helpers/error-helper");
const spotbie_1 = require("./constants/spotbie");
const SPOTBIE_META_DESCRIPTION = spotbie_1.spotbieMetaDescription;
const SPOTBIE_META_TITLE = spotbie_1.spotbieMetaTitle;
const SPOTBIE_META_IMAGE = spotbie_1.spotbieMetaImage;
let AppComponent = class AppComponent {
    constructor(versionCheckService, spotbieMetaService) {
        this.versionCheckService = versionCheckService;
        this.spotbieMetaService = spotbieMetaService;
        this.title = 'spotbie';
        this.testMode = false;
        this.displayTestModeOptions = false;
        this.lat = null;
        this.lng = null;
    }
    onWindowLoaded() {
        this.versionCheckService.initVersionCheck(environment_prod_1.environment.versionCheckURL);
    }
    dismissToast() {
        (0, error_helper_1.dismissToast)();
    }
    openTestModeSpecs() {
        this.displayTestModeOptions = true;
    }
    closeTestModeSpecs() {
        this.displayTestModeOptions = false;
    }
    ngOnInit() {
        if (environment_prod_1.environment.staging) {
            this.testMode = true;
            this.lat = environment_prod_1.environment.myLocX;
            this.lng = environment_prod_1.environment.myLocY;
        }
        this.spotbieMetaService.setTitle(SPOTBIE_META_TITLE);
        this.spotbieMetaService.setDescription(SPOTBIE_META_DESCRIPTION);
        this.spotbieMetaService.setImage(SPOTBIE_META_IMAGE);
    }
};
tslib_1.__decorate([
    (0, core_1.HostListener)('window:load', [])
], AppComponent.prototype, "onWindowLoaded", null);
AppComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map