"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const testing_1 = require("@angular/core/testing");
const testing_2 = require("@angular/router/testing");
const app_component_1 = require("./app.component");
describe('AppComponent', () => {
    beforeEach(async () => {
        await testing_1.TestBed.configureTestingModule({
            declarations: [app_component_1.AppComponent],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
            imports: [testing_2.RouterTestingModule.withRoutes([])],
        }).compileComponents();
    });
    it('should create the app', async () => {
        const fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
    it('should have menu labels', async () => {
        const fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        fixture.detectChanges();
        const app = fixture.nativeElement;
        const menuItems = app.querySelectorAll('ion-label');
        expect(menuItems.length).toEqual(12);
        expect(menuItems[0].textContent).toContain('Inbox');
        expect(menuItems[1].textContent).toContain('Outbox');
    });
    it('should have urls', async () => {
        const fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        fixture.detectChanges();
        const app = fixture.nativeElement;
        const menuItems = app.querySelectorAll('ion-item');
        expect(menuItems.length).toEqual(12);
        expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/folder/inbox');
        expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/folder/outbox');
    });
});
//# sourceMappingURL=app.component.spec.js.map