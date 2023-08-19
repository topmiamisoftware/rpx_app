"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const location_service_1 = require("./location.service");
describe('LocationService', () => {
    beforeEach(() => testing_1.TestBed.configureTestingModule({}));
    it('should be created', () => {
        const service = testing_1.TestBed.get(location_service_1.LocationService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=location.service.spec.js.map