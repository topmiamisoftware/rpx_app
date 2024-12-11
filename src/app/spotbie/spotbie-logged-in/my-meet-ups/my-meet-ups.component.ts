import {Component, EventEmitter, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {MeetupService} from "./services/meetup.service";
import {MyMeetUpListingComponent} from "./my-meet-up-listing/my-meet-up-listing.component";
import {MeetUp} from "./models";
import {format, parseISO} from "date-fns";

@Component({
  selector: 'app-my-meet-ups',
  templateUrl: './my-meet-ups.component.html',
  styleUrls: ['./my-meet-ups.component.scss'],
})
export class MyMeetUpsComponent  implements OnInit {

  @Output() findPeopleEvt = new EventEmitter(null);
  @Output() spawnCategoriesEvt = new EventEmitter(null);

  latestMeetUp$: WritableSignal<MeetUp> = signal(null);
  meetUpList$: WritableSignal<MeetUp[]> = signal(null);

  constructor(
    private modalCtrl: ModalController,
    private meetUpService: MeetupService
  ) { }

  async findPeople() {
    this.findPeopleEvt.emit();
  }

  async myMeetUpsModal() {
    const modal = await this.modalCtrl.create({
      component: MyMeetUpListingComponent,
      componentProps: {
        meetUpListing: this.meetUpList$(),
        latestMeetUp: this.latestMeetUp$()
      },
    });

    await modal.present();

    modal.addEventListener('didDismiss', (evt) => {
      if(evt.detail.role == 'get-started')
      this.startWizard();
    });
  }

  async startWizard() {
    this.spawnCategoriesEvt.emit(1);
  }

  myMeetUps() {
    this.meetUpService.myMeetUps().subscribe(async (resp: any) => {
      const theMeetUps: MeetUp[] = normalizeMeetUpList(resp.meetUpListing.data);
      this.latestMeetUp$.set(theMeetUps[0]);
      this.meetUpList$.set(theMeetUps);
    });
  }

  ngOnInit() {
      this.myMeetUps();
  }
}

function normalizeMeetUpList(meetUpList: MeetUp[]): MeetUp[] {
  return meetUpList.map(a => {
    const localTime = format(parseISO(a.time), "yyyy-MM-dd HH:mm:ss");
    return {
      ...a,
      time: localTime
    };
  });
}
