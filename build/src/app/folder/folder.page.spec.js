"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const router_1 = require("@angular/router");
const angular_1 = require("@ionic/angular");
const folder_page_1 = require("./folder.page");
describe('FolderPage', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await testing_1.TestBed.configureTestingModule({
            declarations: [folder_page_1.FolderPage],
            imports: [angular_1.IonicModule.forRoot(), router_1.RouterModule.forRoot([])]
        }).compileComponents();
        fixture = testing_1.TestBed.createComponent(folder_page_1.FolderPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=folder.page.spec.js.map