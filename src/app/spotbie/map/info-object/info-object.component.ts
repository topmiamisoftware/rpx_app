import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {InfoObjectServiceService} from './info-object-service.service';
import {MyFavoritesService} from '../../my-favorites/my-favorites.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DateFormatPipe, TimeFormatPipe} from '../../../pipes/date-format.pipe';
import {SpotbieMetaService} from '../../../services/meta/spotbie-meta.service';
import {setYelpRatingImage} from '../../../helpers/info-object-helper';
import {shareNative} from '../../../helpers/cordova/sharesheet';
import {externalBrowserOpen} from '../../../helpers/cordova/web-intent';
import {
  spotbieMetaDescription,
  spotbieMetaTitle,
  spotbieMetaImage,
} from '../../../constants/spotbie';
import {InfoObject} from '../../../models/info-object';
import {environment} from '../../../../environments/environment';
import {Ad} from '../../../models/ad';
import {InfoObjectType} from '../../../helpers/enum/info-object-type.enum';

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
  @Input() info_object: InfoObject;
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
  loading: boolean;
  rewardMenuUp: boolean;
  urlApi: string;
  apiAction: string;
  infoObject: any = null;
  infoObjectImageUrl: string;
  private infoObjectCategory: string;
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
      this.info_object = httpResponse.data as InfoObject;
      this.info_object.type_of_info_object_category = this.infoObjectCategory;

      if (this.info_object.is_community_member)
        this.infoObjectImageUrl =
          'assets/images/home_imgs/spotbie-green-icon.svg';
      else
        this.infoObjectImageUrl =
          'assets/images/home_imgs/spotbie-white-icon.svg';

      if (
        this.router.url.indexOf('place-to-eat') > -1 ||
        this.info_object.type_of_info_object_category === 'food'
      ) {
        this.info_object.type_of_info_object = InfoObjectType.Yelp;
        this.info_object.type_of_info_object_category = 'food';
        this.infoObjectLink = `${environment.baseUrl}place-to-eat/${this.info_object.alias}/${this.info_object.id}`;
      }

      if (
        this.router.url.indexOf('shopping') > -1 ||
        this.info_object.type_of_info_object_category === 'shopping'
      ) {
        this.info_object.type_of_info_object = InfoObjectType.Yelp;
        this.info_object.type_of_info_object_category = 'shopping';
        this.infoObjectLink = `${environment.baseUrl}shopping/${this.info_object.alias}/${this.info_object.id}`;
      }

      if (
        this.router.url.indexOf('events') > -1 ||
        this.info_object.type_of_info_object_category === 'events'
      ) {
        this.info_object.type_of_info_object = InfoObjectType.TicketMaster;
        this.info_object.type_of_info_object_category = 'events';
        this.infoObjectLink = `${environment.baseUrl}event/${this.info_object.alias}/${this.info_object.id}`;
      }

      if (this.info_object.is_community_member) {
        this.info_object.type_of_info_object = InfoObjectType.SpotBieCommunity;
        this.info_object.image_url = this.info_object.photo;
        this.infoObjectLink = `${environment.baseUrl}${this.info_object.name}/${this.info_object.id}`;
      }

      if (this.info_object.hours !== undefined) {
        this.info_object.hours.forEach(hours => {
          if (hours.hours_type === 'REGULAR')
            this.info_object.isOpenNow = hours.is_open_now;
        });
      }

      if (this.info_object.is_community_member)
        this.objectDisplayAddress = `${this.info_object.location.display_address[0]}, ${this.info_object.location.display_address[1]}`;
      else this.objectDisplayAddress = this.info_object.address;

      this.info_object.categories.forEach(category => {
        this.objectCategories = `${this.objectCategories}, ${category.title}`;
      });

      this.objectCategories = this.objectCategories.substring(
        2,
        this.objectCategories.length
      );

      switch (this.info_object.type_of_info_object_category) {
        case 'food':
          this.infoObjectTitle = `${this.info_object.name} - ${this.objectCategories} - ${this.objectDisplayAddress}`;
          this.infoObjectDescription = `Let's go eat at ${this.info_object.name}. I know you'll enjoy some of these categories ${this.objectCategories}. They are located at ${this.objectDisplayAddress}.`;
          break;
        case 'shopping':
          this.infoObjectTitle = `${this.info_object.name} - ${this.objectCategories} - ${this.objectDisplayAddress}`;
          this.infoObjectDescription = `I really recommend you go shopping at ${this.info_object.name}!`;
          break;
      }

      this.info_object.rating_image = setYelpRatingImage(
        this.info_object.rating
      );

      this.spotbieMetaService.setTitle(this.infoObjectTitle);
      this.spotbieMetaService.setDescription(this.infoObjectDescription);
      this.spotbieMetaService.setImage(this.infoObjectImageUrl);

      this.loading = false;

      //this.isInMyFavorites(this.info_object.id, this.info_object.type_of_info_object)
    } else console.log('pullInfoObjectCallback', httpResponse);
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

  openWithGoogleMaps(): void {
    const confirmNav = confirm(
      "We will try to open and navigate on your device's default navigation app."
    );

    let displayAddress = '';

    this.info_object.location.display_address.forEach(element => {
      displayAddress = displayAddress + ' ' + element;
    });

    if (confirmNav)
      externalBrowserOpen(`http://www.google.com/maps/place/${displayAddress}`);
  }

  switchPhoto(thumbnail): void {
    this.infoObjectImageUrl = thumbnail;
  }

  goToTicket(): void {
    externalBrowserOpen(this.info_object.url);
  }

  getTitleStyling() {
    if (this.info_object.is_community_member)
      return 'spotbie-text-gradient sb-titleGreen text-uppercase';
    else return 'sb-titleGrey text-uppercase';
  }

  getCloseButtonStyling() {
    if (!this.info_object.is_community_member) return {color: '#332f3e'};
    else return {color: 'white'};
  }

  getOverlayWindowStyling() {
    if (this.info_object.is_community_member)
      return 'spotbie-overlay-window communityMemberWindow';
    else return 'spotbie-overlay-window infoObjectWindow';
  }

  getFontClasses() {
    if (this.info_object.is_community_member)
      return 'spotbie-text-gradient text-uppercase';
    else return 'text-uppercase';
  }

  getIconTheme() {
    if (this.info_object.is_community_member) return 'material-dark';
    else return 'material-light';
  }

  addFavorite(): void {
    this.loading = true;

    const id = this.info_object.id;
    const name = this.info_object.name;

    let locX = null;
    let locY = null;

    if (
      this.info_object.type_of_info_object === InfoObjectType.SpotBieCommunity
    ) {
      locX = this.info_object.loc_x;
      locY = this.info_object.loc_y;
    } else {
      locX = this.info_object.coordinates.latitude;
      locY = this.info_object.coordinates.longitude;
    }

    const favoriteObj = {
      third_party_id: id,
      name,
      description: null,
      loc_x: locX,
      loc_y: locY,
      type_of_info_object_category:
        this.info_object.type_of_info_object_category,
    };

    if (this.isLoggedIn === '1') {
      /*this.myFavoritesService.addFavorite(favoriteObj).subscribe(
        resp => {
          this.addFavoriteCb(resp)
        }
      )*/
    } else {
      //this.myFavoritesService.addFavoriteLoggedOut(favoriteObj)
      this.showFavorites = false;
      this.loading = false;
    }
  }

  addFavoriteCb(resp: any): void {
    if (resp.success) this.showFavorites = false;
    else console.log('addFavoriteCb', resp);

    this.loading = false;
  }

  removeFavorite() {
    /*
    this.loading = true
    const yelpId = this.info_object.id

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
    if (resp.success) {
      this.showFavorites = true;
      this.removeFavoriteEvent.emit({favoriteId: favoriteId});
    } else console.log('removeFavoriteCb', resp);
    this.loading = false;
  }

  getEventCallback(httpResponse: any): void {
    if (httpResponse.success) {
      if (httpResponse.data._embedded.events[0] === undefined) {
        this.loading = false;
        return;
      }

      const event_object = httpResponse.data._embedded.events[0];

      event_object.coordinates = {
        latitude: '',
        longitude: '',
      };

      event_object.coordinates.latitude = parseFloat(
        event_object._embedded.venues[0].location.latitude
      );
      event_object.coordinates.longitude = parseFloat(
        event_object._embedded.venues[0].location.longitude
      );
      event_object.icon = event_object.images[0].url;
      event_object.image_url = event_object.images[8].url;
      event_object.type_of_info_object = 'ticketmaster_event';

      const dt_obj = new Date(event_object.dates.start.localDate);
      const time_date = new DateFormatPipe().transform(dt_obj);
      const time_hr = new TimeFormatPipe().transform(
        event_object.dates.start.localTime
      );

      event_object.dates.start.spotbieDate = time_date;
      event_object.dates.start.spotbieHour = time_hr;

      this.info_object = event_object;

      this.setEventMetaData();
    } else console.log('getEventsSearchCallback Error: ', httpResponse);

    this.loading = false;
  }

  shareThisNative() {
    const message = this.infoObjectDescription;
    const subject = this.infoObjectTitle;
    const url = this.infoObjectLink;
    const chooserTitle = 'Pick an App!';

    shareNative(message, subject, url, chooserTitle);
  }

  setEventMetaData() {
    const alias = this.info_object.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[-]+/g, '-')
      .replace(/[^\w-]+/g, '');
    const title = `${this.info_object.name} at ${this.info_object._embedded.venues[0].name}`;

    if (this.info_object.is_community_member)
      this.infoObjectImageUrl = `${environment.baseUrl}${this.info_object.type_of_info_object_category}/${this.info_object.id}`;
    else
      this.infoObjectLink = `${environment.baseUrl}event/${alias}/${this.info_object.id}`;

    this.infoObjectDescription = `Hey! Let's go to ${this.info_object.name} together. It's at ${this.info_object._embedded.venues[0].name} located in ${this.info_object._embedded.venues[0].address.line1}, ${this.info_object._embedded.venues[0].city.name} ${this.info_object._embedded.venues[0].postalCode}. Prices range from $${this.info_object.priceRanges[0].min} to $${this.info_object.priceRanges[0].min}`;
    this.infoObjectTitle = title;

    this.spotbieMetaService.setTitle(title);
    this.spotbieMetaService.setDescription(this.infoObjectDescription);
    this.spotbieMetaService.setImage(this.info_object.image_url);
  }

  visitInfoObjectPage() {
    if (this.info_object.type_of_info_object === InfoObjectType.Yelp)
      externalBrowserOpen(`${this.info_object.url}`);
    else if (
      this.info_object.type_of_info_object === InfoObjectType.TicketMaster
    )
      this.goToTicket();
  }

  getInputClass() {
    if (this.info_object.is_community_member) return 'sb-infoObjectInputLight';
    else return 'sb-infoObjectInputDark';
  }

  clickGoToSponsored() {
    window.open('/business', '_blank');
  }

  showPosition(position: any): void {
    this.displayAds = true;
  }

  ngOnInit() {
    this.loading = true;

    this.bgColor = localStorage.getItem('spotbie_backgroundColor');
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn');

    if (this.info_object !== undefined) {
      this.infoObjectCategory = this.info_object.type_of_info_object_category;

      switch (this.info_object.type_of_info_object) {
        case InfoObjectType.Yelp:
          this.urlApi = YELP_BUSINESS_DETAILS_API + this.info_object.id;
          break;
        case InfoObjectType.TicketMaster:
          this.loading = false;
          return;
        case InfoObjectType.SpotBieCommunity:
          this.rewardMenuUp = true;

          if (this.info_object.user_type === 1)
            this.infoObjectLink =
              environment.baseUrl +
              'community/' +
              this.info_object.qr_code_link;
          else if (this.info_object.user_type === 2)
            this.infoObjectLink =
              environment.baseUrl +
              'community/' +
              this.info_object.qr_code_link;
          else if (this.info_object.user_type === 3)
            this.infoObjectLink =
              environment.baseUrl +
              'community/' +
              this.info_object.qr_code_link;
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
