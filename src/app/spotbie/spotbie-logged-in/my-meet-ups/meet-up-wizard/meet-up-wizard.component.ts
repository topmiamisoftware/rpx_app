import {Component, OnInit, signal} from '@angular/core';
import {ModalController, ToastController} from "@ionic/angular";
import {MyFriendsService} from "../../my-friends/my-friends.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, of} from "rxjs";
import {normalizeProfile} from "../../my-friends/helpers";
import {MeetupService} from "../services/meetup.service";

@Component({
  selector: 'app-meet-up-wizard',
  templateUrl: './meet-up-wizard.component.html',
  styleUrls: ['./meet-up-wizard.component.scss'],
})
export class MeetUpWizardComponent  implements OnInit {

  meetUpForm: UntypedFormGroup;
  creating$ = new BehaviorSubject<boolean>(false);
  submitted$ = new BehaviorSubject<boolean>(false);
  loading$ = new BehaviorSubject<boolean>(undefined);
  myFriendListing$ = new Observable<any>(null);

  searchResults$ = this.meetUpService.searchResults$;
  communityMemberList$ = this.meetUpService.communityMemberList$;

  meetUpFriendList$ = signal(false);
  businessId$ = signal(null);
  showSearchResults$ = signal(null);

  myUserId;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: UntypedFormBuilder,
    private meetUpService: MeetupService,
    private myFriendsService: MyFriendsService,
    private toastService: ToastController,
  ) { }

  ngOnInit() {
    this.initMeetUpForm();
    this.getFriends();
  }

  getFriends() {
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

  initMeetUpForm() {
    const meetUpNameValidators = [Validators.required];
    const meetUpDescriptionValidators = [Validators.required];

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
    const friend_list = this.meetUpFriendList$();
    const business_id = this.businessId$();

    const req = {
      meet_up_name,
      meet_up_description,
      friend_list,
      business_id
    };

    this.meetUpService.createMeetUp(req).subscribe(resp => {
      this.toastService.create({
        message: 'You have created a meet up.',
        duration: 5000,
        position: 'bottom'
      });
    });
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
