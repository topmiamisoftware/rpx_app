"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const bottom_ad_banner_component_1 = require("./bottom-ad-banner.component");
describe('BottomAdBannerComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await testing_1.TestBed.configureTestingModule({
            declarations: [bottom_ad_banner_component_1.BottomAdBannerComponent]
        })
            .compileComponents();
    });
    beforeEach(() => {
        fixture = testing_1.TestBed.createComponent(bottom_ad_banner_component_1.BottomAdBannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=bottom-ad-banner.component.spec.js.map