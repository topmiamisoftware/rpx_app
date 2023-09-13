import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import {User} from '../../../models/user';
import {ValidatePassword} from '../../../helpers/password.validator';
import {MustMatch} from '../../../helpers/must-match.validator';
import {ValidateUsername} from '../../../helpers/username.validator';
import {ValidatePersonName} from '../../../helpers/name.validator';
import {UserauthService} from '../../../services/userauth.service';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {Preferences} from '@capacitor/preferences';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  @ViewChild('spotbieSettingsInfoText') spotbieSettingsInfoText: ElementRef;
  @ViewChild('spotbiePasswordInfoText') spotbiePasswordInfoText: ElementRef;
  @ViewChild('currentPasswordInfo') spotbieCurrentPasswordInfoText: ElementRef;
  @ViewChild('spotbieDeactivationInfo') spotbieAccountDeactivationInfo;
  @ViewChild('spotbieSettingsWindow') spotbieSettingsWindow;

  @Output() closeWindowEvt = new EventEmitter();

  settingsForm: FormGroup;
  passwordForm: FormGroup;
  savePasswordBool$ = new BehaviorSubject<boolean>(false);
  deactivationForm: FormGroup;
  accountDeactivation$ = new BehaviorSubject<boolean>(false);
  deactivationSubmitted$ = new BehaviorSubject<boolean>(false);
  loading$ = new BehaviorSubject<boolean>(false);
  user$ = new BehaviorSubject<User>(new User());
  submitted$ = new BehaviorSubject<boolean>(false);
  passwordSubmitted$ = new BehaviorSubject<boolean>(false);
  settingsFormInitiated$ = new BehaviorSubject<boolean>(false);
  isSocialAccount$ = new BehaviorSubject<boolean>(false);
  errorText$ = new BehaviorSubject<string>(null);
  spotbieSettingsInfoText$ = new BehaviorSubject<string>(null);
  currentPasswordInfoText$ = new BehaviorSubject<string>(
    'To complete the change, enter your CURRENT password.'
  );

  constructor(
    private formBuilder: FormBuilder,
    private userAuthService: UserauthService,
    private router: Router
  ) {}

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
    return this.passwordForm.get('spotbieConfirmPassword').value;
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

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.loading$.next(true);
    this.initSettingsForm('personal');
  }

  openWindow(window: any) {
    window.open$.next(true);
  }

  savePassword(): void {
    this.passwordSubmitted$.next(true);

    this.spotbiePasswordInfoText.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    if (this.passwordForm.invalid) {
      if (this.password !== this.confirmPassword) {
        console.log('confirm password error');
        this.errorText$.next('Passwords must match.');
        return;
      }
      return;
    }

    this.errorText$.next('Great, your passwords match!');

    this.savePasswordBool$.next(true);

    const currentPasswordValidators = [Validators.required];

    this.passwordForm.addControl(
      'spotbieCurrentPassword',
      new FormControl('', currentPasswordValidators)
    );

    this.passwordForm.get('spotbieCurrentPassword').setValue('123456789');
  }

  completeSavePassword(): void {
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
      currentPassword: this.confirmPassword,
    };

    this.userAuthService.passwordChange(savePasswordObj).subscribe(
      resp => {
        this.passwordChangeCallback(resp);
      },
      error => {
        console.log('error', error);
      }
    );
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
      error: (error: any) => {
        if (error.error.errors.email[0] === 'notUnique') {
          this.settingsForm.get('spotbieEmail').setErrors({notUnique: true});
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

  startDeactivateAccount(): void {
    this.accountDeactivation$.next(true);

    const deactivationPasswordValidator = [Validators.required];

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

    let deactivationPassword = null;

    if (!this.isSocialAccount$.getValue()) {
      if (this.deactivationForm.invalid) {
        this.spotbieAccountDeactivationInfo.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        return;
      }

      deactivationPassword = this.deactivationPassword;
    }

    this.userAuthService
      .deactivateAccount(deactivationPassword, this.isSocialAccount$.getValue())
      .subscribe(resp => {
        this.deactivateCallback(resp);
      });
  }

  closeWindow() {
    this.closeWindowEvt.emit();
  }

  private populateSettings(settingsResponse: any) {
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
    } else {
      console.log('Settings Error: ', settingsResponse);
    }

    this.loading$.next(false);
  }

  private passwordChangeCallback(resp: any) {
    if (resp.success) {
      switch (resp.message) {
        case 'saved':
          this.currentPasswordInfoText$.next('Your password was updated.');

          this.passwordForm.get('spotbieCurrentPassword').setValue('123456789');
          this.passwordForm.get('spotbiePassword').setValue('asdrqweee');
          this.passwordForm.get('spotbieConfirmPassword').setValue('asdeqweqq');

          setTimeout(() => {
            this.passwordSubmitted$.next(false);
            this.savePasswordBool$.next(false);
          }, 2000);
          break;
      }

      this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);
    } else {
      console.log(resp);
      switch (resp.message) {
        case 'SB-E-000':
          // server error
          this.savePasswordBool$.next(false);
          this.passwordSubmitted$.next(false);
          this.currentPasswordInfoText$.next(
            'You entered the incorrect current password.'
          );
          break;
      }
    }

    this.loading$.next(false);
  }

  private async initSettingsForm(action: string) {
    const usernameValidators = [Validators.required, Validators.maxLength(135)];
    const firstNameValidators = [Validators.required, Validators.maxLength(72)];
    const lastNameValidators = [Validators.required, Validators.maxLength(72)];
    const emailValidators = [
      Validators.email,
      Validators.required,
      Validators.maxLength(135),
    ];
    const phoneValidators = [];

    const passwordValidators = [Validators.required];
    const passwordConfirmValidators = [Validators.required];

    const settingsFormInputObj: any = {
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
            ValidateUsername('spotbieUsername'),
            ValidatePersonName('spotbieFirstName'),
            ValidatePersonName('spotbieLastName'),
          ],
        });

        this.passwordForm = this.formBuilder.group(
          {
            spotbiePassword: ['', passwordValidators],
            spotbieConfirmPassword: ['', passwordConfirmValidators],
          },
          {
            validators: [
              ValidatePassword('spotbiePassword'),
              MustMatch('spotbiePassword', 'spotbieConfirmPassword'),
            ],
          }
        );

        this.fetchCurrentSettings();
        break;
    }
  }

  private fetchCurrentSettings(): any {
    this.userAuthService.getSettings().subscribe(
      resp => {
        this.populateSettings(resp);
      },
      error => {
        console.log('Error', error);
      }
    );
  }

  private saveSettingsCallback(resp: any) {
    this.loading$.next(false);

    if (resp.success) {
      this.spotbieSettingsInfoText$.next('Your settings were saved.');

      this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);

      Preferences.set({key: 'spotbie_userLogin', value: resp.user.username});
      Preferences.set({
        key: 'spotbie_userType',
        value: resp.user.spotbie_user.user_type,
      });
    } else {
      this.spotbieSettingsInfoText$.next('There was an error saving.');
    }
  }

  private deactivateCallback(resp: any) {
    this.loading$.next(false);
    if (resp.success) {
      // Your account has been deactivated.
    } else {
      console.log('deactivateCallback', resp);
    }
  }
}
