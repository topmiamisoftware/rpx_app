"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const version_check_service_1 = require("./version-check.service");
describe('VersionCheckService', () => {
    beforeEach(() => testing_1.TestBed.configureTestingModule({}));
    it('should be created', () => {
        const service = testing_1.TestBed.get(version_check_service_1.VersionCheckService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=version-check.service.spec.js.map