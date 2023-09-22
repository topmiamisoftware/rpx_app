"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyList = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const router_1 = require("@angular/router");
const operators_1 = require("rxjs/operators");
let MyList = class MyList {
    constructor(router) {
        this.router = router;
        this.currentTitle$ = new rxjs_1.BehaviorSubject(null);
        this.router.events
            .pipe((0, operators_1.filter)(event => event instanceof router_1.NavigationEnd))
            .subscribe(event => {
            const navEnd = event;
            this.setPageTitle(navEnd);
            setTimeout(() => this.setTopMargin(), 500);
        });
    }
    setPageTitle(navEnd) {
        let title = 'Balance List';
        if (navEnd.url.indexOf('rewards') > 0) {
            title = 'My Rewards';
        }
        else if (navEnd.url.indexOf('balance-list') > 0) {
            title = 'Balance List';
        }
        else if (navEnd.url.indexOf('redeemed') > 0) {
            title = 'Redeemed Points';
        }
        else if (navEnd.url.indexOf('ledger') > 0) {
            title = 'My Ledger';
        }
        this.currentTitle$.next(title);
        return;
    }
    setTopMargin() {
        const toolbarHeight = document.getElementsByClassName('my-list-header')[0].clientHeight;
        const a = document.getElementsByClassName('redeemWindowNavMargin');
        for (let i = 0; i < a.length; i++) {
            a[i].style.marginTop = toolbarHeight - 5 + 'px';
        }
        console.log('toolbarHeight', toolbarHeight);
    }
    ngOnInit() { }
    ngAfterViewInit() { }
};
MyList = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-my-list',
        templateUrl: './my-list.component.html',
        styleUrls: ['./my-list.component.css'],
    })
], MyList);
exports.MyList = MyList;
//# sourceMappingURL=my-list.component.js.map