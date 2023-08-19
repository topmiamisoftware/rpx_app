"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const password_validator_1 = require("../../../helpers/password.validator");
const must_match_validator_1 = require("../../../helpers/must-match.validator");
const DEF_INC_PASS_OR_EM_MSG = 'Please enter your e-mail address.';
const DEF_PIN_PASS_OR_EM_MSG = 'Check your e-mail for a reset link.';
const NEW_PASS_MSG = 'Enter Your New Password.';
let ForgotPasswordComponent = class ForgotPasswordComponent {
    constructor(activatedRoute, formBuilder, userAuthService, router) {
        this.activatedRoute = activatedRoute;
        this.formBuilder = formBuilder;
        this.userAuthService = userAuthService;
        this.router = router;
        this.closeWindow = new core_1.EventEmitter();
        this.passResetSubmitted = false;
        this.loading = false;
        this.passwordSubmitted = false;
        this.savePassword = false;
        this.stepOne = false;
        this.stepTwo = false;
        this.stepThree = false;
        this.stepFour = false;
        this.pinResetSubmitted = false;
        this.attemptsRemaining = 3;
        this.pinReadyMsg = DEF_PIN_PASS_OR_EM_MSG;
        this.emailOrPhError = DEF_INC_PASS_OR_EM_MSG;
        this.newPasswordMsg = NEW_PASS_MSG;
    }
    get spotbieEmailOrPh() {
        return this.passwordResetForm.get('spotbieEmailOrPh').value;
    }
    get g() {
        return this.passwordResetForm.controls;
    }
    get spotbieResetPassword() {
        return this.passwordForm.get('spotbieResetPassword').value;
    }
    get spotbieResetPasswordC() {
        return this.passwordForm.get('spotbieResetPasswordC').value;
    }
    get h() {
        return this.passwordForm.controls;
    }
    ngOnInit() {
        this.token = this.activatedRoute.snapshot.paramMap.get('token');
        if (this.token !== null) {
            const urlParams = new URLSearchParams(window.location.search);
            this.userEmail = urlParams.get('email');
            this.initPasswordForm();
            this.stepThree = true;
        }
        else {
            this.initForgotPassForm();
            this.stepOne = true;
        }
    }
    closeWindowX() {
        this.closeWindow.emit(null);
    }
    setPassResetPin() {
        this.loading = true;
        this.passResetSubmitted = true;
        if (this.passwordResetForm.invalid) {
            this.loading = false;
            return;
        }
        const emailOrPhone = this.spotbieEmailOrPh;
        this.userAuthService.setPassResetPin(emailOrPhone).subscribe(resp => {
            this.startPassResetCb(resp);
        });
    }
    completeSavePassword() {
        this.passwordSubmitted = true;
        if (this.passwordForm.invalid) {
            this.savePassword = false;
            return;
        }
        if (this.savePassword) {
            return;
        }
        this.loading = true;
        this.userAuthService
            .completeReset(this.spotbieResetPassword, this.spotbieResetPasswordC, this.userEmail, this.token)
            .subscribe(resp => {
            this.completeSavePasswordCb(resp);
        });
    }
    goHome() {
        this.router.navigate(['/home']);
    }
    completeSavePasswordCb(settingsResponse) {
        if (settingsResponse.success) {
            switch (settingsResponse.status) {
                case 'passwords.reset':
                    this.newPasswordMsg =
                        'Your password was updated. You can now log-in.';
                    this.stepThree = false;
                    this.stepFour = true;
                    setTimeout(() => {
                        this.closeWindowX();
                    }, 3000);
                    break;
                case 'passwords.token':
                    //Expired Token
                    this.newPasswordMsg =
                        'The password reset link has expired, please try to reset your password again.';
                    break;
                default:
                    this.closeWindowX();
            }
        }
        else {
            console.log(settingsResponse);
        }
        this.savePassword = false;
        this.loading = false;
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
                this.stepOne = false;
                this.showSuccess();
            }
            else if (httpResponse.status === 'passwords.throttled') {
                this.emailOrPhError =
                    'You have sent too many password reset requests, please try again later.';
            }
            else if (httpResponse.status === 'social_account') {
                this.emailOrPhError = 'You signed up with social media.';
            }
            else {
                this.emailOrPhError = 'E-mail address not found.';
            }
        }
        else {
            this.emailOrPhError = 'I e-mail address.';
        }
        this.getLinkMessage.nativeElement.style.display = 'none';
        this.getLinkMessage.nativeElement.className =
            'spotbie-text-gradient spotbie-error spotbie-contact-me-info';
        this.getLinkMessage.nativeElement.style.display = 'block';
        this.loading = false;
    }
    initPasswordForm() {
        this.stepThree = true;
        const passwordValidators = [forms_1.Validators.required];
        const passwordConfirmValidators = [forms_1.Validators.required];
        this.passwordForm = this.formBuilder.group({
            spotbieResetPassword: ['', passwordValidators],
            spotbieResetPasswordC: ['', passwordConfirmValidators],
        }, {
            validators: [
                (0, password_validator_1.ValidatePassword)('spotbieResetPassword'),
                (0, must_match_validator_1.MustMatch)('spotbieResetPassword', 'spotbieResetPasswordC'),
            ],
        });
    }
    showSuccess() {
        this.stepTwo = true;
    }
};
tslib_1.__decorate([
    (0, core_1.Output)()
], ForgotPasswordComponent.prototype, "closeWindow", void 0);
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