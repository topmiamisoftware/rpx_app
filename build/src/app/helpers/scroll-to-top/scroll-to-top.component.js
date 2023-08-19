"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollToTopComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const $ = require("jquery");
let ScrollToTopComponent = class ScrollToTopComponent {
    constructor() {
        this.arrowOn = false;
    }
    scrollTop() {
        $('#spotbieMainSpotBieScroll').animate({ scrollTop: 0 }, 'slow');
    }
    ngOnInit() { }
    ngAfterViewInit() {
        $('#spotbieMainSpotBieScroll').on('scroll', () => {
            // do your things like logging the Y-axis
            const scrollTopSpace = $('#spotbieMainSpotBieScroll').scrollTop();
            if (scrollTopSpace < 119) {
                this.scrollArrow.nativeElement.className =
                    'spotbie-scroll-top spotbie-arrow-transparent';
                this.arrowOn = false;
            }
            else if (this.arrowOn === false && scrollTop > 120) {
                this.arrowOn = true;
                this.scrollArrow.nativeElement.className = 'spotbie-scroll-top';
            }
        });
        const scrollTop = $('#spotbieMainSpotBieScroll').scrollTop();
        if (scrollTop > 50) {
            this.scrollArrow.nativeElement.className = 'spotbie-scroll-top';
            this.arrowOn = true;
        }
    }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], ScrollToTopComponent.prototype, "inputWindow", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('scrollArrow')
], ScrollToTopComponent.prototype, "scrollArrow", void 0);
ScrollToTopComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-scroll-to-top',
        templateUrl: './scroll-to-top.component.html',
        styleUrls: ['./scroll-to-top.component.css'],
    })
], ScrollToTopComponent);
exports.ScrollToTopComponent = ScrollToTopComponent;
//# sourceMappingURL=scroll-to-top.component.js.map