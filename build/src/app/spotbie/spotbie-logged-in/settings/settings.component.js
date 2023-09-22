"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const user_1 = require("../../../models/user");
const password_validator_1 = require("../../../helpers/password.validator");
const must_match_validator_1 = require("../../../helpers/must-match.validator");
const username_validator_1 = require("../../../helpers/username.validator");
const name_validator_1 = require("../../../helpers/name.validator");
const rxjs_1 = require("rxjs");
const preferences_1 = require("@capacitor/preferences");
const logout_callback_1 = require("../../../helpers/logout-callback");
let SettingsComponent = class SettingsComponent {
    constructor(formBuilder, userAuthService, router) {
        this.formBuilder = formBuilder;
        this.userAuthService = userAuthService;
        this.router = router;
        this.closeWindowEvt = new core_1.EventEmitter();
        this.savePasswordBool$ = new rxjs_1.BehaviorSubject(false);
        this.accountDeactivation$ = new rxjs_1.BehaviorSubject(false);
        this.deactivationSubmitted$ = new rxjs_1.BehaviorSubject(false);
        this.loading$ = new rxjs_1.BehaviorSubject(false);
        this.user$ = new rxjs_1.BehaviorSubject(new user_1.User());
        this.submitted$ = new rxjs_1.BehaviorSubject(false);
        this.passwordSubmitted$ = new rxjs_1.BehaviorSubject(false);
        this.settingsFormInitiated$ = new rxjs_1.BehaviorSubject(false);
        this.isSocialAccount$ = new rxjs_1.BehaviorSubject(false);
        this.errorText$ = new rxjs_1.BehaviorSubject(null);
        this.spotbieSettingsInfoText$ = new rxjs_1.BehaviorSubject(null);
        this.currentPasswordInfoText$ = new rxjs_1.BehaviorSubject('To complete the change, enter your CURRENT password.');
    }
    get username() {
        return this.settingsForm.get('spotbieUsername').value;
    }
    get firstName() {
        return this.settingsForm.get('spotbieFirstName').value;
    }
    get lastName() {
        return this.settingsForm.get('spotbieLastName').value;
    }
    get email() {
        return this.settingsForm.get('spotbieEmail').value;
    }
    get spotbiePhoneNumber() {
        return this.settingsForm.get('spotbiePhoneNumber').value;
    }
    get f() {
        return this.settingsForm.controls;
    }
    get password() {
        return this.passwordForm.get('spotbiePassword').value;
    }
    get confirmPassword() {
        return this.passwordForm.get('spotbieConfirmPassword').value;
    }
    get currentPassword() {
        return this.passwordForm.get('spotbieCurrentPassword').value;
    }
    get g() {
        return this.passwordForm.controls;
    }
    get deactivationPassword() {
        return this.deactivationForm.get('spotbieDeactivationPassword').value;
    }
    get h() {
        return this.deactivationForm.controls;
    }
    ngOnInit() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.loading$.next(true);
        this.initSettingsForm('personal');
    }
    savePassword() {
        this.passwordSubmitted$.next(true);
        this.spotbiePasswordInfoText.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
        if (this.passwordForm.invalid) {
            if (this.password !== this.confirmPassword) {
                this.errorText$.next('Passwords must match.');
                return;
            }
            return;
        }
        this.currentPasswordInfoText$.next('Great, now enter your current password.');
        this.savePasswordBool$.next(true);
        const currentPasswordValidators = [forms_1.Validators.required];
        this.passwordForm.addControl('spotbieCurrentPassword', new forms_1.FormControl('', currentPasswordValidators));
        this.passwordForm.get('spotbieCurrentPassword').setValue('123456789');
    }
    completeSavePassword() {
        if (this.loading$.getValue()) {
            return;
        }
        this.loading$.next(true);
        if (this.passwordForm.invalid) {
            return;
        }
        const savePasswordObj = {
            password: this.password,
            passwordConfirmation: this.confirmPassword,
            currentPassword: this.currentPassword,
        };
        this.userAuthService.passwordChange(savePasswordObj).subscribe(resp => {
            this.passwordChangeCallback(resp);
        }, error => {
            console.log('error', error);
        });
    }
    cancelPasswordSet() {
        this.passwordSubmitted$.next(false);
        this.savePasswordBool$.next(false);
    }
    saveSettings() {
        this.loading$.next(true);
        this.submitted$.next(true);
        if (this.settingsForm.invalid) {
            this.loading$.next(false);
            this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);
            return;
        }
        this.user$.next({
            ...this.user$.getValue(),
            username: this.username,
            email: this.email,
            spotbie_user: {
                ...this.user$.getValue().spotbie_user,
                first_name: this.firstName,
                last_name: this.lastName,
                phone_number: this.spotbiePhoneNumber,
            },
        });
        this.userAuthService.saveSettings(this.user$.getValue()).subscribe({
            next: resp => {
                this.saveSettingsCallback(resp);
            },
            error: (error) => {
                if (error.error.errors.email[0] === 'notUnique') {
                    this.settingsForm.get('spotbieEmail').setErrors({ notUnique: true });
                }
                this.spotbieSettingsInfoText$.next(`
                    <span class='spotbie-text-gradient spotbie-error'>
                        There was an error saving.
                    </span>
                `);
                this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);
                this.loading$.next(false);
            },
        });
    }
    cancelDeactivateAccount() {
        this.accountDeactivation$.next(false);
    }
    startDeactivateAccount() {
        this.accountDeactivation$.next(true);
        const deactivationPasswordValidator = [forms_1.Validators.required];
        this.deactivationForm = this.formBuilder.group({
            spotbieDeactivationPassword: ['', deactivationPasswordValidator],
        });
        this.deactivationForm
            .get('spotbieDeactivationPassword')
            .setValue('123456789');
    }
    deactivateAccount() {
        const r = confirm('Are you sure you want to deactivate your account?');
        if (!r) {
            return;
        }
        if (this.loading$.getValue()) {
            return;
        }
        this.loading$.next(true);
        if (this.deactivationForm.invalid) {
            this.spotbieAccountDeactivationInfo.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            return;
        }
        const deactivationPassword = this.deactivationPassword;
        this.userAuthService
            .deactivateAccount(deactivationPassword, this.isSocialAccount$.getValue())
            .subscribe(resp => {
            this.deactivateCallback(resp);
        });
    }
    closeWindow() {
        this.closeWindowEvt.emit();
    }
    populateSettings(settingsResponse) {
        if (settingsResponse.success) {
            this.user$.next({
                ...settingsResponse.user,
                spotbie_user: settingsResponse.spotbie_user,
                uuid: settingsResponse.user.hash,
            });
            this.settingsFormInitiated$.next(true);
            this.settingsForm
                .get('spotbieUsername')
                .setValue(this.user$.getValue().username);
            this.settingsForm
                .get('spotbieFirstName')
                .setValue(this.user$.getValue().spotbie_user.first_name);
            this.settingsForm
                .get('spotbieLastName')
                .setValue(this.user$.getValue().spotbie_user.last_name);
            this.settingsForm
                .get('spotbieEmail')
                .setValue(this.user$.getValue().email);
            this.settingsForm
                .get('spotbiePhoneNumber')
                .setValue(this.user$.getValue().spotbie_user.phone_number);
        }
        else {
            console.log('Settings Error: ', settingsResponse);
        }
        this.loading$.next(false);
    }
    passwordChangeCallback(resp) {
        if (resp.success) {
            switch (resp.message) {
                case 'saved':
                    this.spotbieSettingsInfoText$.next('Your password was updated.');
                    this.passwordForm.get('spotbieCurrentPassword').setValue(null);
                    this.passwordForm.get('spotbiePassword').setValue(null);
                    this.passwordForm.get('spotbieConfirmPassword').setValue(null);
                    this.passwordSubmitted$.next(false);
                    this.savePasswordBool$.next(false);
                    break;
            }
            this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);
        }
        else {
            switch (resp.message) {
                case 'SB-E-000':
                    // server error
                    this.currentPasswordInfoText$.next('You entered the incorrect current password.');
                    break;
            }
        }
        this.loading$.next(false);
    }
    async initSettingsForm(action) {
        const usernameValidators = [forms_1.Validators.required, forms_1.Validators.maxLength(135)];
        const firstNameValidators = [forms_1.Validators.required, forms_1.Validators.maxLength(72)];
        const lastNameValidators = [forms_1.Validators.required, forms_1.Validators.maxLength(72)];
        const emailValidators = [
            forms_1.Validators.email,
            forms_1.Validators.required,
            forms_1.Validators.maxLength(135),
        ];
        const phoneValidators = [];
        const passwordValidators = [forms_1.Validators.required];
        const passwordConfirmValidators = [forms_1.Validators.required];
        const settingsFormInputObj = {
            spotbieUsername: ['', usernameValidators],
            spotbieFirstName: ['', firstNameValidators],
            spotbieLastName: ['', lastNameValidators],
            spotbieEmail: ['', emailValidators],
            spotbiePhoneNumber: ['', phoneValidators],
        };
        switch (action) {
            case 'personal':
                this.settingsForm = this.formBuilder.group(settingsFormInputObj, {
                    validators: [
                        (0, username_validator_1.ValidateUsername)('spotbieUsername'),
                        (0, name_validator_1.ValidatePersonName)('spotbieFirstName'),
                        (0, name_validator_1.ValidatePersonName)('spotbieLastName'),
                    ],
                });
                this.passwordForm = this.formBuilder.group({
                    spotbiePassword: ['', passwordValidators],
                    spotbieConfirmPassword: ['', passwordConfirmValidators],
                }, {
                    validators: [
                        (0, password_validator_1.ValidatePassword)('spotbiePassword'),
                        (0, must_match_validator_1.MustMatch)('spotbiePassword', 'spotbieConfirmPassword'),
                    ],
                });
                this.fetchCurrentSettings();
                break;
        }
    }
    fetchCurrentSettings() {
        this.userAuthService.getSettings().subscribe(resp => {
            this.populateSettings(resp);
        }, error => {
            console.log('Error', error);
        });
    }
    saveSettingsCallback(resp) {
        this.loading$.next(false);
        if (resp.success) {
            this.spotbieSettingsInfoText$.next('Your settings were saved.');
            this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);
            preferences_1.Preferences.set({ key: 'spotbie_userLogin', value: resp.user.username });
            preferences_1.Preferences.set({
                key: 'spotbie_userType',
                value: resp.user.spotbie_user.user_type,
            });
        }
        else {
            this.spotbieSettingsInfoText$.next('There was an error saving.');
        }
    }
    deactivateCallback(resp) {
        this.loading$.next(false);
        if (resp.success) {
            // Account has been deactivated. Let's log out.
            (0, logout_callback_1.logOutCallback)(resp);
        }
        else {
            console.log('deactivateCallback', resp);
        }
    }
};
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieSettingsInfoText')
], SettingsComponent.prototype, "spotbieSettingsInfoText", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbiePasswordInfoText')
], SettingsComponent.prototype, "spotbiePasswordInfoText", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('currentPasswordInfo')
], SettingsComponent.prototype, "spotbieCurrentPasswordInfoText", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieDeactivationInfo')
], SettingsComponent.prototype, "spotbieAccountDeactivationInfo", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieSettingsWindow')
], SettingsComponent.prototype, "spotbieSettingsWindow", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], SettingsComponent.prototype, "closeWindowEvt", void 0);
SettingsComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-settings',
        templateUrl: './settings.component.html',
        styleUrls: ['./settings.component.css'],
    })
], SettingsComponent);
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=settings.component.js.map