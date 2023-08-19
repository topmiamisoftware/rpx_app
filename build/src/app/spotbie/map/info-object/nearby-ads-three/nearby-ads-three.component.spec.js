"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const nearby_ads_three_component_1 = require("./nearby-ads-three.component");
describe('NearbyAdsThreeComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await testing_1.TestBed.configureTestingModule({
            declarations: [nearby_ads_three_component_1.NearbyAdsThreeComponent]
        })
            .compileComponents();
    });
    beforeEach(() => {
        fixture = testing_1.TestBed.createComponent(nearby_ads_three_component_1.NearbyAdsThreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=nearby-ads-three.component.spec.js.map