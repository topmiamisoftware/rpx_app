import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {MeetUp} from "../models";
import {BehaviorSubject, Observable, of} from "rxjs";
import {ModalController} from "@ionic/angular";
import {MyFriendsService} from "../../my-friends/my-friends.service";
import {normalizeProfile} from "../../my-friends/helpers";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {filter, tap} from "rxjs/operators";
import {UserauthService} from "../../../../services/userauth.service";

@Component({
  selector: 'app-my-meet-up-listing',
  templateUrl: './my-meet-up-listing.component.html',
  styleUrls: ['./my-meet-up-listing.component.scss'],
})
export class MyMeetUpListingComponent  implements OnInit {

  @Output() moreListingsEvt = new EventEmitter(null);

  @Input() set meetUpListing(meetUpListing: { data: MeetUp[]}) {
    if (meetUpListing.data) {
      this.meetUpListing$ = of(meetUpListing);
    }
  }

  @Input() set latestMeetUp(latestMeetUp: { data: MeetUp[] }) {
    if (latestMeetUp?.data) {
      this.latestMeetUp$ = of(latestMeetUp);
    }
  }

  loading$= new BehaviorSubject(false);
  meetUpListing$: Observable<{ data: MeetUp[] }> = new Observable();
  latestMeetUp$: Observable<{ data: MeetUp[] }> = new Observable();
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
}
