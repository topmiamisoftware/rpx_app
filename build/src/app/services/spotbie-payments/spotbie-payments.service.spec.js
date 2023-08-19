"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const spotbie_payments_service_1 = require("./spotbie-payments.service");
describe('SpotbiePaymentsService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(spotbie_payments_service_1.SpotbiePaymentsService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=spotbie-payments.service.spec.js.map