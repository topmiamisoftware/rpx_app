"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const login_guard_service_service_1 = require("./login-guard-service.service");
describe('LoginGuardServiceService', () => {
    beforeEach(() => testing_1.TestBed.configureTestingModule({}));
    it('should be created', () => {
        const service = testing_1.TestBed.get(login_guard_service_service_1.LoginGuardServiceService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=login-guard-service.service.spec.js.map