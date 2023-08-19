"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let RewardComponent = class RewardComponent {
    constructor() {
        this.closeWindowEvt = new core_1.EventEmitter();
        this.fullScreenMode = true;
        this.loading = false;
        this.infoObjectImageUrl = 'assets/images/home_imgs/spotbie-white-icon.svg';
        this.successful_url_copy = false;
        this.rewardLink = null;
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