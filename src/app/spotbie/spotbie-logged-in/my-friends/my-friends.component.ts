import {AfterViewInit, Component, OnInit, signal} from '@angular/core';
import {BehaviorSubject, debounce, debounceTime, interval, Observable, of} from "rxjs";
import {ToastController} from "@ionic/angular";
import {Capacitor} from "@capacitor/core";
import {Geolocation, Position} from "@capacitor/geolocation";
import {FRIENDSHIP_STATUS_E, MyFriendsService} from "./my-friends.service";
import {getRandomInt} from "../../../helpers/numbers.helper";
import {UserauthService} from "../../../services/userauth.service";
import {filter, tap} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {normalizeProfile} from "./helpers";

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.scss'],
})
export class MyFriendsComponent {

  myFriendListing$ = new Observable<any>(null);
  mySearchResultList$ = new Observable<any>(null);
  position$ = new BehaviorSubject<Position>(null);
  loading$ = new BehaviorSubject<boolean>(false);
  FRIENDSHIP_STATUS_E = FRIENDSHIP_STATUS_E;
  myUserId;
  searchTimeout;

  quote$ = signal(null);

  constructor(
    private toastService: ToastController,
    private friendshipService: MyFriendsService,
    private userAuthService: UserauthService
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

  sharedExperiencesExternal() {

  }

  meetUpExternal() {

  }

  identify(index, item: any) {
    return item.id;
  }

  searchFriends(evt) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }

    this.searchTimeout = setTimeout(() => {
      this.friendshipService.searchForUser(evt.target.value)
        .subscribe((resp) => {
          this.setQuote();
          this.loading$.next(false);
          this.mySearchResultList$ = of(resp.matchingUserList);
          clearTimeout(this.searchTimeout);
          this.searchTimeout = null;
        });
    }, 2500);
  }

  async getStarted() {
    this.loading$.next(true);

    if (Capacitor.isNativePlatform()) {
      const coordinates = await Geolocation.getCurrentPosition();
      this.position$.next(coordinates);
      this.getNearby();
    } else {
      window.navigator.geolocation.getCurrentPosition(
        async position => {
          this.position$.next(position);
          this.getNearby();
        },
        err => {
          console.log(err);
          this.toastService.create({
            message: 'There was an error getting your GPS signal. Check your app permissions.',
            duration: 5000,
            position: 'bottom'
          })
        }
      );
    }
  }

  unblockFriend(id, firstName) {
    const c = confirm(`Do you want to unblock ${firstName}?`);

    if (!c) {
      return;
    }

    this.loading$.next(true);

    this.friendshipService.removeFriend(id).subscribe(r => {
      this.toastService.create({
        message: `${firstName} has been unblocked.`,
        duration: 5000,
        position: 'bottom'
      });
      this.getMyFriends();
    });
  }

  removeFriend(id, firstName) {
    const c = confirm(`Do you want to remove ${firstName} from your friend list?`);

    if (!c) {
      return;
    }

    this.loading$.next(true);

    this.friendshipService.removeFriend(id).subscribe(r => {
      this.toastService.create({
        message: `${firstName} has been removed from your friend list.`,
        duration: 5000,
        position: 'bottom'
      });
      this.getMyFriends();
    });
  }

  blockFriend(id, firstName) {
    const c = confirm(`Do you want to block ${firstName}?`);

    if (!c) {
      return;
    }

    this.loading$.next(true);

    this.friendshipService.blockFriend(id).subscribe(r => {
      this.toastService.create({
        message: `${firstName} has been blocked. They won't see you.`,
        duration: 5000,
        position: 'bottom'
      });
      this.getMyFriends();
    });
  }


  acceptFriendRequest(friendId, firstName) {
    const c = confirm(`Do you want to accept ${firstName} as a friend?`);

    if (!c) {
      return;
    }

    this.loading$.next(true);

    this.friendshipService.acceptFriend(friendId).subscribe(async (resp) => {
      await this.toastService.create({
        message: 'Friend request accepted.',
        duration: 5000,
        position: 'bottom'
      });
      this.getMyFriends();
    });
  }

  getMyFriends() {
    this.loading$.next(true);

    this.friendshipService.getMyFriends()
      .subscribe(resp => {
        const dataWithCorrectProfiles= normalizeProfile(resp.friendList.data, this.myUserId);
        this.loading$.next(false);
        this.myFriendListing$ = of(dataWithCorrectProfiles);
      });
  }

  getNearby() {
    this.loading$.next(true);
    const coords = this.position$.getValue();

    this.friendshipService.randomNearby(coords.coords.latitude, coords.coords.longitude)
      .subscribe(resp => {
        this.setQuote();
        this.loading$.next(false);
        this.mySearchResultList$ = of(resp.matchingUserList);
      });
  }

  addFriend(friendId, firstName) {
    const c = confirm(`Do you want to add ${firstName} as a friend?`);

    if (c) {
      this.loading$.next(true);
      this.friendshipService.addFriend(friendId).subscribe(resp => {
        this.toastService.create({
          message: "Your friend request has been sent.",
          duration: 5000,
          position: 'bottom'
        });
        this.getMyFriends();
      });
    }

    return;
  }

  setQuote() {
    this.quote$.set(
      RETRY_QUOTES[getRandomInt(0, RETRY_QUOTES.length - 1)]
    );
  }
}

const RETRY_QUOTES = [
  'TRY AGAIN',
];


