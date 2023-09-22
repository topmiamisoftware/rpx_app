"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyListModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const angular_1 = require("@ionic/angular");
const spotbie_pipes_module_1 = require("../../../spotbie-pipes/spotbie-pipes.module");
const helper_module_1 = require("../../../helpers/helper.module");
const balances_module_1 = require("./balances/balances.module");
const redeemed_module_1 = require("./redeemed/redeemed.module");
const redeemable_module_1 = require("./redeemable/redeemable.module");
const ledger_module_1 = require("./ledger/ledger.module");
let MyListModule = class MyListModule {
};
MyListModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [],
        imports: [
            common_1.CommonModule,
            spotbie_pipes_module_1.SpotbiePipesModule,
            helper_module_1.HelperModule,
            balances_module_1.BalancesModule,
            redeemed_module_1.RedeemedModule,
            redeemable_module_1.RedeemableModule,
            ledger_module_1.LedgerModule,
            angular_1.IonicModule,
        ],
        exports: [],
    })
], MyListModule);
exports.MyListModule = MyListModule;
//# sourceMappingURL=my-list.module.js.map