import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {ActionSheetController, AlertController, IonDatetime, ModalController, ToastController} from "@ionic/angular";
import {MyFriendsService} from "../../my-friends/my-friends.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, take} from "rxjs";
import {normalizeProfile, normalizeProfileFromFriendSearch} from "../../my-friends/helpers";
import {MeetupService} from "../services/meetup.service";
import {filter, map, tap} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserauthService} from "../../../../services/userauth.service";
import {UTCDate} from "@date-fns/utc";
import {Business} from "../../../../models/business";
import {Capacitor} from "@capacitor/core";
import {AndroidSettings, NativeSettings} from "capacitor-native-settings";
import {IOSSettings} from "capacitor-native-settings/dist/esm/definitions";
import {ContactPayload, Contacts, PickContactResult} from "@capacitor-community/contacts";
import {User} from "../../../../models/user";
import {MeetUp, MeetUpInvitation} from "../models";
import {formatInTimeZone} from 'date-fns-tz'

@Component({
  selector: 'app-meet-up-wizard',
  templateUrl: './meet-up-wizard.component.html',
  styleUrls: ['./meet-up-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetUpWizardComponent  implements OnInit {

  @ViewChild('meetUpDateTime') meetUpDateTime: ElementRef<IonDatetime>;

  @Input() set meetUp(meetUp: MeetUp) {
    if (meetUp) {
      this.meetUp$.next(meetUp);
      this.business = meetUp.business;
    }
  }

  meetUp$ = new BehaviorSubject<MeetUp>(undefined);
  meetUpForm: UntypedFormGroup;
  submitted$ = new BehaviorSubject<boolean>(false);
  loading$ = new BehaviorSubject<boolean>(undefined);
  // The visible list of ALL your SpotBie friends.
  myFriendListing$ = new BehaviorSubject<any>(undefined);
  // the listing that comes up when you <i>search</i> with the search bar.
  searchFriendListing$ = new BehaviorSubject<any>(undefined);
  // the meetup owner
  ownerProfile$ = new BehaviorSubject<User>(undefined);
  // Used to tell which users are going to the meet up. Friends that are invited.
  meetUpFriendList$ =  new BehaviorSubject<any>(undefined);
  private searchTimeout;

  meetUpDateTime$ = signal(new Date());
  // The minimum date value for the calendar
  minDateValue$ = signal(
    formatInTimeZone(new Date(), 'America/New_York', "yyyy-MM-dd'T'HH:mm:ssXXX")
  );
  myUserId: User['id'];
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
        tap((id: number) => {
          this.myUserId = id;
          this.getMyFriends();
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.initMeetUpForm();
  }

  convertToIso(time: string) {
    let c = new Date(time);
    const formattedDate = formatInTimeZone(c, 'America/New_York', "yyyy-MM-dd'T'HH:mm:ssXXX");
    console.log('formatteddate', formattedDate);
    return formattedDate;
  }

  hydrateMeetUpForm(meetUp: MeetUp) {
    this.meetUpForm.get('meetUpName').setValue(meetUp.name);
    this.meetUpForm.get('meetUpDescription').setValue(meetUp.description);
    this.meetUpDateTime$.set(new Date(meetUp.time));

    this.hydrateFriends(meetUp.invitation_list);
    this.hydrateOwner(meetUp.owner);
  }

  hydrateOwner(owner: MeetUp['owner']) {
    this.ownerProfile$.next(owner);
  }

  hydrateFriends(invitationList: MeetUpInvitation[]) {
    const friendList = invitationList.map(meetUpInvitation => ({
      user_profile:{ spotbie_user: meetUpInvitation.friend_profile },
      id: meetUpInvitation.friend_id
    }));

    this.meetUpFriendList$.next(friendList);
  }

  async addToMeetUp(friend, firstName: string) {
    debugger;

    const alreadyAdded = this.meetUpFriendList$.getValue()
      ?.filter(f => f.id === friend.id);

    let friendProfile = this.myFriendListing$.getValue()?.filter((a) => a.id === friend.id);
    if (!friendProfile) {
      friendProfile = this.searchFriendListing$.getValue()?.filter((a) => a.id === friend.id);
    }
    
    if (alreadyAdded?.length > 0) {
      const a = await this.alertController.create({
        header: 'Already Added',
        message: `You have already added ${firstName}.`,
        buttons: [{
          text: 'Ok',
          role: 'confirm',
        }],
      });

      await a.present();
    } else {
      const alert = await this.alertController.create({
        header: `Invite ${firstName}`,
        message: `Do you really want to add ${firstName} to this meet up?`,
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
          {
            text: 'Yes',
            role: 'confirm',
            handler: async (ev) => {
              if (this.meetUpFriendList$.getValue()?.length) {
                this.meetUpFriendList$.next([
                    ...this.meetUpFriendList$.getValue(),
                  ...friendProfile
                ]);
              } else {
                this.meetUpFriendList$.next([...friendProfile]);
              }

              console.log("The meetupfriendlist", this.meetUpFriendList$.getValue());
              return;
            },
          },
        ],
      });

      await alert.present();
    }

    return;
  }

  identify(index, item: any) {
    return item.id;
  }

  getMyFriends() {
    this.myFriendsService.getMyFriends()
      .subscribe(resp => {
        this.loading$.next(false);
        this.myFriendListing$.pipe(
          map( a =>
            normalizeProfile(resp.friendList.data, this.myUserId)
          ),
        )
        this.searchFriendListing$.next(null);
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

    if (
      Capacitor.isNativePlatform()
    ) {
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
        this.meetUpFriendList$.next(
          this.meetUpFriendList$.getValue().filter((f) => f.id !== friendProfile.id)
        );
      }

      return;
    });
  }

  initMeetUpForm() {
    const meetUpNameValidators = [Validators.required, Validators.max(35), Validators.min(1)];
    const meetUpDescriptionValidators = [Validators.required, Validators.max(350), Validators.min(1)];

    this.meetUpForm = this.formBuilder.group(
      {
        meetUpName: ['', meetUpNameValidators],
        meetUpDescription: ['', meetUpDescriptionValidators],
      },
    );

    this.meetUp$.pipe(
      take(1),
      filter(f => !!f),
      tap((meetUp: MeetUp) => {
        console.log("SET MEET UP", meetUp);
        this.hydrateMeetUpForm(meetUp);
      })
    ).subscribe();
  }

  async submitMeetUp() {
    this.loading$.next(true);
    this.submitted$.next(true);

    if (this.meetUpForm.invalid) {
      return false;
    }

    const meet_up_name = this.meetUpName;
    const meet_up_description = this.meetUpDescription;
    const friend_list = this.meetUpFriendList$.getValue().map(f => f.id);
    const business_id = this.business.id;
    const sbcm = this.business.is_community_member;
    const contact_list = this.importContactList$().map(c => (
      JSON.stringify({name: c.name.display, number: c.phones[0].number})
    ));

    const time = this.meetUpDateTime$();

    if (!time) {
      const a = await this.toastService.create({
        message: 'You need to pick a time for your meet up.',
        duration: 5000,
        position: 'bottom'
      });

      await a.present();
      return;
    }

    const req = {
      meet_up_name,
      meet_up_description,
      friend_list,
      business_id,
      sbcm,
      time,
      contact_list
    };

    if (!this.meetUp$.getValue()) {
      this.meetUpService.createMeetUp(req).subscribe(async resp => {
        const c = await this.toastService.create({
          message: 'You have created a meet up.',
          duration: 5000,
          position: 'bottom'
        });

        await c.present();

        setTimeout(() => {
          this.addedMeetUp();
        }, 1500);
      });
    } else {
      const editReq = {
        ...req,
        business_id: null,
        sbcm: null,
        id: this.meetUp$.getValue().id
      }
      this.editMeetUp(editReq, editReq.id);
    }
  }

  editMeetUp(req, id: MeetUp['id']) {
    this.meetUpService.editMeetUp(req, id ).subscribe(async resp => {
      const c = await this.toastService.create({
        message: 'You have edited your meet up.',
        duration: 5000,
        position: 'bottom'
      });

      await c.present();

      setTimeout(() => {
        this.addedMeetUp();
      }, 1500);
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
        this.searchFriendListing$.next(normalizeProfileFromFriendSearch(resp.matchingUserList, this.myUserId));
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
      });
    }, 2500);
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  addedMeetUp() {
    this.modalCtrl.dismiss(null, 'added-meetup');
  }
}
