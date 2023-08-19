"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const nearby_featured_ad_component_1 = require("./nearby-featured-ad.component");
describe('NearbyFeaturedAdComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await testing_1.TestBed.configureTestingModule({
            declarations: [nearby_featured_ad_component_1.NearbyFeaturedAdComponent]
        })
            .compileComponents();
    });
    beforeEach(() => {
        fixture = testing_1.TestBed.createComponent(nearby_featured_ad_component_1.NearbyFeaturedAdComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=nearby-featured-ad.component.spec.js.map