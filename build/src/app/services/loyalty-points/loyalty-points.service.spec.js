"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const loyalty_points_service_1 = require("./loyalty-points.service");
describe('LoyaltyPointsService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(loyalty_points_service_1.LoyaltyPointsService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=loyalty-points.service.spec.js.map