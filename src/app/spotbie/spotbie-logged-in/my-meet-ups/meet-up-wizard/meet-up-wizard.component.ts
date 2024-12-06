import {Component, OnInit, signal} from '@angular/core';
import {ActionSheetController, AlertController, ModalController, ToastController} from "@ionic/angular";
import {MyFriendsService} from "../../my-friends/my-friends.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, of} from "rxjs";
import {normalizeProfile, normalizeProfileFromSearch} from "../../my-friends/helpers";
import {MeetupService} from "../services/meetup.service";
import {filter, tap} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserauthService} from "../../../../services/userauth.service";
import {UTCDate} from "@date-fns/utc";


@Component({
  selector: 'app-meet-up-wizard',
  templateUrl: './meet-up-wizard.component.html',
  styleUrls: ['./meet-up-wizard.component.scss'],
})
export class MeetUpWizardComponent  implements OnInit {

  meetUpForm: UntypedFormGroup;
  submitted$ = new BehaviorSubject<boolean>(false);
  loading$ = new BehaviorSubject<boolean>(undefined);
  myFriendListing$ = new Observable<any>(null);
  meetUpFriendList$ = signal([]);
  contactImports$ = signal([]);
  showSearchResults$ = signal(null);
  searchTimeout;
  meetUpDateTime$ = signal(null);
  minDateValue$ = signal(
    new Date()
  );
  myUserId;
  business;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: UntypedFormBuilder,
    private meetUpService: MeetupService,
    private myFriendsService: MyFriendsService,
    private toastService: ToastController,
    private userAuthService: UserauthService,
    private actionSheetCtrl: ActionSheetController,
    private alertController: AlertController,
  ) {
    this.userAuthService.myId$
      .pipe(
        takeUntilDestroyed(),
        filter(f => !!f),
        tap((id) => {
          this.myUserId = id;
          this.getMyFriends();
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.initMeetUpForm();
  }

  async addToMeetUp(friendId, firstName) {
    let alert = await this.alertController.create({
      header: 'Already Added',
      message: `Do you really want to add ${firstName} to this meet up?`,
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
          handler: async (ev) => {
            if (this.meetUpFriendList$().find(a => a.id === friendId)) {
              alert = await this.alertController.create({
                header: 'Already Added',
                message: `You have already added ${firstName}.`,
                buttons: [{
                  text: 'Ok',
                  role: 'confirm',
                }],
              });

              await alert.present();
            }

            return;

            this.meetUpFriendList$.set([...this.meetUpFriendList$(), friendId]);
          },
        },
        {
          text: 'No',
          role: 'cancel',
        }
      ],
    });

    await alert.present();
  }

  identify(index, item: any) {
    return item.id;
  }

  getMyFriends() {
    this.myFriendsService.getMyFriends()
      .subscribe(resp => {
        let dataWithCorrectProfiles = normalizeProfile(resp.friendList.data, this.myUserId);
        this.loading$.next(false);
        this.myFriendListing$ = of(dataWithCorrectProfiles);
      });
  }

  get meetUpName() {
    return this.meetUpForm.get('meetUpName').value;
  }
  get meetUpDescription() {
    return this.meetUpForm.get('meetUpDescription').value;
  }

  get f() {
    return this.meetUpForm.controls;
  }

  setDate(evt) {
    this.meetUpDateTime$.set(new UTCDate(evt.detail.value));
  }

  async actionSheet(friendProfile) {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Cancel',
          role: 'destructive',
          data: {
            action: 'cancel',
          },
        }
      ]
    });

    await actionSheet.present();

    await actionSheet.onDidDismiss().then((evt) => {
      if (evt.data.action === 'delete') {
        this.meetUpFriendList$.set(
          this.meetUpFriendList$().filter((f) => f.id !== friendProfile.id)
        );
      }
    });
  }

  initMeetUpForm() {
    const meetUpNameValidators = [Validators.required, Validators.max(25), Validators.min(1)];
    const meetUpDescriptionValidators = [Validators.required, Validators.max(350), Validators.min(1)];

    this.meetUpForm = this.formBuilder.group(
      {
        meetUpName: ['', meetUpNameValidators],
        meetUpDescription: ['', meetUpDescriptionValidators],
      },
    );
  }

  submitMeetUp() {
    this.loading$.next(true);
    this.submitted$.next(true);

    if (this.meetUpForm.invalid) {
      return false;
    }

    const meet_up_name = this.meetUpName;
    const meet_up_description = this.meetUpDescription;
    const friend_list = this.meetUpFriendList$().map(f => f.id);
    const business_id = this.business.id;
    const time = this.meetUpDateTime$();

    if (!time)  {
      alert("You need to set a time for this meet up.");
      return;
    }

    const req = {
      meet_up_name,
      meet_up_description,
      friend_list,
      business_id,
      time,
    };

    this.meetUpService.createMeetUp(req).subscribe(resp => {
      this.toastService.create({
        message: 'You have created a meet up.',
        duration: 5000,
        position: 'bottom'
      });
    });
  }

  searchFriends(evt) {
    if (evt.target.value === '') {
      return;
    }

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }

    this.searchTimeout = setTimeout(() => {
      this.myFriendsService.searchForUser(evt.target.value).pipe(
        tap((_) => this.loading$.next(true)),
      ).subscribe((resp) => {
        this.loading$.next(false);
        this.myFriendListing$ = of(normalizeProfileFromSearch(resp.matchingUserList));
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
      });
    }, 2500);
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
