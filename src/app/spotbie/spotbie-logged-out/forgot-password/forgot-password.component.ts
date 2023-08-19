import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import {ValidatePassword} from '../../../helpers/password.validator';
import {MustMatch} from '../../../helpers/must-match.validator';
import {UserauthService} from '../../../services/userauth.service';
import {ActivatedRoute, Router} from '@angular/router';

const DEF_INC_PASS_OR_EM_MSG = 'Please enter your e-mail address.';
const DEF_PIN_PASS_OR_EM_MSG = 'Check your e-mail for a reset link.';
const NEW_PASS_MSG = 'Enter Your New Password.';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  @Output() closeWindow = new EventEmitter();

  @ViewChild('getLinkMessage') getLinkMessage;

  passwordResetForm: UntypedFormGroup;
  passwordForm: UntypedFormGroup;
  passResetSubmitted = false;
  loading = false;
  passwordSubmitted = false;
  savePassword = false;
  stepOne = false;
  stepTwo = false;
  stepThree = false;
  stepFour = false;
  pinResetSubmitted = false;
  attemptsRemaining = 3;
  resetPin: string;
  pinReadyMsg: string = DEF_PIN_PASS_OR_EM_MSG;
  emailOrPhError: string = DEF_INC_PASS_OR_EM_MSG;
  newPasswordMsg: string = NEW_PASS_MSG;
  token: string;
  userEmail: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private userAuthService: UserauthService,
    private router: Router
  ) {}

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
    } else {
      this.initForgotPassForm();
      this.stepOne = true;
    }
  }

  closeWindowX(): void {
    this.closeWindow.emit(null);
  }

  setPassResetPin(): void {
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

  completeSavePassword(): void {
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
      .completeReset(
        this.spotbieResetPassword,
        this.spotbieResetPasswordC,
        this.userEmail,
        this.token
      )
      .subscribe(resp => {
        this.completeSavePasswordCb(resp);
      });
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  private completeSavePasswordCb(settingsResponse: any): void {
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
    } else {
      console.log(settingsResponse);
    }

    this.savePassword = false;
    this.loading = false;
  }

  private initForgotPassForm(): void {
    const spotbieEmailOrPhValidators = [
      Validators.required,
      Validators.maxLength(130),
    ];

    this.passwordResetForm = this.formBuilder.group({
      spotbieEmailOrPh: ['', spotbieEmailOrPhValidators],
    });
  }

  private startPassResetCb(httpResponse: any): void {
    if (httpResponse && httpResponse.success) {
      if (httpResponse.status === 'passwords.sent') {
        this.stepOne = false;
        this.showSuccess();
      } else if (httpResponse.status === 'passwords.throttled') {
        this.emailOrPhError =
          'You have sent too many password reset requests, please try again later.';
      } else if (httpResponse.status === 'social_account') {
        this.emailOrPhError = 'You signed up with social media.';
      } else {
        this.emailOrPhError = 'E-mail address not found.';
      }
    } else {
      this.emailOrPhError = 'I e-mail address.';
    }

    this.getLinkMessage.nativeElement.style.display = 'none';
    this.getLinkMessage.nativeElement.className =
      'spotbie-text-gradient spotbie-error spotbie-contact-me-info';
    this.getLinkMessage.nativeElement.style.display = 'block';

    this.loading = false;
  }

  private initPasswordForm(): void {
    this.stepThree = true;

    const passwordValidators = [Validators.required];
    const passwordConfirmValidators = [Validators.required];

    this.passwordForm = this.formBuilder.group(
      {
        spotbieResetPassword: ['', passwordValidators],
        spotbieResetPasswordC: ['', passwordConfirmValidators],
      },
      {
        validators: [
          ValidatePassword('spotbieResetPassword'),
          MustMatch('spotbieResetPassword', 'spotbieResetPasswordC'),
        ],
      }
    );
  }

  private showSuccess(): void {
    this.stepTwo = true;
  }
}
