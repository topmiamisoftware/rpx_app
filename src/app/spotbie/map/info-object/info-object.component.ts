import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InfoObjectServiceService } from './info-object-service.service';
// import {MyFavoritesService} from '../../my-favorites/my-favorites.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DateFormatPipe,
  TimeFormatPipe,
} from '../../../pipes/date-format.pipe';
import { SpotbieMetaService } from '../../../services/meta/spotbie-meta.service';
import { setYelpRatingImage } from '../../../helpers/info-object-helper';
import { shareNative } from '../../../helpers/cordova/sharesheet';
import {
  spotbieMetaDescription,
  spotbieMetaTitle,
  spotbieMetaImage,
} from '../../../constants/spotbie';
import { InfoObject } from '../../../models/info-object';
import { environment } from '../../../../environments/environment';
import { Ad } from '../../../models/ad';
import { InfoObjectType } from '../../../helpers/enum/info-object-type.enum';
import { BehaviorSubject } from 'rxjs';
import { AppLauncher } from '@capacitor/app-launcher';

const YELP_BUSINESS_DETAILS_API = 'https://api.yelp.com/v3/businesses/';

const SPOTBIE_META_DESCRIPTION = spotbieMetaDescription;
const SPOTBIE_META_TITLE = spotbieMetaTitle;
const SPOTBIE_META_IMAGE = spotbieMetaImage;

@Component({
  selector: 'app-info-object',
  templateUrl: './info-object.component.html',
  styleUrls: ['./info-object.component.css'],
})
export class InfoObjectComponent implements OnInit {
  @Input() set info_object(infoObject: InfoObject) {
    this.accountType = infoObject.user_type;
    this.infoObject$.next(infoObject);
  }
  @Input() ad: Ad;
  @Input() fullScreenMode: boolean = false;
  @Input() lat: number = null;
  @Input() lng: number = null;
  @Input() accountType: string | number;
  @Input() eventsClassification: number = null;
  @Input() categories: number;

  @Output() closeWindow = new EventEmitter();
  @Output() removeFavoriteEvent = new EventEmitter();

  bgColor: string;
  loading$ = new BehaviorSubject(false);
  rewardMenuUp$ = new BehaviorSubject(false);
  urlApi: string;
  apiAction: string;
  infoObject$: BehaviorSubject<InfoObject> | null =
    new BehaviorSubject<InfoObject>(null);
  infoObjectImageUrl: string;
  private infoObjectCategory: number;
  showFavorites: boolean = true;
  isLoggedIn: string;
  infoObjectLink: string;
  infoObjectDescription: string;
  infoObjectTitle: string;
  successful_url_copy: boolean;
  objectCategories: string = '';
  objectDisplayAddress: string;
  eInfoObjectType: any = InfoObjectType;
  displayAds: boolean;

  constructor(
    private infoObjectService: InfoObjectServiceService,
    // private myFavoritesService: MyFavoritesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spotbieMetaService: SpotbieMetaService
  ) {}

  getFullScreenModeClass() {
    if (this.fullScreenMode) return 'fullScreenMode';
    else return '';
  }

  closeWindowX(): void {
    if (
      this.router.url.indexOf('event') > -1 ||
      this.router.url.indexOf('place-to-eat') > -1 ||
      this.router.url.indexOf('shopping') > -1 ||
      this.router.url.indexOf('community') > -1
    ) {
      this.router.navigate(['/home']);
    } else {
      this.closeWindow.emit(null);
      this.spotbieMetaService.setTitle(SPOTBIE_META_TITLE);
      this.spotbieMetaService.setDescription(SPOTBIE_META_DESCRIPTION);
      this.spotbieMetaService.setImage(SPOTBIE_META_IMAGE);
    }
  }

  private pullInfoObject(): void {
    if (this.router.url.indexOf('event') > -1) {
      const infoObjectId = this.activatedRoute.snapshot.paramMap.get('id');
      this.urlApi = `id=${infoObjectId}`;
    }

    const infoObjToPull = {
      config_url: this.urlApi,
    };

    if (this.router.url.indexOf('event') > -1) {
      this.infoObjectService.pullEventObject(infoObjToPull).subscribe(resp => {
        this.getEventCallback(resp);
      });
    } else {
      this.infoObjectService.pullInfoObject(infoObjToPull).subscribe(resp => {
        this.pullInfoObjectCallback(resp);
      });
    }
  }

  linkCopy(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, inputElement.value.length);
    this.successful_url_copy = true;

    setTimeout(() => {
      this.successful_url_copy = false;
    }, 2500);
  }

  private pullInfoObjectCallback(httpResponse: any): void {
    if (httpResponse.success) {
      const infoObject = httpResponse.data as InfoObject;
      infoObject.type_of_info_object_category = this.infoObjectCategory;

      if (infoObject.is_community_member) {
        this.infoObjectImageUrl =
          'assets/images/home_imgs/spotbie-green-icon.svg';
      } else {
        this.infoObjectImageUrl =
          'assets/images/home_imgs/spotbie-white-icon.svg';
      }

      if (
        this.router.url.indexOf('place-to-eat') > -1 ||
        infoObject.type_of_info_object_category === 1
      ) {
        infoObject.type_of_info_object = InfoObjectType.Yelp;
        infoObject.type_of_info_object_category = 1;
        this.infoObjectLink = `${environment.baseUrl}place-to-eat/${infoObject.alias}/${infoObject.id}`;
      }

      if (
        this.router.url.indexOf('shopping') > -1 ||
        infoObject.type_of_info_object_category === 2
      ) {
        infoObject.type_of_info_object = InfoObjectType.Yelp;
        infoObject.type_of_info_object_category = 2;
        this.infoObjectLink = `${environment.baseUrl}shopping/${infoObject.alias}/${infoObject.id}`;
      }

      if (
        this.router.url.indexOf('events') > -1 ||
        infoObject.type_of_info_object_category === 3
      ) {
        infoObject.type_of_info_object = InfoObjectType.TicketMaster;
        infoObject.type_of_info_object_category = 3;
        this.infoObjectLink = `${environment.baseUrl}event/${infoObject.alias}/${infoObject.id}`;
      }

      if (infoObject.is_community_member) {
        infoObject.type_of_info_object = InfoObjectType.SpotBieCommunity;
        infoObject.image_url = infoObject.photo;
        this.infoObjectLink = `${environment.baseUrl}${infoObject.name}/${infoObject.id}`;
      }

      if (infoObject.hours) {
        infoObject.hours.forEach(hours => {
          if (hours.hours_type === 'REGULAR') {
            infoObject.isOpenNow = hours.is_open_now;
          }
        });
      }

      if (infoObject.is_community_member) {
        this.objectDisplayAddress = `${infoObject.location.display_address[0]}, ${infoObject.location.display_address[1]}`;
      } else {
        this.objectDisplayAddress = infoObject.address;
      }

      infoObject.categories.forEach(category => {
        this.objectCategories = `${this.objectCategories}, ${category.title}`;
      });

      this.objectCategories = this.objectCategories.substring(
        2,
        this.objectCategories.length
      );

      switch (infoObject.type_of_info_object_category) {
        case 1:
          this.infoObjectTitle = `${infoObject.name} - ${this.objectCategories} - ${this.objectDisplayAddress}`;
          this.infoObjectDescription = `Let's go eat at ${infoObject.name}. I know you'll enjoy some of these categories ${this.objectCategories}. They are located at ${this.objectDisplayAddress}.`;
          break;
        case 2:
          this.infoObjectTitle = `${infoObject.name} - ${this.objectCategories} - ${this.objectDisplayAddress}`;
          this.infoObjectDescription = `I really recommend you go shopping at ${infoObject.name}!`;
          break;
      }

      infoObject.rating_image = setYelpRatingImage(infoObject.rating);

      this.spotbieMetaService.setTitle(this.infoObjectTitle);
      this.spotbieMetaService.setDescription(this.infoObjectDescription);
      this.spotbieMetaService.setImage(this.infoObjectImageUrl);

      this.infoObject$.next(infoObject);
      this.loading$.next(false);
      // this.isInMyFavorites(this.infoObject$.id, this.infoObject$.type_of_info_object)
    } else {
      console.log('pullInfoObjectCallback', httpResponse);
    }
  }

  /*private isInMyFavorites(objId: string, objType: string): void{
    if(this.isLoggedIn === '1'){
      this.myFavoritesService.isInMyFavorites(objId, objType).subscribe(
        resp =>{
          this.isInMyFavoritesCb(resp)
        }
      )
    } else {
      let isAFavorite = this.myFavoritesService.isInMyFavoritesLoggedOut(objId)
      if(isAFavorite)
        this.showFavorites = false
      else
        this.showFavorites = true
    }
  }

  private isInMyFavoritesCb(httpResponse: any): void{
    if (httpResponse.success) {
      let isAFavorite = httpResponse.is_a_favorite
      if(isAFavorite)
        this.showFavorites = false
      else
        this.showFavorites = true
    } else
      console.log('pullInfoObjectCallback', httpResponse)
    this.loading = false
  }*/

  async openWithGoogleMaps() {
    const confirmNav = confirm(
      "We will try to open and navigate on your device's default navigation app."
    );

    let displayAddress = '';

    this.infoObject$.getValue().location.display_address.forEach(element => {
      displayAddress = displayAddress + ' ' + element;
    });

    if (confirmNav) {
      await AppLauncher.openUrl({
        url: `http://www.google.com/maps/place/${displayAddress}`,
      });
    }

    return;
  }

  switchPhoto(thumbnail): void {
    this.infoObjectImageUrl = thumbnail;
  }

  async goToTicket() {
    await AppLauncher.openUrl({ url: this.infoObject$.getValue().url });
    return;
  }

  getTitleStyling(): string {
    let className = 'sb-titleGrey text-uppercase';
    if (this.infoObject$.getValue().is_community_member) {
      className = 'spotbie-text-gradient sb-titleGreen text-uppercase';
    }
    return className;
  }

  getCloseButtonStyling(): { color: string } {
    let style = { color: 'white' };
    if (!this.infoObject$.getValue().is_community_member) {
      style = { color: '#332f3e' };
    }
    return style;
  }

  getOverlayWindowStyling(): string {
    let className = 'spotbie-overlay-window infoObjectWindow has-header';
    if (this.infoObject$.getValue().is_community_member) {
      className = 'spotbie-overlay-window communityMemberWindow has-header';
    }
    return className;
  }

  getFontClasses(): string {
    let className = 'text-uppercase';
    if (this.infoObject$.getValue().is_community_member) {
      className = 'spotbie-text-gradient text-uppercase';
    }
    return className;
  }

  getIconTheme(): string {
    let className = 'material-light';
    if (this.infoObject$.getValue().is_community_member) {
      className = 'material-dark';
    }
    return className;
  }

  addFavorite(): void {
    /*    this.loading$.next(true);

    const id = this.infoObject$.id;
    const name = this.infoObject$.name;

    let locX = null;
    let locY = null;

    if (
      this.infoObject$.type_of_info_object === InfoObjectType.SpotBieCommunity
    ) {
      locX = this.infoObject$.loc_x;
      locY = this.infoObject$.loc_y;
    } else {
      locX = this.infoObject$.coordinates.latitude;
      locY = this.infoObject$.coordinates.longitude;
    }

    const favoriteObj = {
      third_party_id: id,
      name,
      description: null,
      loc_x: locX,
      loc_y: locY,
      type_of_info_object_category:
        this.infoObject$.type_of_info_object_category,
    };

    if (this.isLoggedIn === '1') {
      /!*this.myFavoritesService.addFavorite(favoriteObj).subscribe(
        resp => {
          this.addFavoriteCb(resp)
        }
      )*!/
    } else {
      //this.myFavoritesService.addFavoriteLoggedOut(favoriteObj)
      this.showFavorites = false;
      this.loading$.next(false);
    }*/
  }

  addFavoriteCb(resp: any): void {
    /*    if (resp.success) this.showFavorites = false;
    else console.log('addFavoriteCb', resp);

    this.loading$.next(false);*/
  }

  removeFavorite() {
    /*
    this.loading = true
    const yelpId = this.infoObject$.id

    if(this.isLoggedIn == '1'){
      this.myFavoritesService.removeFavorite(yelpId).subscribe(resp => {
          this.removeFavoriteCb(resp, yelpId)
        })
    } else {
      this.myFavoritesService.removeFavoriteLoggedOut(yelpId)
      this.removeFavoriteCb({success: true}, yelpId)
      this.loading = false
      this.showFavorites = true
    }
    */
  }

  removeFavoriteCb(resp, favoriteId: string) {
    /*    if (resp.success) {
      this.showFavorites = true;
      this.removeFavoriteEvent.emit({favoriteId: favoriteId});
    } else console.log('removeFavoriteCb', resp);
    this.loading$.next(false);*/
  }

  getEventCallback(httpResponse: any): void {
    const eventObject = httpResponse.data._embedded.events[0] ?? undefined;

    if (httpResponse.success && eventObject) {
      eventObject.coordinates = {
        latitude: '',
        longitude: '',
      };

      eventObject.coordinates.latitude = parseFloat(
        eventObject._embedded.venues[0].location.latitude
      );
      eventObject.coordinates.longitude = parseFloat(
        eventObject._embedded.venues[0].location.longitude
      );
      eventObject.icon = eventObject.images[0].url;
      eventObject.image_url = eventObject.images[8].url;
      eventObject.type_of_info_object = 'ticketmaster_event';

      const datetObj = new Date(eventObject.dates.start.localDate);
      const timeDate = new DateFormatPipe().transform(datetObj);
      const timeHr = new TimeFormatPipe().transform(
        eventObject.dates.start.localTime
      );

      eventObject.dates.start.spotbieDate = timeDate;
      eventObject.dates.start.spotbieHour = timeHr;

      this.infoObject$.next(eventObject);
      this.setEventMetaData();
    } else {
      console.log('getEventsSearchCallback Error: ', httpResponse);
    }

    this.loading$.next(false);
    return;
  }

  shareThisNative() {
    const message = this.infoObjectDescription;
    const subject = this.infoObjectTitle;
    const url = this.infoObjectLink;
    const chooserTitle = 'Pick an App!';

    shareNative(message, subject, url, chooserTitle);
  }

  setEventMetaData(): void {
    const infoObject = this.infoObject$.getValue();
    const alias = infoObject.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[-]+/g, '-')
      .replace(/[^\w-]+/g, '');
    const title = `${infoObject.name} at ${infoObject._embedded.venues[0].name}`;

    if (infoObject.is_community_member) {
      this.infoObjectImageUrl = `${environment.baseUrl}${infoObject.type_of_info_object_category}/${infoObject.id}`;
    } else {
      this.infoObjectLink = `${environment.baseUrl}event/${alias}/${infoObject.id}`;
    }

    this.infoObjectDescription = `Hey! Let's go to ${infoObject.name} together. It's at ${infoObject._embedded.venues[0].name} located in ${infoObject._embedded.venues[0].address.line1}, ${infoObject._embedded.venues[0].city.name} ${infoObject._embedded.venues[0].postalCode}. Prices range from $${infoObject.priceRanges[0].min} to $${infoObject.priceRanges[0].min}`;
    this.infoObjectTitle = title;

    this.spotbieMetaService.setTitle(title);
    this.spotbieMetaService.setDescription(this.infoObjectDescription);
    this.spotbieMetaService.setImage(infoObject.image_url);

    return;
  }

  async visitInfoObjectPage() {
    const infoObject = this.infoObject$.getValue();
    if (infoObject.type_of_info_object === InfoObjectType.Yelp) {
      await AppLauncher.openUrl({ url: `${infoObject.url}` });
    } else if (infoObject.type_of_info_object === InfoObjectType.TicketMaster) {
      this.goToTicket();
    }
    return;
  }

  getInputClass(): string {
    let className = 'sb-infoObjectInputDark';
    if (this.infoObject$.getValue().is_community_member) {
      className = 'sb-infoObjectInputLight';
    }
    return className;
  }

  clickGoToSponsored(): void {
    window.open('/business', '_blank');
    return;
  }

  ngOnInit() {
    this.loading$.next(true);

    this.bgColor = localStorage.getItem('spotbie_backgroundColor');
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn');

    const infoObject = this.infoObject$.getValue();

    if (infoObject) {
      this.infoObjectCategory = infoObject.type_of_info_object_category;

      switch (infoObject.type_of_info_object) {
        case InfoObjectType.Yelp:
          this.urlApi = YELP_BUSINESS_DETAILS_API + infoObject.id;
          break;
        case InfoObjectType.TicketMaster:
          this.loading$.next(false);
          return;
        case InfoObjectType.SpotBieCommunity:
          this.rewardMenuUp$.next(true);

          if (
            infoObject.user_type === 1 ||
            infoObject.user_type === 2 ||
            infoObject.user_type === 3
          ) {
            this.infoObjectLink = `${environment.baseUrl}community/${infoObject.qr_code_link}`;
          }

          this.loading$.next(false);
          return;
      }
    } else {
      if (
        this.router.url.indexOf('shopping') > -1 ||
        this.router.url.indexOf('place-to-eat') > -1 ||
        this.router.url.indexOf('events') > -1
      ) {
        const infoObjectId = this.activatedRoute.snapshot.paramMap.get('id');
        this.urlApi = YELP_BUSINESS_DETAILS_API + infoObjectId;
      }
    }
    this.pullInfoObject();
  }
}
