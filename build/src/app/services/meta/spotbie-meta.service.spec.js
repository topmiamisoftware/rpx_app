"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const spotbie_meta_service_1 = require("./spotbie-meta.service");
describe('SpotbieMetaService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(spotbie_meta_service_1.SpotbieMetaService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=spotbie-meta.service.spec.js.map