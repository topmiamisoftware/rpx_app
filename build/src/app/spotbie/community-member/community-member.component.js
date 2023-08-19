"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityMemberComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let CommunityMemberComponent = class CommunityMemberComponent {
    constructor(router, activatedRoute, businessMenuService) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.businessMenuService = businessMenuService;
        this.accountType = null;
        this.editMode = false;
        this.eventsClassification = null;
        this.qrCodeLink = null;
        this.closeWindowEvt = new core_1.EventEmitter();
        this.infoObjectLoaded = false;
        this.fullScreenMode = false;
    }
    closeWindow() {
        this.closeWindowEvt.emit();
    }
    getCommunityMember() {
        const getCommunityMemberReqObj = {
            qrCodeLink: this.qrCodeLink,
        };
        this.businessMenuService
            .getCommunityMember(getCommunityMemberReqObj)
            .subscribe(resp => {
            this.business = resp.business;
            this.business.is_community_member = true;
            this.business.type_of_info_object = 'spotbie_community';
            this.business.loyalty_point_dollar_percent_value =
                this.business.loyalty_point_balance.loyalty_point_dollar_percent_value;
            this.business.rewardRate =
                this.business.loyalty_point_dollar_percent_value / 100;
            this.infoObject.business = this.business;
            this.infoObjectLoaded = true;
        });
    }
    ngOnInit() {
        if (this.router.url.indexOf('community') > -1) {
            this.qrCodeLink = this.activatedRoute.snapshot.paramMap.get('qrCode');
            this.fullScreenMode = true;
        }
        this.getCommunityMember();
    }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "lat", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "lng", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "business", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "ad", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "accountType", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "categories", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "editMode", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "eventsClassification", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "qrCodeLink", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], CommunityMemberComponent.prototype, "closeWindowEvt", void 0);
CommunityMemberComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-community-member',
        templateUrl: './community-member.component.html',
        styleUrls: ['./community-member.component.css'],
    })
], CommunityMemberComponent);
exports.CommunityMemberComponent = CommunityMemberComponent;
//# sourceMappingURL=community-member.component.js.map