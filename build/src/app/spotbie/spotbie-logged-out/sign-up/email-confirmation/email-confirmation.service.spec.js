"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const email_confirmation_service_1 = require("./email-confirmation.service");
describe('EmailConfirmationService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(email_confirmation_service_1.EmailConfirmationService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=email-confirmation.service.spec.js.map