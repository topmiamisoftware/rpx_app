import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';
import {
  metersToMiles,
  setYelpRatingImage,
} from '../../helpers/info-object-helper';
import {Gesture, GestureController} from '@ionic/angular';
import {Capacitor, Plugins} from '@capacitor/core';
import {DateFormatPipe, TimeFormatPipe} from '../../pipes/date-format.pipe';
import {MapObjectIconPipe} from '../../pipes/map-object-icon.pipe';
import {LocationService} from '../../services/location-service/location.service';
import * as map_extras from './map_extras/map_extras';
import {FOOD_CATEGORIES, SHOPPING_CATEGORIES} from './map_extras/map_extras';
import * as sorterHelpers from '../../helpers/results-sorter.helper';
import {UserDashboardComponent} from '../spotbie-logged-in/user-dashboard/user-dashboard.component';
import {SortOrderPipe} from '../../pipes/sort-order.pipe';
import {Business} from '../../models/business';
import {BottomAdBannerComponent} from '../ads/bottom-ad-banner/bottom-ad-banner.component';
import {HeaderAdBannerComponent} from '../ads/header-ad-banner/header-ad-banner.component';
import {environment} from '../../../environments/environment';
import {Observable, BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {DeviceDetectorService} from 'ngx-device-detector';
import MapOptions = google.maps.MapOptions;
import MarkerOptions = google.maps.MarkerOptions;
import MapTypeStyle = google.maps.MapTypeStyle;
import {Platform} from '@ionic/angular';
import {InfoObject} from '../../models/info-object';
const {Geolocation, Toast} = Plugins;

const YELP_BUSINESS_SEARCH_API = 'https://api.yelp.com/v3/businesses/search';
const BANNED_YELP_IDS = map_extras.BANNED_YELP_IDS;
const SBCM_INTERVAL = 16000;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() business: boolean = false;
  @Input() spotType: any;

  @Output() signUpEvt = new EventEmitter();
  @Output() openBusinessSettingsEvt = new EventEmitter();

  @ViewChild('homeDashboard') homeDashboard: UserDashboardComponent;
  @ViewChild('featureWrapper') featureWrapper: ElementRef;
  @ViewChild('featureWrapperAnchor') featureWrapperAnchor: ElementRef;
  @ViewChild('scrollMapAppAnchor') scrollMapAppAnchor: ElementRef;
  @ViewChild('bottomAdBanner') bottomAdBanner: BottomAdBannerComponent = null;
  @ViewChild('singleAdApp') singleAdApp: HeaderAdBannerComponent = null;
  @ViewChild('categoryMenuSlide') categoryMenuSlide: ElementRef;

  loading$ = new BehaviorSubject<boolean>(false);

  private showOpenedParam: string;
  private n2_x = 0;
  private n3_x = 7;
  private rad_11 = null;
  private rad_1 = null;
  private finderSearchTimeout: any;
  private searchResultsOriginal: Array<any> = [];

  isLoggedIn: string;
  iconUrl: string;
  spotbieUsername: string;
  bgColor: string;
  userDefaultImage: string;
  searchResultsSubtitle: string;
  searchCategoriesPlaceHolder: string;
  sortByTxt: string = 'Distance';
  sortingOrder: string = 'asc';
  sortAc: number = 0;
  totalResults: number = 0;
  currentOffset: number = 0;
  itemsPerPage: number = 20;
  aroundMeSearchPage: number = 1;
  loadedTotalResults: number = 0;
  allPages: number = 0;
  maxDistanceCap: number = 45;
  maxDistance: number = 10;
  searchCategory: number;
  previousSearchCategory: number;
  searchCategorySorter: number;
  searchKeyword: string;
  typeOfInfoObject: string;
  eventDateParam: string;
  sortEventDate: string = 'none';
  showingOpenedStatus: string = 'Showing Opened & Closed';
  searchApiUrl: string;
  center: google.maps.LatLngLiteral;
  width: string;
  lat: number;
  lng: number;
  ogLat: number;
  ogLng: number;
  fitBounds: boolean = false;
  zoom: number = 18;
  map: boolean = false;
  showSearchResults: boolean;
  showSearchBox: boolean;
  locationFound: boolean = false;
  sliderRight: boolean = false;
  catsUp$ = new BehaviorSubject(false);
  toastHelper: boolean = false;
  displaySurroundingObjectList: boolean = false;
  showNoResultsBox: boolean = false;
  showMobilePrompt: boolean = true;
  showMobilePrompt2: boolean = false;
  firstTimeShowingMap: boolean = true;
  showOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  noResults: boolean = false;
  currentSearchType = '0';
  surroundingObjectList = [];
  searchResults = [];
  eventCategories;
  eventClassifications = map_extras.EVENT_CATEGORIES;
  foodCategories = map_extras.FOOD_CATEGORIES;
  shoppingCategories = map_extras.SHOPPING_CATEGORIES;
  numberCategories: number;
  bottomBannerCategories: number;
  mapStyles = map_extras.MAP_STYLES;
  infoObject$: any = new BehaviorSubject(null);
  currentMarker: any;
  categories: any;
  myFavoritesWindow = {open: false};
  updateDistanceTimeout: any;
  subCategory: any = {
    food_sub: {open: false},
    media_sub: {open: false},
    artist_sub: {open: false},
    place_sub: {open: false},
  };
  placesToEat: boolean = false;
  eventsNearYou: boolean = false;
  reatailShop: boolean = false;
  usersAroundYou: boolean = false;
  isDesktop: boolean = false;
  isTablet: boolean = false;
  isMobile: boolean = false;
  loadingText: string = null;
  displayLocationEnablingInstructions: boolean = false;
  bannedYelpIDs = BANNED_YELP_IDS;
  communityMemberList: Array<Business> = [];
  eventsClassification: number = null;
  getSpotBieCommunityMemberListInterval: any = false;
  currentCategoryList: any;

  constructor(
    private locationService: LocationService,
    private deviceService: DeviceDetectorService,
    private mapIconPipe: MapObjectIconPipe,
    private httpClient: HttpClient,
    private platform: Platform,
    private gestureCtrl: GestureController
  ) {
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn');
    this.userDefaultImage = localStorage.getItem('spotbie_userDefaultImage');
    this.spotbieUsername = localStorage.getItem('spotbie_userLogin');
  }

  get markerOptions(): MarkerOptions {
    return {
      icon: this.iconUrl,
      draggable: false,
    };
  }

  ngOnInit() {
    this.isMobile = this.platform.is('mobile');
    this.isDesktop = this.platform.is('desktop');
    this.isTablet = this.platform.is('tablet');

    if (this.isDesktop || this.isTablet) {
      this.rad_11 = 0.00002;
    } else {
      this.rad_11 = 0.000014;
    }

    this.rad_1 = this.rad_11;
  }

  ngAfterViewInit() {
    if (this.isLoggedIn !== '1') {
      this.userDefaultImage = 'assets/images/guest-spotbie-user-01.svg';
      this.spotbieUsername = 'Guest';
    }
  }

  priceSortDesc(a, b) {
    a = a.price;
    b = b.price;

    if (!a) {
      return 1;
    } else if (!b) {
      return -1;
    }
    return a.length > b.length ? -1 : b.length > a.length ? 1 : 0;
  }

  deliverySort() {
    this.searchResults = this.searchResults.filter(
      searchResult => searchResult.transactions.indexOf('delivery') > -1
    );
  }

  pickUpSort() {
    this.searchResults = this.searchResults.filter(
      searchResult => searchResult.transactions.indexOf('pickup') > -1
    );
  }

  reservationSort() {
    this.searchResults = this.searchResults.filter(
      searchResult =>
        searchResult.transactions.indexOf('restaurant_reservation') > -1
    );
  }

  eventsToday() {
    this.sortEventDate = 'today';

    let startTime = new Date().toISOString().slice(0, 11);
    startTime = `${startTime}00:00:00Z`;

    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 1);

    let newEndTime = endTime.toISOString().slice(0, 11);
    newEndTime = `${newEndTime}00:00:00Z`;

    this.eventDateParam = `startEndDateTime=${startTime},${newEndTime}`;
    this.apiSearch(this.searchKeyword);
  }

  eventsThisWeekend() {
    this.sortEventDate = 'weekend';

    const startTime = this.nextWeekdayDate(new Date(), 5);

    let newStartTime = startTime.toISOString().slice(0, 11);
    newStartTime = `${newStartTime}00:00:00Z`;

    const endTime = this.nextWeekdayDate(new Date(), 1);

    let newEndTime = endTime.toISOString().slice(0, 11);
    newEndTime = `${newEndTime}00:00:00Z`;

    this.eventDateParam = `startEndDateTime=${newStartTime},${newEndTime}`;

    this.apiSearch(this.searchKeyword);
  }

  nextWeekdayDate(date, dayInWeek) {
    const ret = new Date(date || new Date());
    ret.setDate(ret.getDate() + ((dayInWeek - 1 - ret.getDay() + 7) % 7) + 1);
    return ret;
  }

  showOpen() {
    this.showOpened$.next(!this.showOpened$.getValue());

    if (!this.showOpened$.getValue()) {
      this.showingOpenedStatus = 'Show Opened and Closed';
      this.showOpenedParam = 'open_now=true';
    } else {
      this.showingOpenedStatus = 'Show Opened';
      const unixTime = Math.floor(Date.now() / 1000);
      this.showOpenedParam = `open_at=${unixTime}`;
    }

    this.apiSearch(this.searchKeyword);
  }

  updateDistance(evt: any): void {
    clearTimeout(this.updateDistanceTimeout);

    this.updateDistanceTimeout = setTimeout(() => {
      this.maxDistance = evt.value;

      if (this.showNoResultsBox) {
        this.apiSearch(this.searchKeyword);
      } else {
        const results = this.searchResultsOriginal.filter(
          searchResult => searchResult.distance < this.maxDistance
        );

        this.loadedTotalResults = results.length;
        this.searchResults = results;

        this.sortBy(this.sortAc);
      }
    }, 500);
  }

  sortBy(ac: number) {
    this.sortAc = ac;

    switch (ac) {
      case 0:
        this.sortByTxt = 'Distance';
        break;
      case 1:
        this.sortByTxt = 'Rating';
        break;
      case 2:
        this.sortByTxt = 'Reviews';
        break;
      case 3:
        this.sortByTxt = 'Price';
        break;
      case 4:
        this.sortByTxt = 'Delivery';
        break;
      case 5:
        this.sortByTxt = 'Pick-up';
        break;
      case 6:
        this.sortByTxt = 'Reservations';
        break;
      case 7:
        this.sortByTxt = 'Events Today';
        break;
      case 8:
        this.sortByTxt = 'Events This Weekend';
        break;
    }

    if (ac !== 4 && ac !== 5 && ac !== 6 && ac !== 7 && ac !== 8) {
      if (this.sortingOrder === 'desc') {
        this.sortingOrder = 'asc';
      } else {
        this.sortingOrder = 'desc';
      }
    }

    switch (ac) {
      case 0:
        //sort by distance
        if (this.sortingOrder === 'desc') {
          this.searchResults = this.searchResults.sort(
            sorterHelpers.distanceSortDesc
          );
        } else {
          this.searchResults = this.searchResults.sort(
            sorterHelpers.distanceSortAsc
          );
        }
        break;
      case 1:
        //sort by rating
        if (this.sortingOrder === 'desc') {
          this.searchResults = this.searchResults.sort(
            sorterHelpers.ratingSortDesc
          );
        } else {
          this.searchResults = this.searchResults.sort(
            sorterHelpers.ratingSortAsc
          );
        }
        break;
      case 2:
        //sort by reviews
        if (this.sortingOrder === 'desc') {
          this.searchResults = this.searchResults.sort(
            sorterHelpers.reviewsSortDesc
          );
        } else {
          this.searchResults = this.searchResults.sort(
            sorterHelpers.reviewsSortAsc
          );
        }
        break;
      case 3:
        //sort by price
        if (this.sortingOrder === 'desc') {
          this.searchResults = this.searchResults.sort(this.priceSortDesc);
        } else {
          this.searchResults = this.searchResults.sort(
            sorterHelpers.priceSortAsc
          );
        }
        break;
      case 4:
        //sort by delivery
        this.deliverySort();
        break;
      case 5:
        //sort by pick up
        this.pickUpSort();
        break;
      case 6:
        //sort by reservation
        this.reservationSort();
        break;
      case 7:
        //sort events by today
        this.eventsToday();
        break;
      case 8:
        //sort by this weekend
        this.eventsThisWeekend();
        break;
    }
  }

  classificationSearch(): void {
    this.loading$.next(true);
    this.locationService.getClassifications().subscribe(resp => {
      this.classificationSearchCallback(resp);
    });
  }

  classificationSearchCallback(httpResponse: any) {
    this.loading$.next(false);

    if (httpResponse.success) {
      const classifications: Array<any> =
        httpResponse.data._embedded.classifications;

      classifications.forEach(classification => {
        if (
          classification.type &&
          classification.type.name &&
          classification.type.name !== 'Undefined'
        ) {
          classification.name = classification.type.name;
        } else if (
          classification.segment &&
          classification.segment.name &&
          classification.segment.name !== 'Undefined'
        ) {
          classification.name = classification.segment.name;

          classification.segment._embedded.genres.forEach(genre => {
            genre.show_sub_sub = false;

            if (
              genre.name === 'Chanson Francaise' ||
              genre.name === 'Medieval/Renaissance' ||
              genre.name === 'Religious' ||
              genre.name === 'Undefined' ||
              genre.name === 'World'
            ) {
              classification.segment._embedded.genres.splice(
                classification.segment._embedded.genres.indexOf(genre),
                1
              );
            }
          });
        }

        if (classification.name !== undefined) {
          classification.show_sub = false;

          if (
            classification.name !== 'Donation' &&
            classification.name !== 'Parking' &&
            classification.name !== 'Transportation' &&
            classification.name !== 'Upsell' &&
            classification.name !== 'Venue Based' &&
            classification.name !== 'Event Style' &&
            classification.name !== 'Individual' &&
            classification.name !== 'Merchandise' &&
            classification.name !== 'Group'
          ) {
            this.eventCategories.push(classification);
          }
        }
      });

      this.eventCategories = this.eventCategories.reverse();

      this.catsUp$.next(true);
    } else {
      console.log('getClassifications Error ', httpResponse);
    }

    this.loading$.next(false);
  }

  showEventSubCategory(subCat: any) {
    if (
      subCat._embedded.subtypes !== undefined &&
      subCat._embedded.subtypes.length === 1
    ) {
      this.apiSearch(subCat.name);
      return;
    } else if (
      subCat._embedded.subgenres !== undefined &&
      subCat._embedded.subgenres.length === 1
    ) {
      this.apiSearch(subCat.name);
      return;
    }

    subCat.show_sub_sub = !subCat.show_sub_sub;
  }

  showEventSub(classification: any) {
    this.eventsClassification = this.eventClassifications.indexOf(
      classification.name
    );
    classification.show_sub = !classification.show_sub;
  }

  newKeyWord() {
    this.totalResults = 0;
    this.allPages = 0;
    this.currentOffset = 0;
    this.aroundMeSearchPage = 1;
    this.searchResults = [];
  }

  apiSearch(keyword: string, resetEventSorter = false) {
    this.loading$.next(true);
    this.searchKeyword = keyword;

    keyword = encodeURIComponent(keyword);

    this.communityMemberList = [];

    if (this.searchKeyword !== keyword) {
      this.newKeyWord();
    }

    if (resetEventSorter) {
      this.eventDateParam = undefined;
      this.sortEventDate = 'none';
    }

    let apiUrl: string;

    switch (this.searchCategory) {
      case 1: // food
        apiUrl = `${this.searchApiUrl}?latitude=${this.lat}&longitude=${this.lng}&term=${keyword}&categories=${keyword}&${this.showOpenedParam}&radius=40000&sort_by=rating&limit=20&offset=${this.currentOffset}`;
        this.numberCategories = this.foodCategories.indexOf(this.searchKeyword);
        break;
      case 2: // shopping
        apiUrl = `${this.searchApiUrl}?latitude=${this.lat}&longitude=${this.lng}&term=${keyword}&categories=${keyword}&${this.showOpenedParam}&radius=40000&sort_by=rating&limit=20&offset=${this.currentOffset}`;
        this.numberCategories = this.shoppingCategories.indexOf(
          this.searchKeyword
        );
        break;
      case 3: // events
        apiUrl = `size=2&latlong=${this.lat},${this.lng}&classificationName=${keyword}&radius=45&${this.eventDateParam}`;
        this.numberCategories = this.eventCategories.indexOf(
          this.searchKeyword
        );
        break;
    }

    const searchObj = {
      config_url: apiUrl,
    };

    const searchObjSb = {
      loc_x: this.lat,
      loc_y: this.lng,
      categories: JSON.stringify(this.numberCategories),
    };

    switch (this.searchCategory) {
      case 1:
      case 2:
        // Retrieve the third party API Yelp Results
        this.locationService.getBusinesses(searchObj).subscribe(resp => {
          this.getBusinessesSearchCallback(resp);
        });
        // Retrieve the SpotBie Community Member Results
        this.locationService
          .getSpotBieCommunityMemberList(searchObjSb)
          .subscribe(resp => {
            this.getSpotBieCommunityMemberListCb(resp);
          });
        break;
      case 3:
        // Retrieve the SpotBie Community Member Results
        this.locationService.getEvents(searchObj).subscribe(resp => {
          this.getEventsSearchCallback(resp);
        });

        // Retrieve the SpotBie Community Member Results
        this.locationService
          .getSpotBieCommunityMemberList(searchObjSb)
          .subscribe(resp => {
            this.getSpotBieCommunityMemberListCb(resp);
          });
        break;
    }
  }

  getMapOptions(): MapOptions {
    return {
      styles: this.mapStyles,
      zoom: this.zoom,
      gestureHandling: 'cooperative',
    };
  }

  openWelcome() {
    this.scrollMapAppAnchor.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    this.catsUp$.next(false);
    this.map = false;
    this.showSearchBox = false;
    this.showSearchResults = false;
    this.infoObject$.next(null);
    this.searchResults = [];
  }

  sortingOrderClass(sortingOrder: string) {
    return new SortOrderPipe().transform(sortingOrder);
  }

  async spawnCategories(category: number) {
    this.loading$.next(true);
    this.scrollMapAppAnchor.nativeElement.scrollIntoView();
    this.zoom = 18;
    this.fitBounds = false;
    this.infoObject$.next(null);

    if (!this.locationFound && Capacitor.isNativePlatform()) {
      Geolocation.getCurrentPosition(
        position => {
          this.map = true;
          this.showPosition(position);
        },
        err => {
          console.log(err);
          this.showMapError();
        }
      );
    } else if (!this.locationFound) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          this.showPosition(position);
        },
        err => {
          console.log(err);
          this.showMapError();
        }
      );
    }

    if (this.showMobilePrompt) {
      this.showMobilePrompt = false;
    }

    this.showSearchBox = true;

    if (this.searchResults.length === 0) {
      this.showSearchResults = false;
    }

    if (category === this.searchCategory) {
      this.catsUp$.next(true);
      this.loading$.next(false);
      return;
    }

    if (this.searchCategory) {
      this.previousSearchCategory = this.searchCategory;
    }

    console.log('this.searchCategory', this.searchCategory);

    switch (this.searchCategory) {
      case 1:
        // food
        this.searchApiUrl = YELP_BUSINESS_SEARCH_API;
        this.searchCategoriesPlaceHolder = 'Search Places to Eat...';
        this.categories = this.foodCategories;
        this.bottomBannerCategories = this.categories.indexOf(
          this.categories[Math.floor(Math.random() * this.categories.length)]
        );
        break;
      case 2:
        // shopping
        this.searchApiUrl = YELP_BUSINESS_SEARCH_API;
        this.searchCategoriesPlaceHolder = 'Search Shopping...';
        this.categories = this.shoppingCategories;
        this.bottomBannerCategories = this.categories.indexOf(
          this.categories[Math.floor(Math.random() * this.categories.length)]
        );
        break;
      case 3:
        // events
        this.eventCategories = [];
        this.searchCategoriesPlaceHolder = 'Search Events...';
        this.categories = this.eventCategories;
        this.bottomBannerCategories = this.categories.indexOf(
          this.categories[Math.floor(Math.random() * this.categories.length)]
        );
        this.classificationSearch();
        return;
    }

    this.catsUp$.next(true);

    const closeCategoryPicker: Gesture = this.gestureCtrl.create(
      {
        el: this.categoryMenuSlide.nativeElement,
        threshold: 15,
        gestureName: 'closeCategoryPicker',
        onMove: ev => this.catsUp$.next(false),
      },
      true
    );

    closeCategoryPicker.enable();
  }

  cleanCategory() {
    if (this.searchCategory !== this.previousSearchCategory) {
      this.searchResults = [];

      switch (this.searchCategory) {
        case 1: // food
        case 2: // shopping
          this.typeOfInfoObject = 'yelp_business';
          this.maxDistanceCap = 25;
          break;
        case 3: // events
          this.typeOfInfoObject = 'ticketmaster_events';
          this.maxDistanceCap = 45;
          return;
      }
    }
  }

  goToQrCode() {
    //scroll to qr Code
    this.closeCategories();
    this.openWelcome();

    setTimeout(() => {
      this.homeDashboard.scrollToQrAppAnchor();
    }, 750);
  }

  goToLp() {
    //scroll to loyalty points
    this.closeCategories();
    this.homeDashboard.scrollToLpAppAnchor();
  }

  goToRewardMenu() {
    //scroll to reward menu
    this.closeCategories();
    this.homeDashboard.scrollToRewardMenuAppAnchor();
  }

  closeCategories(): void {
    this.catsUp$.next(false);
  }

  searchSpotBie(evt: any): void {
    this.searchKeyword = evt.target.value;

    const searchTerm = encodeURIComponent(evt.target.value);

    clearTimeout(this.finderSearchTimeout);

    this.finderSearchTimeout = setTimeout(() => {
      this.loading$.next(true);

      let apiUrl: string;

      if (this.searchCategory === 3) {
        // Used for loading events from ticketmaster API
        apiUrl = `size=20&latlong=${this.lat},${this.lng}&keyword=${searchTerm}&radius=45`;

        const searchObj = {
          config_url: apiUrl,
        };

        this.locationService.getEvents(searchObj).subscribe(resp => {
          this.getEventsSearchCallback(resp);
        });
      } else {
        //Used for loading places to eat and shopping from yelp
        apiUrl = `${this.searchApiUrl}?latitude=${this.lat}&longitude=${this.lng}&term=${searchTerm}&${this.showOpenedParam}&radius=40000&sort_by=best_match&limit=20&offset=${this.currentOffset}`;

        const searchObj = {
          config_url: apiUrl,
        };

        this.locationService.getBusinesses(searchObj).subscribe(resp => {
          this.getBusinessesSearchCallback(resp);
        });

        const searchObjSb = {
          loc_x: this.lat,
          loc_y: this.lng,
          categories: this.searchKeyword,
        };

        //Retrieve the SpotBie Community Member Results
        this.locationService
          .getSpotBieCommunityMemberList(searchObjSb)
          .subscribe(resp => {
            this.getSpotBieCommunityMemberListCb(resp);
          });
      }
    }, 1500);
  }

  displayPageNext(page: number) {
    if (page < this.allPages) {
      return {};
    } else {
      return {display: 'none'};
    }
  }

  displayPage(page: number) {
    if (page > 0) {
      return {};
    } else {
      return {display: 'none'};
    }
  }

  goToPage(page: number) {
    this.aroundMeSearchPage = page;
    this.currentOffset =
      this.aroundMeSearchPage * this.itemsPerPage - this.itemsPerPage;
    this.apiSearch(this.searchKeyword);
    this.scrollMapAppAnchor.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  loadMoreResults(action: number) {
    switch (action) {
      case 0:
        //previous
        if (this.aroundMeSearchPage === 1) {
          this.aroundMeSearchPage = Math.ceil(
            this.totalResults / this.itemsPerPage
          );
        } else {
          this.aroundMeSearchPage--;
        }
        break;
      case 1:
        //next
        if (
          this.aroundMeSearchPage ===
          Math.ceil(this.totalResults / this.itemsPerPage)
        ) {
          this.aroundMeSearchPage = 1;
          this.currentOffset = 0;
        } else {
          this.aroundMeSearchPage++;
        }
        break;
    }

    this.currentOffset =
      this.aroundMeSearchPage * this.itemsPerPage - this.itemsPerPage;
    this.apiSearch(this.searchKeyword);
    this.scrollMapAppAnchor.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  hideSearchResults(): void {
    this.showSearchResults = !this.showSearchResults;
  }

  formatPhoneNumber(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      const intlCode = match[1] ? '+1 ' : '';
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
  }

  getMapWrapperClass() {
    if (this.showSearchResults) {
      return 'spotbie-map sb-map-results-open';
    } else {
      return 'spotbie-map';
    }
  }

  getMapClass() {
    if (this.showSearchResults) {
      return 'spotbie-agm-map sb-map-results-open';
    } else {
      if (this.isMobile) {
        return 'spotbie-agm-map sb-map-results-open';
      }
      return 'spotbie-agm-map';
    }
  }

  getEventsSearchCallback(httpResponse: any): void {
    this.loading$.next(false);

    if (httpResponse.success) {
      this.totalResults = httpResponse.data.page.totalElements;

      const eventObject = httpResponse.data;

      if (this.totalResults === 0 || !!eventObject._embedded) {
        this.showNoResultsBox = true;
        this.loading$.next(false);
        this.searchResults = [];
        return;
      } else {
        this.showNoResultsBox = false;
        this.sortEventDate = 'none';
      }

      this.cleanCategory();

      window.scrollTo(0, 0);

      this.showSearchResults = true;
      this.catsUp$.next(false);
      this.loading$.next(false);

      const eventObjectList = eventObject._embedded.events;

      this.totalResults = eventObjectList.length;

      this.allPages = Math.ceil(this.totalResults / this.itemsPerPage);

      if (this.allPages === 0) {
        this.allPages = 1;
      }

      for (let i = 0; i < eventObjectList.length; i++) {
        eventObjectList[i].coordinates = {
          latitude: '',
          longitude: '',
        };

        eventObjectList[i].coordinates.latitude = parseFloat(
          eventObjectList[i]._embedded.venues[0].location.latitude
        );
        eventObjectList[i].coordinates.longitude = parseFloat(
          eventObjectList[i]._embedded.venues[0].location.longitude
        );
        eventObjectList[i].icon = eventObjectList[i].images[0].url;
        eventObjectList[i].image_url = this.ticketMasterLargestImage(
          eventObjectList[i].images
        );
        eventObjectList[i].type_of_info_object = 'ticketmaster_event';

        const dtObj = new Date(eventObjectList[i].dates.start.localDate);

        const timeDate = new DateFormatPipe().transform(dtObj);
        const timeHr = new TimeFormatPipe().transform(
          eventObjectList[i].dates.start.localTime
        );

        eventObjectList[i].dates.start.spotbieDate = timeDate;
        eventObjectList[i].dates.start.spotbieHour = timeHr;

        this.searchResults.push(eventObjectList[i]);
      }

      this.sortingOrder = 'desc';
      this.sortBy(0);

      this.searchCategorySorter = this.searchCategory;
      this.searchResultsSubtitle = 'Events';
      this.searchResultsOriginal = this.searchResults;
      this.showSearchResults = true;

      this.displaySurroundingObjectList = false;
      this.showSearchBox = true;
      this.loadedTotalResults = this.searchResults.length;
      this.maxDistance = 45;
    } else {
      console.log('getEventsSearchCallback Error: ', httpResponse);
    }

    this.loading$.next(false);
  }

  ticketMasterLargestImage(imageList: any) {
    const largestDimension = Math.max.apply(
      Math,
      imageList.map(image => image.width)
    );

    const largestImage = imageList.find(
      image => image.width === largestDimension
    );

    return largestImage.url;
  }

  getSpotBieCommunityMemberListCb(httpResponse: any) {
    if (httpResponse.success) {
      const communityMemberList: Array<Business> = httpResponse.data;

      communityMemberList.forEach((business: Business) => {
        business.type_of_info_object = 'spotbie_community';
        business.is_community_member = true;

        switch (this.searchCategory) {
          case 1:
            if (!business.photo) {
              business.photo = 'assets/images/home_imgs/find-places-to-eat.svg';
            }
            this.currentCategoryList = this.foodCategories;
            break;
          case 2:
            if (!business.photo) {
              business.photo =
                'assets/images/home_imgs/find-places-for-shopping.svg';
            }
            this.currentCategoryList = this.shoppingCategories;
            break;
          case 3:
            if (!business.photo) {
              business.photo = 'assets/images/home_imgs/find-events.svg';
            }
            this.currentCategoryList = this.eventClassifications;
        }

        const cleanCategories = [];

        this.currentCategoryList.reduce(
          (
            previousValue: string,
            currentValue: string,
            currentIndex: number,
            array: string[]
          ) => {
            if (business.categories.indexOf(currentIndex) > -1) {
              cleanCategories.push(this.currentCategoryList[currentIndex]);
            }
            return currentValue;
          }
        );

        business.cleanCategories = cleanCategories.toString();
        business.rewardRate = business.loyalty_point_dollar_percent_value / 100;
      });

      this.communityMemberList = communityMemberList;

      if (this.getSpotBieCommunityMemberListInterval) {
        this.getSpotBieCommunityMemberListInterval = setInterval(() => {
          const searchObjSb = {
            loc_x: this.lat,
            loc_y: this.lng,
            categories: JSON.stringify(this.numberCategories),
          };

          // Retrieve the SpotBie Community Member Results
          this.locationService
            .getSpotBieCommunityMemberList(searchObjSb)
            .subscribe(resp => {
              this.getSpotBieCommunityMemberListCb(resp);
            });
        }, SBCM_INTERVAL);
      }
    }
  }

  getBusinessesSearchCallback(httpResponse: any): void {
    this.loading$.next(false);
    this.maxDistanceCap = 25;
    this.fitBounds = true;

    if (httpResponse.success) {
      this.totalResults = httpResponse.data.total;

      if (this.totalResults === 0) {
        this.showNoResultsBox = true;
        return;
      } else {
        this.showNoResultsBox = false;
      }

      window.scrollTo(0, 0);

      this.cleanCategory();

      this.showSearchResults = true;
      this.catsUp$.next(false);

      const placesResults = httpResponse.data;

      this.populateYelpResults(placesResults);

      this.searchCategorySorter = this.searchCategory;
      this.displaySurroundingObjectList = false;
      this.showSearchBox = true;
    } else {
      console.log('Place Search Error: ', httpResponse);
    }
  }

  pullSearchMarker(infoObject: any): void {
    this.infoObject$.next(infoObject);
  }

  checkSearchResultsFitBounds() {
    if (this.communityMemberList.length < 3 && this.searchResults.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  checkCommunityMemberFitBounds() {
    if (this.searchResults.length < 3 || this.communityMemberList.length >= 3) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Fucntion gets called when the navigator's GPS system has found the user's location.
   *
   * @param position
   */
  async showPosition(position: any) {
    this.locationFound = true;
    this.displayLocationEnablingInstructions = false;

    if (environment.fakeLocation) {
      this.lat = environment.myLocX;
      this.lng = environment.myLocY;
      this.ogLat = environment.myLocX;
      this.ogLng = environment.myLocY;
    } else {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.ogLat = position.coords.latitude;
      this.ogLng = position.coords.longitude;
    }

    this.center = {
      lat: this.lat,
      lng: this.lng,
    };

    this.width = '100%';

    this.map = true;

    if (this.firstTimeShowingMap) {
      this.firstTimeShowingMap = false;
      this.saveUserLocation();
    }

    this.showMobilePrompt2 = false;
    this.loading$.next(false);
  }

  initMap() {
    // this.spotbieMap.options = this.getMapOptions();
  }

  drawPosition() {
    // this.iconUrl = {
    //   url: this.userDefaultImage,
    //   scaledSize: new google.maps.Size(50, 50),
    // };
  }

  pullMarker(mapObject: any): void {
    this.currentMarker = mapObject;
    this.sliderRight = true;
  }

  getSingleCatClass(i) {
    if (i % 2 === 0) {
      return 'spotbie-single-cat';
    } else {
      return 'spotbie-single-cat single-cat-light';
    }
  }

  saveUserLocation(): void {
    const saveLocationObj = {
      loc_x: this.lat,
      loc_y: this.lng,
    };

    if (this.isLoggedIn === '1') {
      this.locationService.saveCurrentLocation(saveLocationObj).subscribe(
        resp => {
          this.saveCurrentLocationCallback(resp);
        },
        error => {
          console.log('saveAndRetrieve Error', error);
        }
      );
    }
  }

  saveCurrentLocationCallback(resp: any): void {
    if (resp.message === 'success') {
      this.retrieveSurroudings();
    } else {
      console.log('saveCurrentLocationCallback Error', resp);
    }
  }

  retrieveSurroudings() {
    const retrieveSurroundingsObj = {
      loc_x: this.lat,
      loc_y: this.lng,
      search_type: this.currentSearchType,
    };

    this.locationService.retrieveSurroudings(retrieveSurroundingsObj).subscribe(
      resp => this.retrieveSurroudingsCallback(resp),
      error => console.log('saveAndRetrieve Error', error)
    );
  }

  retrieveSurroudingsCallback(resp: any) {
    const surroundingObjectList = resp.surrounding_object_list;
    const totalObjects = surroundingObjectList.length;

    if (totalObjects === undefined) {
      return;
    }

    let i = 0;
    for (let k = 0; k < totalObjects; k++) {
      i++;
      const coords = this.getNewCoords(
        surroundingObjectList[k].loc_x,
        surroundingObjectList[k].loc_y,
        i,
        totalObjects
      );
      surroundingObjectList[k].loc_x = coords.lat;
      surroundingObjectList[k].loc_y = coords.lng;

      if (surroundingObjectList[k].ghost_mode === 1) {
        surroundingObjectList[k].default_picture =
          'assets/images/ghost_white.jpg';
        surroundingObjectList[k].username = 'User is a Ghost';
        surroundingObjectList[k].description = `This user is a ghost.
                                                Ghost Users are not able to be befriended and their profiles remain hidden.`;
      } else {
        surroundingObjectList[k].description = unescape(
          surroundingObjectList[k].description
        );
      }
      surroundingObjectList[k].map_icon = this.mapIconPipe.transform(
        surroundingObjectList[k].default_picture
      );
    }

    this.loading$.next(false);
    this.showMobilePrompt2 = false;
    this.createObjectMarker(surroundingObjectList);
  }

  getMapPromptMobileClass() {
    if (this.isMobile) {
      return 'map-prompt-mobile align-items-center justify-content-center';
    } else {
      return 'map-prompt-mobile align-items-center';
    }
  }

  getMapPromptMobileInnerWrapperClassOne() {
    if (this.isMobile) {
      return 'map-prompt-v-align mt-2';
    }
  }

  createObjectMarker(surroundingObjectList): void {
    this.surroundingObjectList = surroundingObjectList;
  }

  getNewCoords(x, y, i, f): any {
    // Gives the current position an alternate coordinates
    // i is the current item
    // f is the total items
    let radius = null;

    if (this.n2_x - this.n3_x === 0) {
      radius = this.rad_1 + this.rad_11;
      this.rad_1 = radius;
      this.n2_x = 0;
      this.n3_x = this.n3_x + 7;
    } else {
      radius = this.rad_1;
    }

    this.n2_x = this.n2_x + 1;

    const angle = (i / this.n3_x) * Math.PI * 2;
    x = this.lat + Math.cos(angle) * radius;
    y = this.lng + Math.sin(angle) * radius;

    const p = {lat: x, lng: y};
    return p;
  }

  closeSearchResults() {
    this.closeCategories();
    this.showSearchResults = false;
    this.displaySurroundingObjectList = true;
    this.showSearchBox = false;
    this.map = false;
  }

  myFavorites(): void {
    this.myFavoritesWindow.open = true;
  }

  showMapError() {
    this.displayLocationEnablingInstructions = true;
    this.map = false;
    this.loading$.next(false);
    this.closeCategories();
    this.cleanCategory();
  }

  mobileStartLocation() {
    this.loading$.next(true);
    this.spawnCategories(1);

    this.showMobilePrompt = false;
    this.showMobilePrompt2 = true;
  }

  private async populateYelpResults(data: any) {
    let results = data.businesses;

    let i = 0;
    const resultsToRemove = [];

    results.forEach(business => {
      //Remove some banned yelp results.
      if (this.bannedYelpIDs.indexOf(business.id) > -1) {
        resultsToRemove.push(i);
      }

      business.rating_image = setYelpRatingImage(business.rating);
      business.type_of_info_object = this.typeOfInfoObject;
      business.type_of_info_object_category = this.searchCategory;
      business.is_community_member = false;

      if (business.is_closed) {
        business.is_closed_msg = 'Closed';
      } else {
        business.is_closed_msg = 'Open';
      }

      if (business.price) {
        business.price_on = '1';
      }

      if (business.image_url === '') {
        business.image_url = '0';
      }

      let friendlyTransaction = '';

      business.transactions = business.transactions.sort();

      switch (business.transactions.length) {
        case 0:
          friendlyTransaction = '';
          business.transactions_on = '0';
          break;
        case 1:
        case 2:
        case 3:
          business.transactions_on = '1';
          business.transactions = [
            business.transactions.slice(0, -1).join(', '),
            business.transactions.slice(-1)[0],
          ].join(business.transactions.length < 2 ? '' : ', and ');
          friendlyTransaction = business.transactions.replace(
            'restaurant_reservation',
            'restaurant reservations'
          );
          friendlyTransaction = friendlyTransaction + '.';
          break;
      }

      business.friendly_transactions = friendlyTransaction;
      business.distance = metersToMiles(business.distance);
      business.icon = business.image_url;
      i++;
    });

    for (let y = 0; y < resultsToRemove.length; y++) {
      results.splice(resultsToRemove[y], 1);
    }

    this.searchResultsOriginal = results;

    results = results.filter(
      searchResult => searchResult.distance < this.maxDistance
    );

    this.searchResults = results;

    if (this.sortingOrder === 'desc') {
      this.sortingOrder = 'asc';
    } else {
      this.sortingOrder = 'desc';
    }

    this.sortBy(this.sortAc);

    switch (this.searchCategory) {
      case 1:
        this.searchResultsSubtitle = 'Spots';
        break;
      case 2:
        this.searchResultsSubtitle = 'cShopping Spots';
        break;
    }

    this.loadedTotalResults = this.searchResults.length;

    this.allPages = Math.ceil(this.totalResults / this.itemsPerPage);

    if (this.allPages === 0) {
      this.allPages = 1;
    }

    if (this.loadedTotalResults > 1000) {
      this.totalResults = 1000;
      this.loadedTotalResults = 1000;
      this.allPages = 20;
    }
  }

  openTerms() {}
}
