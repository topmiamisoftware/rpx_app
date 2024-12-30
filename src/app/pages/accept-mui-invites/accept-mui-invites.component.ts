import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of, take} from "rxjs";
import {MeetupService} from "../../spotbie/spotbie-logged-in/my-meet-ups/services/meetup.service";
import {filter, tap} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {
  MeetUp,
  MeetUpInvitation,
  normalizeMeetUpList,
  spotBieToLocalTime
} from "../../spotbie/spotbie-logged-in/my-meet-ups/models";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FriendContact} from "../../spotbie/spotbie-logged-in/my-meet-ups/meet-up-wizard/meet-up-wizard.component";
import {ActionSheetController} from "@ionic/angular";
import {UserauthService} from "../../services/userauth.service";
import {SpotbieUser} from "../../models/spotbieuser";
import {InfoObject} from "../../models/info-object";
import {Business} from "../../models/business";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-accept-mui-invites',
  templateUrl: './accept-mui-invites.component.html',
  styleUrls: ['./accept-mui-invites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptMuiInvitesComponent  implements OnInit {

  userFullName$ = new BehaviorSubject<string>(null);
  userProfileList$ = new Observable<SpotbieUser[]>(null);
  $uuid = new Observable<string>();
  importContactList$ = new BehaviorSubject<FriendContact[]>([]);
  businessName$ =  new BehaviorSubject<string>(undefined);
  meetUpTime$ =  new BehaviorSubject<string>(undefined);
  meetUpLocation$ =  new BehaviorSubject<Business | InfoObject>(undefined);

  meetUpLink$ = new BehaviorSubject<string>(null);

  uuid: string;
  myUserId: string;

  constructor(
    private meetUpService: MeetupService,
    private route: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private changeDetectorRef: ChangeDetectorRef,
    private userAuthService: UserauthService,
  ) {
    this.$uuid = of(this.route.snapshot.params['uuid']);

    this.$uuid.pipe(
      filter(a => !!a),
      takeUntilDestroyed(),
    ).subscribe((uuid: string) => {
      this.uuid = uuid;
      this.showMeetUp(uuid);
      this.changeDetectorRef.markForCheck();
    });

    this.userAuthService.myId$
      .pipe(
        takeUntilDestroyed(),
        filter(f => !!f),
        tap((id: any) => {
          this.myUserId = id;
        })
      ).subscribe();
  }

  ngOnInit() {
  }

  identify(index, item: any) {
    return item.id;
  }

  private showMeetUp(uuid: string) {
    this.meetUpService.showMeetUpInvitation(uuid, this.myUserId).subscribe(
      (resp: {meetUpLocation: Business | InfoObject, meetUp: MeetUp, invitationList: MeetUpInvitation[], contactList: FriendContact[], userProfileList: any[], ownerProfile: SpotbieUser}) => {

      const theMeetUp = spotBieToLocalTime(resp.meetUp.time);

      console.log("Meet Up Time", resp.meetUpLocation);

      this.userProfileList$ = of(resp.userProfileList);
      this.importContactList$.next(resp.contactList);
      this.userFullName$.next(resp.ownerProfile.first_name);
      this.meetUpTime$.next(theMeetUp.localTime);
      this.meetUpLocation$.next(resp.meetUpLocation);

      console.log("The meetup ", resp.meetUpLocation);

      if ((resp.meetUpLocation as Business)?.slug) {
        let b = resp.meetUpLocation as Business;
        this.meetUpLink$.next(`${environment.baseUrl}/community/${b.qr_code_link}`);
      } else {
        let b = resp.meetUpLocation as InfoObject;
        this.meetUpLink$.next(`${environment.baseUrl}/community/${b.url}`);
      }
    });
  }

  yes(){
    this.meetUpService.acceptInvitation(this.uuid).pipe(
      tap((a) => {
        console.log("the response ", a );
      })
    ).subscribe();
  }
}
