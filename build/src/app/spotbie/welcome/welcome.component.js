"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let WelcomeComponent = class WelcomeComponent {
    constructor() {
        this.getStartedEvt = new core_1.EventEmitter();
        this.currentCard = 0;
    }
    getStarted() {
        this.getStartedEvt.emit();
    }
    whichCard(card) {
        if (card === this.currentCard) {
            return { display: 'block' };
        }
        else {
            return { display: 'none' };
        }
    }
    ngOnInit() { }
};
tslib_1.__decorate([
    (0, core_1.Output)()
], WelcomeComponent.prototype, "getStartedEvt", void 0);
WelcomeComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-welcome',
        templateUrl: './welcome.component.html',
        styleUrls: ['./welcome.component.css']
    })
], WelcomeComponent);
exports.WelcomeComponent = WelcomeComponent;
//# sourceMappingURL=welcome.component.js.map