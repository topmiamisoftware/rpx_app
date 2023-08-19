"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const info_object_service_service_1 = require("./info-object-service.service");
describe('InfoObjectServiceService', () => {
    beforeEach(() => testing_1.TestBed.configureTestingModule({}));
    it('should be created', () => {
        const service = testing_1.TestBed.get(info_object_service_service_1.InfoObjectServiceService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=info-object-service.service.spec.js.map