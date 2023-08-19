"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const email_confirmation_component_1 = require("./email-confirmation.component");
describe('EmailConfirmationComponent', () => {
    let component;
    let fixture;
    beforeEach((0, testing_1.async)(() => {
        testing_1.TestBed.configureTestingModule({
            declarations: [email_confirmation_component_1.EmailConfirmationComponent],
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = testing_1.TestBed.createComponent(email_confirmation_component_1.EmailConfirmationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=email-confirmation.component.spec.js.map