"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardMenuModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const reward_menu_component_1 = require("./reward-menu.component");
const reward_component_1 = require("./reward/reward.component");
const reward_creator_component_1 = require("./reward-creator/reward-creator.component");
const select_1 = require("@angular/material/select");
const form_field_1 = require("@angular/material/form-field");
const forms_1 = require("@angular/forms");
const buttons_1 = require("ngx-sharebuttons/buttons");
const helper_module_1 = require("../../../helpers/helper.module");
let RewardMenuModule = class RewardMenuModule {
};
RewardMenuModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [reward_menu_component_1.RewardMenuComponent, reward_component_1.RewardComponent, reward_creator_component_1.RewardCreatorComponent],
        imports: [
            common_1.CommonModule,
            select_1.MatSelectModule,
            form_field_1.MatFormFieldModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            helper_module_1.HelperModule,
            buttons_1.ShareButtonsModule.withConfig({
                include: [
                    'facebook',
                    'twitter',
                    'linkedin',
                    'reddit',
                    'tumblr',
                    'mix',
                    'viber',
                    'messenger',
                    'whatsapp',
                ],
            }),
        ],
        exports: [reward_menu_component_1.RewardMenuComponent],
    })
], RewardMenuModule);
exports.RewardMenuModule = RewardMenuModule;
//# sourceMappingURL=reward-menu.module.js.map