"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConfirmationComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const dialog_1 = require("@angular/material/dialog");
const user_errors_1 = require("../../errors/user.errors");
const retry_operators_1 = require("../../helpers/retry.operators");
let EmailConfirmationComponent = class EmailConfirmationComponent {
    constructor(dialogRef, dat, emailConfirmationService, formBuilder, matDialog) {
        this.dialogRef = dialogRef;
        this.dat = dat;
        this.emailConfirmationService = emailConfirmationService;
        this.formBuilder = formBuilder;
        this.matDialog = matDialog;
        this.emailAddressChange = new core_1.EventEmitter();
        this.emailConfirmationPassed = false;
        this.affirmEmail = true;
        this.confirmEmail = false;
        this.codeCheckTried = false;
        this.loading = false;
    }
    sendCode() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        const email = this.providedEmail;
        const firstName = this.firstName;
        this.emailConfirmationService.sendCode(firstName, email).subscribe(resp => {
            this.sendCodeCallback(resp);
        }, error => {
            const sentryContext = {
                errorName: 'Email Confirmation Error',
                email,
                confirmationCode: this.confirmationCode,
                errorMessage: 'There was an error confirming your e-mail.',
                error: null,
            };
            sentryContext.error = new user_errors_1.EmailConfirmationError(sentryContext.errorName);
            this.loading = false;
            (0, retry_operators_1.logErrorMessage)(3, error, sentryContext, this.matDialog);
        });
    }
    sendCodeCallback(httpResponse) {
        if (httpResponse === undefined) {
            return;
        }
        if (httpResponse.success) {
            if (httpResponse.status === 'confirmation.sent') {
                this.initPinForm();
                this.affirmEmail = false;
                this.confirmEmail = true;
            }
            else if (httpResponse.status === 'confirmation.verified') {
                this.codeCheckTried = true;
                this.emailConfirmationPassed = true;
                this.affirmEmail = false;
                this.confirmEmail = false;
            }
        }
        else {
            console.log('sendCodeCallback', httpResponse);
        }
        this.loading = false;
    }
    checkCode() {
        this.loading = true;
        this.emailConfirmationService
            .checkCode(this.confirmationCode, this.spotbieEmail)
            .subscribe(resp => {
            this.checkCodeCallback(resp);
        });
    }
    checkCodeCallback(httpResponse) {
        this.confirmEmail = false;
        this.codeCheckTried = true;
        this.loading = false;
        if (httpResponse === undefined) {
            return;
        }
        if (httpResponse.success) {
            if (httpResponse.is_valid) {
                this.emailConfirmationPassed = true;
                const parentObj = {
                    emailConfirmed: this.emailConfirmationPassed,
                };
                setTimeout(function () {
                    this.dialogRef.close(parentObj);
                }.bind(this, parentObj), 3000);
            }
            else {
                this.emailConfirmationPassed = false;
            }
        }
        else {
            this.emailConfirmationPassed = false;
        }
    }
    changeParentEmail() {
        this.emailAddressChange.emit(this.spotbieEmail);
    }
    get d() {
        return this.confirmEmailForm.controls;
    }
    get spotbieEmail() {
        return this.confirmEmailForm.get('spotbieEmail').value;
    }
    initEmailForm() {
        const emailValidators = [forms_1.Validators.required];
        this.confirmEmailForm = this.formBuilder.group({
            spotbieEmail: ['', emailValidators],
        });
        this.confirmEmailForm.get('spotbieEmail').setValue(this.providedEmail);
    }
    get f() {
        return this.pinForm.controls;
    }
    get confirmationCode() {
        return this.pinForm.get('confirmationCode').value;
    }
    initPinForm() {
        const codeValidators = [forms_1.Validators.required];
        this.pinForm = this.formBuilder.group({
            confirmationCode: ['', codeValidators],
        });
    }
    backToFirst() {
        this.affirmEmail = true;
        this.confirmEmail = false;
        this.codeCheckTried = false;
    }
    close() {
        const parentObj = {
            emailConfirmed: this.emailConfirmationPassed,
        };
        this.dialogRef.close(parentObj);
    }
    ngOnInit() {
        this.providedEmail = this.dat.email;
        this.firstName = this.dat.firstName;
        this.initEmailForm();
    }
};
EmailConfirmationComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-email-confirmation',
        templateUrl: './email-confirmation.component.html',
        styleUrls: ['./email-confirmation.component.css'],
    }),
    tslib_1.__param(1, (0, core_1.Inject)(dialog_1.MAT_DIALOG_DATA))
], EmailConfirmationComponent);
exports.EmailConfirmationComponent = EmailConfirmationComponent;
//# sourceMappingURL=email-confirmation.component.js.map