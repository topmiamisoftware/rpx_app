"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const event_menu_service_service_1 = require("./event-menu-service.service");
describe('BusinessMenuServiceService', () => {
    let service;
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(event_menu_service_service_1.EventMenuServiceService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=event-menu-service.service.spec.js.map