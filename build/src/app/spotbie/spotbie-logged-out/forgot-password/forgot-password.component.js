"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const rxjs_1 = require("rxjs");
const DEF_INC_PASS_OR_EM_MSG = 'Enter your e-mail address.';
const DEF_PIN_PASS_OR_EM_MSG = 'Check your e-mail for a reset link.';
let ForgotPasswordComponent = class ForgotPasswordComponent {
    constructor(formBuilder, userAuthService) {
        this.formBuilder = formBuilder;
        this.userAuthService = userAuthService;
        this.passResetSubmitted$ = new rxjs_1.BehaviorSubject(false);
        this.loading$ = new rxjs_1.BehaviorSubject(false);
        this.stepOne$ = new rxjs_1.BehaviorSubject(false);
        this.stepTwo$ = new rxjs_1.BehaviorSubject(false);
        this.pinReadyMsg$ = new rxjs_1.BehaviorSubject(DEF_PIN_PASS_OR_EM_MSG);
        this.emailOrPhError$ = new rxjs_1.BehaviorSubject(DEF_INC_PASS_OR_EM_MSG);
    }
    get spotbieEmailOrPh() {
        return this.passwordResetForm.get('spotbieEmailOrPh').value;
    }
    get g() {
        return this.passwordResetForm.controls;
    }
    get h() {
        return this.passwordForm.controls;
    }
    ngOnInit() {
        this.initForgotPassForm();
        this.stepOne$.next(true);
    }
    setPassResetPin() {
        this.loading$.next(true);
        this.passResetSubmitted$.next(true);
        if (this.passwordResetForm.invalid) {
            this.loading$.next(false);
            return;
        }
        this.userAuthService
            .setPassResetPin(this.spotbieEmailOrPh)
            .subscribe(resp => {
            this.startPassResetCb(resp);
        });
    }
    initForgotPassForm() {
        const spotbieEmailOrPhValidators = [
            forms_1.Validators.required,
            forms_1.Validators.maxLength(130),
        ];
        this.passwordResetForm = this.formBuilder.group({
            spotbieEmailOrPh: ['', spotbieEmailOrPhValidators],
        });
    }
    startPassResetCb(httpResponse) {
        if (httpResponse && httpResponse.success) {
            if (httpResponse.status === 'passwords.sent') {
                this.stepOne$.next(false);
                this.showSuccess();
            }
            else if (httpResponse.status === 'passwords.throttled') {
                this.emailOrPhError$.next('You have sent too many password reset requests, please try again later.');
            }
            else if (httpResponse.status === 'social_account') {
                this.emailOrPhError$.next('You signed up with social media.');
            }
            else {
                this.emailOrPhError$.next('E-mail address not found.');
            }
        }
        else {
            this.emailOrPhError$.next('I e-mail address.');
        }
        this.getLinkMessage.nativeElement.style.display = 'none';
        this.getLinkMessage.nativeElement.className =
            'spotbie-text-gradient spotbie-error spotbie-contact-me-info';
        this.getLinkMessage.nativeElement.style.display = 'block';
        this.loading$.next(false);
    }
    showSuccess() {
        this.stepTwo$.next(true);
    }
};
tslib_1.__decorate([
    (0, core_1.ViewChild)('getLinkMessage')
], ForgotPasswordComponent.prototype, "getLinkMessage", void 0);
ForgotPasswordComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-forgot-password',
        templateUrl: './forgot-password.component.html',
        styleUrls: ['./forgot-password.component.css'],
    })
], ForgotPasswordComponent);
exports.ForgotPasswordComponent = ForgotPasswordComponent;
//# sourceMappingURL=forgot-password.component.js.map