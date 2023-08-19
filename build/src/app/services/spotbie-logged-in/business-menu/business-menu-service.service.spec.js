"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const business_menu_service_service_1 = require("./business-menu-service.service");
describe('BusinessMenuServiceService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(business_menu_service_service_1.BusinessMenuServiceService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=business-menu-service.service.spec.js.map