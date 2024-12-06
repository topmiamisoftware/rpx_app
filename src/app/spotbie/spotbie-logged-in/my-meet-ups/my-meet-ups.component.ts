import {Component, EventEmitter, OnInit, Output, signal} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {MeetupService} from "./services/meetup.service";
import {MyMeetUpListingComponent} from "./my-meet-up-listing/my-meet-up-listing.component";

@Component({
  selector: 'app-my-meet-ups',
  templateUrl: './my-meet-ups.component.html',
  styleUrls: ['./my-meet-ups.component.scss'],
})
export class MyMeetUpsComponent  implements OnInit {

  @Output() findPeopleEvt = new EventEmitter(null);
  @Output() spawnCategoriesEvt = new EventEmitter(null);

  latestMeetUp$ = signal(null);
  meetUpList$ = signal(null);

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

    modal.present();
  }

  async startWizard() {
    this.spawnCategoriesEvt.emit(1);
  }

  myMeetUps() {
    this.meetUpService.myMeetUps().subscribe(async (resp: any) => {
      const theMeetUps = resp.meetUpListing.data;
      this.latestMeetUp$.set(theMeetUps[0]);
      this.meetUpList$.set(theMeetUps);
    });
  }

  ngOnInit() {
      this.myMeetUps();
  }
}
