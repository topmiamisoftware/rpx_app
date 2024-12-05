import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {faEye} from "@fortawesome/free-solid-svg-icons";
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

  constructor(
    private modalCtrl: ModalController,
    private meetUpService: MeetupService
  ) { }

  async findPeople() {
    this.findPeopleEvt.emit();
  }

  async myMeetUps() {
    this.meetUpService.myMeetUps().subscribe(async (resp: any) => {
      const modal = await this.modalCtrl.create({
        component: MyMeetUpListingComponent,
        componentProps: {
          meetUpListing: resp.meetUpListing
        }
      });

      modal.present();
    });
  }

  async startWizard() {
    this.spawnCategoriesEvt.emit(1);
  }

  ngOnInit() {

  }

  protected readonly faEye = faEye;
}
