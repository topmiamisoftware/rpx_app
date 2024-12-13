import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {ActionSheetController, AlertController, ModalController, ToastController} from "@ionic/angular";
import {MyFriendsService} from "../../my-friends/my-friends.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, EMPTY, Observable, of} from "rxjs";
import {normalizeProfile, normalizeProfileFromFriendSearch, normalizeProfileFromSearch} from "../../my-friends/helpers";
import {MeetupService} from "../services/meetup.service";
import {filter, tap} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserauthService} from "../../../../services/userauth.service";
import {UTCDate} from "@date-fns/utc";
import {Business} from "../../../../models/business";
import {Capacitor} from "@capacitor/core";
import {AndroidSettings, NativeSettings} from "capacitor-native-settings";
import {IOSSettings} from "capacitor-native-settings/dist/esm/definitions";
import {ContactPayload, Contacts, PickContactResult} from "@capacitor-community/contacts";
import {Position} from "@capacitor/geolocation";


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
  searchFriendListing$ = new Observable<any>(undefined);
  meetUpFriendList$ = signal([]);
  contactImports$ = signal([]);
  showSearchResults$ = signal(null);
  searchTimeout;
  meetUpDateTime$ = signal(null);
  minDateValue$ = signal(
    new Date()
  );
  myUserId;
  business: Business;
  importContactList$: WritableSignal<ContactPayload[]> = signal([]);
  showEnablePermissions$ = signal(false);

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
    if (this.meetUpFriendList$().find(id => id === friendId)) {
      const a = await this.alertController.create({
        header: 'Already Added',
        message: `You have already added ${firstName}.`,
        buttons: [{
          text: 'Ok',
          role: 'confirm',
        }],
      });

      await a.present();

      return;
    }

    let alert = await this.alertController.create({
      header: '',
      message: `Do you really want to add ${firstName} to this meet up?`,
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
          handler: async (ev) => {
            this.meetUpFriendList$.set([...this.meetUpFriendList$(), friendId]);
            return;
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
        this.searchFriendListing$ = of(undefined);
      });
  }

  async enablePermissions() {
    if (Capacitor.getPlatform() === 'ios') {
      await NativeSettings.openIOS({
        option: IOSSettings.App,
      });
    } else if (Capacitor.getPlatform() === 'android') {
      await NativeSettings.openAndroid({
        option: AndroidSettings.Application,
      });
    }
  }

  showEnablePermissions() {
    this.showEnablePermissions$.set(true);
  }

  requestPermissions() {
    Contacts.requestPermissions().then((p) => {
      this.importContacts();
    });
  }


  async importContacts(skipCheck = false) {
    this.loading$.next(true);

    if (Capacitor.isNativePlatform()) {
      Contacts.checkPermissions().then((p) => {
        switch (p.contacts) {
          case "prompt-with-rationale":
          case "prompt":
            this.requestPermissions();
            break;
          case "denied":
            this.showEnablePermissions();
            break;
          case "granted":
            this.finishContactImport();
            break;
        }
      });
    }
  }

  async finishContactImport() {
    const projection = {
      // Specify which fields should be retrieved.
      name: true,
      phones: true,
      postalAddresses: true,
      image: true
    };

    const result: PickContactResult = await Contacts.pickContact({
      projection,
    });

    this.hyrdrateContacts(result);
    this.loading$.next(false);
  }

  hyrdrateContacts(contact: PickContactResult) {
    console.log('Hellowworld', contact);
    this.importContactList$.set([
      ...this.importContactList$(),
      contact.contact
    ]);
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
          role: 'cancel',
        }
      ]
    });

    await actionSheet.present();

    await actionSheet.onDidDismiss().then((evt) => {
      if (evt.data?.action === 'delete') {
        this.meetUpFriendList$.set(
          this.meetUpFriendList$().filter((f) => f.id !== friendProfile.id)
        );
      }

      return;
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
    const sbcm = this.business.is_community_member;

    const time = this.meetUpDateTime$();

    if (!time)  {
      this.toastService.create({
        message: 'You need to pick a time for the.',
        duration: 5000,
        position: 'bottom'
      });
      return;
    }

    const req = {
      meet_up_name,
      meet_up_description,
      friend_list,
      business_id,
      time,
      sbcm
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
      this.myFriendsService.searchForFriends(evt.target.value).pipe(
        tap((_) => this.loading$.next(true)),
      ).subscribe((resp) => {
        this.loading$.next(false);
        this.searchFriendListing$ = of(normalizeProfileFromFriendSearch(resp.matchingUserList, this.myUserId));
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
      });
    }, 2500);
  }

  showMyFriendsOnly() {
    this.myFriendsService.getMyFriends().pipe(
      tap((_) => this.loading$.next(true)),
    ).subscribe((resp) => {
      this.loading$.next(false);
      this.myFriendListing$ = of(normalizeProfile(resp.matchingUserList, this.myUserId));
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    });
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
