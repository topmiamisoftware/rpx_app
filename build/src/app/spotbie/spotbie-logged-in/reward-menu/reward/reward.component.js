"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const preferences_1 = require("@capacitor/preferences");
let RewardComponent = class RewardComponent {
    constructor() {
        this.closeWindowEvt = new core_1.EventEmitter();
        this.fullScreenMode = true;
        this.loading = false;
        this.successful_url_copy = false;
    }
    async ngAfterViewInit() {
        const isLoggedInRet = await preferences_1.Preferences.get({ key: 'spotbie_loggedIn' });
        this.isLoggedIn = isLoggedInRet.value;
        // I'm sure there's a better way to do this but I don't have time right now.
        const closeButton = document.getElementById('sb-closeButtonReward');
        const p = this.isLoggedIn === '0' || !this.isLoggedIn
            ? document.getElementById('ionToolbarLoggedOut').offsetHeight
            : document.getElementById('ionToolbarLoggedIn').offsetHeight;
        closeButton.style.top = p + 'px';
    }
    ngOnInit() { }
    getFullScreenModeClass() {
        if (this.fullScreenMode) {
            return 'fullScreenMode';
        }
        else {
            return '';
        }
    }
    closeThis() {
        this.closeWindowEvt.emit();
    }
    linkCopy(inputElement) {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, inputElement.value.length);
        this.successful_url_copy = true;
        setTimeout(() => {
            this.successful_url_copy = false;
        }, 2500);
    }
};
tslib_1.__decorate([
    (0, core_1.Output)()
], RewardComponent.prototype, "closeWindowEvt", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], RewardComponent.prototype, "fullScreenMode", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], RewardComponent.prototype, "reward", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], RewardComponent.prototype, "userPointToDollarRatio", void 0);
RewardComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-reward',
        templateUrl: './reward.component.html',
        styleUrls: ['./reward.component.css'],
    })
], RewardComponent);
exports.RewardComponent = RewardComponent;
//# sourceMappingURL=reward.component.js.map