import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
import {ModalController} from "@ionic/angular";
import {MyFriendsService} from "../../my-friends/my-friends.service";
import {normalizeProfile} from "../../my-friends/helpers";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {filter, tap} from "rxjs/operators";
import {UserauthService} from "../../../../services/userauth.service";
import {MeetUp} from "../models";
import {MeetUpWizardComponent} from "../meet-up-wizard/meet-up-wizard.component";

@Component({
  selector: 'app-my-meet-up-listing',
  templateUrl: './my-meet-up-listing.component.html',
  styleUrls: ['./my-meet-up-listing.component.scss'],
})
export class MyMeetUpListingComponent implements OnInit {

  @Output() moreListingsEvt = new EventEmitter(null);

  meetUpListing$: Observable<MeetUp[]> = new Observable(null);
  @Input() set meetUpListing(meetUpListing: MeetUp[]) {
    if (meetUpListing) {
      this.meetUpListing$ = of(meetUpListing);
    }
  }

  latestMeetUp$: Observable<any> = new Observable();
  @Input() set latestMeetUp(latestMeetUp: any) {
    if (latestMeetUp) {
      this.latestMeetUp$ = of(latestMeetUp);
    }
  }

  loading$= new BehaviorSubject(false);
  friendListing$: Observable<any> = new Observable(null);
  myUserId;

  constructor(
    private modalCtrl: ModalController,
    private myFriendsService: MyFriendsService,
    private userAuthService: UserauthService,
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

  }

  findFriends() {
    this.modalCtrl.dismiss(null, 'find-friends');
  }

  getStarted() {
    this.modalCtrl.dismiss(null, 'get-started');
  }

  getMyFriends() {
    this.myFriendsService.getMyFriends().subscribe(resp => {
      let dataWithCorrectProfiles = normalizeProfile(resp.friendList.data, this.myUserId);
      this.loading$.next(false);
      this.friendListing$ = of(dataWithCorrectProfiles);
    });
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async openMeetUp(meetUp: MeetUp) {
    const modal = await this.modalCtrl.create({
      component: MeetUpWizardComponent,
      componentProps: {
        meetUp: meetUp
      }
    });

    await modal.present();
  }
}
