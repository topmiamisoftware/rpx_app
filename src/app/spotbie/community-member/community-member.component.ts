import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Ad} from '../../models/ad';
import {Business} from '../../models/business';
import {BusinessMenuServiceService} from '../../services/spotbie-logged-in/business-menu/business-menu-service.service';
import {InfoObject} from "../../models/info-object";

@Component({
  selector: 'app-community-member',
  templateUrl: './community-member.component.html',
  styleUrls: ['./community-member.component.css'],
})
export class CommunityMemberComponent implements OnInit {
  @Input() lat: number;
  @Input() lng: number;
  @Input() business: Business;
  @Input() ad: Ad;
  @Input() accountType: string = null;
  @Input() categories: number;
  @Input() editMode: boolean = false;
  @Input() eventsClassification: number = null;
  @Input() qrCodeLink: string = null;

  @Output() closeWindowEvt = new EventEmitter();

  infoObjectLoaded: boolean = false;
  fullScreenMode: boolean = false;
  infoObject: InfoObject;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private businessMenuService: BusinessMenuServiceService
  ) {}

  closeWindow() {
    this.closeWindowEvt.emit();
  }

  getCommunityMember() {
    const getCommunityMemberReqObj = {
      qrCodeLink: this.qrCodeLink,
    };

    this.businessMenuService
      .getCommunityMember(getCommunityMemberReqObj)
      .subscribe(resp => {
        this.business = resp.business;
        this.business.is_community_member = true;
        this.business.type_of_info_object = 'spotbie_community';
        this.business.loyalty_point_dollar_percent_value =
          this.business.loyalty_point_balance.loyalty_point_dollar_percent_value;
        this.business.rewardRate =
          this.business.loyalty_point_dollar_percent_value / 100;
        this.infoObject.business = this.business;
        this.infoObjectLoaded = true;
      });
  }

  ngOnInit(): void {
    if (this.router.url.indexOf('community') > -1) {
      this.qrCodeLink = this.activatedRoute.snapshot.paramMap.get('qrCode');
      this.fullScreenMode = true;
    }
    this.getCommunityMember();
  }
}
