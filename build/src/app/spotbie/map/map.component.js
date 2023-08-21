"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const info_object_helper_1 = require("../../helpers/info-object-helper");
const core_2 = require("@capacitor/core");
const date_format_pipe_1 = require("../../pipes/date-format.pipe");
const map_extras = require("./map_extras/map_extras");
const sorterHelpers = require("../../helpers/results-sorter.helper");
const sort_order_pipe_1 = require("../../pipes/sort-order.pipe");
const environment_1 = require("../../../environments/environment");
const rxjs_1 = require("rxjs");
const { Geolocation, Toast } = core_2.Plugins;
const YELP_BUSINESS_SEARCH_API = 'https://api.yelp.com/v3/businesses/search';
const BANNED_YELP_IDS = map_extras.BANNED_YELP_IDS;
const SBCM_INTERVAL = 16000;
let MapComponent = class MapComponent {
    constructor(locationService, deviceService, mapIconPipe, httpClient, platform) {
        this.locationService = locationService;
        this.deviceService = deviceService;
        this.mapIconPipe = mapIconPipe;
        this.httpClient = httpClient;
        this.platform = platform;
        this.business = false;
        this.signUpEvt = new core_1.EventEmitter();
        this.openBusinessSettingsEvt = new core_1.EventEmitter();
        this.bottomAdBanner = null;
        this.singleAdApp = null;
        this.loading$ = new rxjs_1.BehaviorSubject(false);
        this.n2_x = 0;
        this.n3_x = 7;
        this.rad_11 = null;
        this.rad_1 = null;
        this.searchResultsOriginal = [];
        this.sortByTxt = 'Distance';
        this.sortingOrder = 'asc';
        this.sortAc = 0;
        this.totalResults = 0;
        this.currentOffset = 0;
        this.itemsPerPage = 20;
        this.aroundMeSearchPage = 1;
        this.loadedTotalResults = 0;
        this.allPages = 0;
        this.maxDistanceCap = 45;
        this.maxDistance = 10;
        this.sortEventDate = 'none';
        this.showingOpenedStatus = 'Showing Opened & Closed';
        this.fitBounds = false;
        this.zoom = 18;
        this.map = false;
        this.locationFound = false;
        this.sliderRight = false;
        this.catsUp = false;
        this.toastHelper = false;
        this.displaySurroundingObjectList = false;
        this.showNoResultsBox = false;
        this.showMobilePrompt = true;
        this.showMobilePrompt2 = false;
        this.firstTimeShowingMap = true;
        this.showOpened = false;
        this.noResults = false;
        this.currentSearchType = '0';
        this.surroundingObjectList = [];
        this.searchResults = [];
        this.eventClassifications = map_extras.EVENT_CATEGORIES;
        this.foodCategories = map_extras.FOOD_CATEGORIES;
        this.shoppingCategories = map_extras.SHOPPING_CATEGORIES;
        this.mapStyles = map_extras.MAP_STYLES;
        this.infoObjectWindow = { open: false };
        this.myFavoritesWindow = { open: false };
        this.subCategory = {
            food_sub: { open: false },
            media_sub: { open: false },
            artist_sub: { open: false },
            place_sub: { open: false },
        };
        this.placesToEat = false;
        this.eventsNearYou = false;
        this.reatailShop = false;
        this.usersAroundYou = false;
        this.isDesktop = false;
        this.isTablet = false;
        this.isMobile = false;
        this.loadingText = null;
        this.displayLocationEnablingInstructions = false;
        this.bannedYelpIDs = BANNED_YELP_IDS;
        this.communityMemberList = [];
        this.eventsClassification = null;
        this.getSpotBieCommunityMemberListInterval = false;
        this.isLoggedIn = localStorage.getItem('spotbie_loggedIn');
        this.userDefaultImage = localStorage.getItem('spotbie_userDefaultImage');
        this.spotbieUsername = localStorage.getItem('spotbie_userLogin');
    }
    get markerOptions() {
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
        }
        else {
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
        if (a === undefined) {
            return 1;
        }
        else if (b === undefined) {
            return -1;
        }
        return a.length > b.length ? -1 : b.length > a.length ? 1 : 0;
    }
    deliverySort() {
        this.searchResults = this.searchResults.filter(searchResult => searchResult.transactions.indexOf('delivery') > -1);
    }
    pickUpSort() {
        this.searchResults = this.searchResults.filter(searchResult => searchResult.transactions.indexOf('pickup') > -1);
    }
    reservationSort() {
        this.searchResults = this.searchResults.filter(searchResult => searchResult.transactions.indexOf('restaurant_reservation') > -1);
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
        this.showOpened = !this.showOpened;
        if (!this.showOpened) {
            this.showingOpenedStatus = 'Show Opened and Closed';
            this.showOpenedParam = 'open_now=true';
        }
        else {
            this.showingOpenedStatus = 'Show Opened';
            const unixTime = Math.floor(Date.now() / 1000);
            this.showOpenedParam = `open_at=${unixTime}`;
        }
        this.apiSearch(this.searchKeyword);
    }
    updateDistance(evt) {
        clearTimeout(this.updateDistanceTimeout);
        this.updateDistanceTimeout = setTimeout(() => {
            this.maxDistance = evt.value;
            if (this.showNoResultsBox) {
                this.apiSearch(this.searchKeyword);
            }
            else {
                const results = this.searchResultsOriginal.filter(searchResult => searchResult.distance < this.maxDistance);
                this.loadedTotalResults = results.length;
                this.searchResults = results;
                this.sortBy(this.sortAc);
            }
        }, 500);
    }
    sortBy(ac) {
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
            }
            else {
                this.sortingOrder = 'desc';
            }
        }
        switch (ac) {
            case 0:
                //sort by distance
                if (this.sortingOrder === 'desc') {
                    this.searchResults = this.searchResults.sort(sorterHelpers.distanceSortDesc);
                }
                else {
                    this.searchResults = this.searchResults.sort(sorterHelpers.distanceSortAsc);
                }
                break;
            case 1:
                //sort by rating
                if (this.sortingOrder === 'desc') {
                    this.searchResults = this.searchResults.sort(sorterHelpers.ratingSortDesc);
                }
                else {
                    this.searchResults = this.searchResults.sort(sorterHelpers.ratingSortAsc);
                }
                break;
            case 2:
                //sort by reviews
                if (this.sortingOrder === 'desc') {
                    this.searchResults = this.searchResults.sort(sorterHelpers.reviewsSortDesc);
                }
                else {
                    this.searchResults = this.searchResults.sort(sorterHelpers.reviewsSortAsc);
                }
                break;
            case 3:
                //sort by price
                if (this.sortingOrder === 'desc') {
                    this.searchResults = this.searchResults.sort(this.priceSortDesc);
                }
                else {
                    this.searchResults = this.searchResults.sort(sorterHelpers.priceSortAsc);
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
    classificationSearch() {
        this.loading$.next(true);
        this.locationService.getClassifications().subscribe(resp => {
            this.classificationSearchCallback(resp);
        });
    }
    classificationSearchCallback(httpResponse) {
        this.loading$.next(false);
        if (httpResponse.success) {
            const classifications = httpResponse.data._embedded.classifications;
            classifications.forEach(classification => {
                if (classification.type &&
                    classification.type.name &&
                    classification.type.name !== 'Undefined') {
                    classification.name = classification.type.name;
                }
                else if (classification.segment &&
                    classification.segment.name &&
                    classification.segment.name !== 'Undefined') {
                    classification.name = classification.segment.name;
                    classification.segment._embedded.genres.forEach(genre => {
                        genre.show_sub_sub = false;
                        if (genre.name === 'Chanson Francaise' ||
                            genre.name === 'Medieval/Renaissance' ||
                            genre.name === 'Religious' ||
                            genre.name === 'Undefined' ||
                            genre.name === 'World') {
                            classification.segment._embedded.genres.splice(classification.segment._embedded.genres.indexOf(genre), 1);
                        }
                    });
                }
                if (classification.name !== undefined) {
                    classification.show_sub = false;
                    if (classification.name !== 'Donation' &&
                        classification.name !== 'Parking' &&
                        classification.name !== 'Transportation' &&
                        classification.name !== 'Upsell' &&
                        classification.name !== 'Venue Based' &&
                        classification.name !== 'Event Style' &&
                        classification.name !== 'Individual' &&
                        classification.name !== 'Merchandise' &&
                        classification.name !== 'Group') {
                        this.eventCategories.push(classification);
                    }
                }
            });
            this.eventCategories = this.eventCategories.reverse();
            this.catsUp = true;
        }
        else {
            console.log('getClassifications Error ', httpResponse);
        }
        this.loading$.next(false);
    }
    showEventSubCategory(subCat) {
        if (subCat._embedded.subtypes !== undefined &&
            subCat._embedded.subtypes.length === 1) {
            this.apiSearch(subCat.name);
            return;
        }
        else if (subCat._embedded.subgenres !== undefined &&
            subCat._embedded.subgenres.length === 1) {
            this.apiSearch(subCat.name);
            return;
        }
        subCat.show_sub_sub = !subCat.show_sub_sub;
    }
    showEventSub(classification) {
        this.eventsClassification = this.eventClassifications.indexOf(classification.name);
        classification.show_sub = !classification.show_sub;
    }
    newKeyWord() {
        this.totalResults = 0;
        this.allPages = 0;
        this.currentOffset = 0;
        this.aroundMeSearchPage = 1;
        this.searchResults = [];
    }
    apiSearch(keyword, resetEventSorter = false) {
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
        let apiUrl;
        switch (this.searchCategory) {
            case '1': // food
                apiUrl = `${this.searchApiUrl}?latitude=${this.lat}&longitude=${this.lng}&term=${keyword}&categories=${keyword}&${this.showOpenedParam}&radius=40000&sort_by=rating&limit=20&offset=${this.currentOffset}`;
                this.numberCategories = this.foodCategories.indexOf(this.searchKeyword);
                break;
            case '2': // shopping
                apiUrl = `${this.searchApiUrl}?latitude=${this.lat}&longitude=${this.lng}&term=${keyword}&categories=${keyword}&${this.showOpenedParam}&radius=40000&sort_by=rating&limit=20&offset=${this.currentOffset}`;
                this.numberCategories = this.shoppingCategories.indexOf(this.searchKeyword);
                break;
            case '3': // events
                apiUrl = `size=2&latlong=${this.lat},${this.lng}&classificationName=${keyword}&radius=45&${this.eventDateParam}`;
                this.numberCategories = this.eventCategories.indexOf(this.searchKeyword);
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
            case '1':
            case '2':
                //Retrieve the thirst party API Yelp Results
                this.locationService.getBusinesses(searchObj).subscribe(resp => {
                    this.getBusinessesSearchCallback(resp);
                });
                //Retrieve the SpotBie Community Member Results
                this.locationService
                    .getSpotBieCommunityMemberList(searchObjSb)
                    .subscribe(resp => {
                    this.getSpotBieCommunityMemberListCb(resp);
                });
                break;
            case '3':
                //Retrieve the SpotBie Community Member Results
                this.locationService.getEvents(searchObj).subscribe(resp => {
                    this.getEventsSearchCallback(resp);
                });
                //Retrieve the SpotBie Community Member Results
                this.locationService
                    .getSpotBieCommunityMemberList(searchObjSb)
                    .subscribe(resp => {
                    this.getSpotBieCommunityMemberListCb(resp);
                });
                break;
        }
    }
    getMapOptions() {
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
        this.catsUp = false;
        this.map = false;
        this.showSearchBox = false;
        this.showSearchResults = false;
        this.infoObject = null;
        this.searchResults = [];
        this.infoObjectWindow.open = false;
    }
    sortingOrderClass(sortingOrder) {
        return new sort_order_pipe_1.SortOrderPipe().transform(sortingOrder);
    }
    async spawnCategories(obj) {
        this.loading$.next(true);
        this.scrollMapAppAnchor.nativeElement.scrollIntoView();
        this.zoom = 18;
        this.fitBounds = false;
        if (!this.locationFound && !this.isDesktop) {
            Geolocation.getCurrentPosition(position => {
                console.log('your position', position);
                this.map = true;
                this.showPosition(position);
            }, err => {
                console.log(err);
                this.showMapError();
            });
        }
        else if (!this.locationFound && this.isDesktop) {
            window.navigator.geolocation.getCurrentPosition(position => {
                console.log('your position isDesktop', position);
                this.showPosition(position);
            }, err => {
                console.log(err);
                this.showMapError();
            });
        }
        if (this.showMobilePrompt) {
            this.showMobilePrompt = false;
        }
        let category;
        if (!obj.category) {
            category = obj.toString();
        }
        else {
            category = obj.category;
        }
        this.showSearchBox = true;
        if (this.searchResults.length === 0) {
            this.showSearchResults = false;
        }
        if (category === this.searchCategory) {
            this.catsUp = true;
            return;
        }
        if (this.searchCategory) {
            this.previousSearchCategory = this.searchCategory;
        }
        this.searchCategory = category.toString();
        switch (this.searchCategory) {
            case '1':
                // food
                this.searchApiUrl = YELP_BUSINESS_SEARCH_API;
                this.searchCategoriesPlaceHolder = 'Search Places to Eat...';
                this.categories = this.foodCategories;
                this.bottomBannerCategories = this.categories.indexOf(this.categories[Math.floor(Math.random() * this.categories.length)]);
                break;
            case '2':
                // shopping
                this.searchApiUrl = YELP_BUSINESS_SEARCH_API;
                this.searchCategoriesPlaceHolder = 'Search Shopping...';
                this.categories = this.shoppingCategories;
                this.bottomBannerCategories = this.categories.indexOf(this.categories[Math.floor(Math.random() * this.categories.length)]);
                break;
            case '3':
                // events
                this.eventCategories = [];
                this.searchCategoriesPlaceHolder = 'Search Events...';
                this.categories = this.eventCategories;
                this.bottomBannerCategories = this.categories.indexOf(this.categories[Math.floor(Math.random() * this.categories.length)]);
                this.classificationSearch();
                return;
        }
        this.catsUp = true;
    }
    cleanCategory() {
        if (this.searchCategory !== this.previousSearchCategory) {
            this.searchResults = [];
            switch (this.searchCategory) {
                case '1': // food
                case '2': // shopping
                    this.typeOfInfoObject = 'yelp_business';
                    this.maxDistanceCap = 25;
                    break;
                case '3': // events
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
    closeCategories() {
        this.catsUp = false;
    }
    searchSpotBie(evt) {
        this.searchKeyword = evt.target.value;
        const searchTerm = encodeURIComponent(evt.target.value);
        clearTimeout(this.finderSearchTimeout);
        this.finderSearchTimeout = setTimeout(() => {
            this.loading$.next(true);
            let apiUrl;
            if (this.searchCategory === '3') {
                // Used for loading events from ticketmaster API
                apiUrl = `size=20&latlong=${this.lat},${this.lng}&keyword=${searchTerm}&radius=45`;
                const searchObj = {
                    config_url: apiUrl,
                };
                this.locationService.getEvents(searchObj).subscribe(resp => {
                    this.getEventsSearchCallback(resp);
                });
            }
            else {
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
    displayPageNext(page) {
        if (page < this.allPages) {
            return {};
        }
        else {
            return { display: 'none' };
        }
    }
    displayPage(page) {
        if (page > 0) {
            return {};
        }
        else {
            return { display: 'none' };
        }
    }
    goToPage(page) {
        this.aroundMeSearchPage = page;
        this.currentOffset =
            this.aroundMeSearchPage * this.itemsPerPage - this.itemsPerPage;
        this.apiSearch(this.searchKeyword);
        this.scrollMapAppAnchor.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
    loadMoreResults(action) {
        switch (action) {
            case 0:
                //previous
                if (this.aroundMeSearchPage === 1) {
                    this.aroundMeSearchPage = Math.ceil(this.totalResults / this.itemsPerPage);
                }
                else {
                    this.aroundMeSearchPage--;
                }
                break;
            case 1:
                //next
                if (this.aroundMeSearchPage ===
                    Math.ceil(this.totalResults / this.itemsPerPage)) {
                    this.aroundMeSearchPage = 1;
                    this.currentOffset = 0;
                }
                else {
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
    hideSearchResults() {
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
        }
        else {
            return 'spotbie-map';
        }
    }
    getMapClass() {
        if (this.showSearchResults) {
            return 'spotbie-agm-map sb-map-results-open';
        }
        else {
            if (this.isMobile) {
                return 'spotbie-agm-map sb-map-results-open';
            }
            return 'spotbie-agm-map';
        }
    }
    getEventsSearchCallback(httpResponse) {
        this.loading$.next(false);
        if (httpResponse.success) {
            this.totalResults = httpResponse.data.page.totalElements;
            const eventObject = httpResponse.data;
            if (this.totalResults === 0 || !!eventObject._embedded) {
                this.showNoResultsBox = true;
                this.loading$.next(false);
                this.searchResults = [];
                return;
            }
            else {
                this.showNoResultsBox = false;
                this.sortEventDate = 'none';
            }
            this.cleanCategory();
            window.scrollTo(0, 0);
            this.showSearchResults = true;
            this.catsUp = false;
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
                eventObjectList[i].coordinates.latitude = parseFloat(eventObjectList[i]._embedded.venues[0].location.latitude);
                eventObjectList[i].coordinates.longitude = parseFloat(eventObjectList[i]._embedded.venues[0].location.longitude);
                eventObjectList[i].icon = eventObjectList[i].images[0].url;
                eventObjectList[i].image_url = this.ticketMasterLargestImage(eventObjectList[i].images);
                eventObjectList[i].type_of_info_object = 'ticketmaster_event';
                const dtObj = new Date(eventObjectList[i].dates.start.localDate);
                const timeDate = new date_format_pipe_1.DateFormatPipe().transform(dtObj);
                const timeHr = new date_format_pipe_1.TimeFormatPipe().transform(eventObjectList[i].dates.start.localTime);
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
        }
        else {
            console.log('getEventsSearchCallback Error: ', httpResponse);
        }
        this.loading$.next(false);
    }
    ticketMasterLargestImage(imageList) {
        const largestDimension = Math.max.apply(Math, imageList.map(image => image.width));
        const largestImage = imageList.find(image => image.width === largestDimension);
        return largestImage.url;
    }
    getSpotBieCommunityMemberListCb(httpResponse) {
        if (httpResponse.success) {
            const communityMemberList = httpResponse.data;
            communityMemberList.forEach((business) => {
                business.type_of_info_object = 'spotbie_community';
                business.is_community_member = true;
                switch (this.searchCategory) {
                    case '1':
                        if (business.photo === '') {
                            business.photo = 'assets/images/home_imgs/find-places-to-eat.svg';
                        }
                        this.currentCategoryList = this.foodCategories;
                        break;
                    case '2':
                        if (business.photo === '') {
                            business.photo =
                                'assets/images/home_imgs/find-places-for-shopping.svg';
                        }
                        this.currentCategoryList = this.shoppingCategories;
                        break;
                    case '3':
                        if (business.photo === '') {
                            business.photo = 'assets/images/home_imgs/find-events.svg';
                        }
                        this.currentCategoryList = this.eventClassifications;
                }
                const cleanCategories = [];
                this.currentCategoryList.reduce((previousValue, currentValue, currentIndex, array) => {
                    if (business.categories.indexOf(currentIndex) > -1) {
                        cleanCategories.push(this.currentCategoryList[currentIndex]);
                    }
                    return currentValue;
                });
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
                    //Retrieve the SpotBie Community Member Results
                    this.locationService
                        .getSpotBieCommunityMemberList(searchObjSb)
                        .subscribe(resp => {
                        this.getSpotBieCommunityMemberListCb(resp);
                    });
                }, SBCM_INTERVAL);
            }
        }
    }
    getBusinessesSearchCallback(httpResponse) {
        this.loading$.next(false);
        this.maxDistanceCap = 25;
        this.fitBounds = true;
        if (httpResponse.success) {
            this.totalResults = httpResponse.data.total;
            if (this.totalResults === 0) {
                this.showNoResultsBox = true;
                return;
            }
            else {
                this.showNoResultsBox = false;
            }
            window.scrollTo(0, 0);
            this.cleanCategory();
            this.showSearchResults = true;
            this.catsUp = false;
            const placesResults = httpResponse.data;
            this.populateYelpResults(placesResults);
            this.searchCategorySorter = this.searchCategory;
            this.displaySurroundingObjectList = false;
            this.showSearchBox = true;
        }
        else {
            console.log('Place Search Error: ', httpResponse);
        }
    }
    pullSearchMarker(infoObject) {
        this.infoObjectWindow.open = true;
        this.infoObject = infoObject;
    }
    checkSearchResultsFitBounds() {
        if (this.communityMemberList.length < 3 && this.searchResults.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    checkCommunityMemberFitBounds() {
        if (this.searchResults.length < 3 || this.communityMemberList.length >= 3) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Fucntion gets called when the navigator's GPS system has found the user's location.
     *
     * @param position
     */
    async showPosition(position) {
        this.locationFound = true;
        this.displayLocationEnablingInstructions = false;
        if (environment_1.environment.fakeLocation) {
            this.lat = environment_1.environment.myLocX;
            this.lng = environment_1.environment.myLocY;
            this.ogLat = environment_1.environment.myLocX;
            this.ogLng = environment_1.environment.myLocY;
        }
        else {
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
    pullMarker(mapObject) {
        this.currentMarker = mapObject;
        this.sliderRight = true;
    }
    getSingleCatClass(i) {
        if (i % 2 === 0) {
            return 'spotbie-single-cat';
        }
        else {
            return 'spotbie-single-cat single-cat-light';
        }
    }
    saveUserLocation() {
        const saveLocationObj = {
            loc_x: this.lat,
            loc_y: this.lng,
        };
        if (this.isLoggedIn === '1') {
            this.locationService.saveCurrentLocation(saveLocationObj).subscribe(resp => {
                this.saveCurrentLocationCallback(resp);
            }, error => {
                console.log('saveAndRetrieve Error', error);
            });
        }
    }
    saveCurrentLocationCallback(resp) {
        if (resp.message === 'success') {
            this.retrieveSurroudings();
        }
        else {
            console.log('saveCurrentLocationCallback Error', resp);
        }
    }
    retrieveSurroudings() {
        const retrieveSurroundingsObj = {
            loc_x: this.lat,
            loc_y: this.lng,
            search_type: this.currentSearchType,
        };
        this.locationService.retrieveSurroudings(retrieveSurroundingsObj).subscribe(resp => this.retrieveSurroudingsCallback(resp), error => console.log('saveAndRetrieve Error', error));
    }
    retrieveSurroudingsCallback(resp) {
        const surroundingObjectList = resp.surrounding_object_list;
        const totalObjects = surroundingObjectList.length;
        if (totalObjects === undefined) {
            return;
        }
        let i = 0;
        for (let k = 0; k < totalObjects; k++) {
            i++;
            const coords = this.getNewCoords(surroundingObjectList[k].loc_x, surroundingObjectList[k].loc_y, i, totalObjects);
            surroundingObjectList[k].loc_x = coords.lat;
            surroundingObjectList[k].loc_y = coords.lng;
            if (surroundingObjectList[k].ghost_mode === 1) {
                surroundingObjectList[k].default_picture =
                    'assets/images/ghost_white.jpg';
                surroundingObjectList[k].username = 'User is a Ghost';
                surroundingObjectList[k].description = `This user is a ghost.
                                                Ghost Users are not able to be befriended and their profiles remain hidden.`;
            }
            else {
                surroundingObjectList[k].description = unescape(surroundingObjectList[k].description);
            }
            surroundingObjectList[k].map_icon = this.mapIconPipe.transform(surroundingObjectList[k].default_picture);
        }
        this.loading$.next(false);
        this.showMobilePrompt2 = false;
        this.createObjectMarker(surroundingObjectList);
    }
    getMapPromptMobileClass() {
        if (this.isMobile) {
            return 'map-prompt-mobile align-items-center justify-content-center';
        }
        else {
            return 'map-prompt-mobile align-items-center';
        }
    }
    getMapPromptMobileInnerWrapperClassOne() {
        if (this.isMobile) {
            return 'map-prompt-v-align mt-2';
        }
    }
    createObjectMarker(surroundingObjectList) {
        this.surroundingObjectList = surroundingObjectList;
    }
    getNewCoords(x, y, i, f) {
        // Gives the current position an alternate coordinates
        // i is the current item
        // f is the total items
        let radius = null;
        if (this.n2_x - this.n3_x === 0) {
            radius = this.rad_1 + this.rad_11;
            this.rad_1 = radius;
            this.n2_x = 0;
            this.n3_x = this.n3_x + 7;
        }
        else {
            radius = this.rad_1;
        }
        this.n2_x = this.n2_x + 1;
        const angle = (i / this.n3_x) * Math.PI * 2;
        x = this.lat + Math.cos(angle) * radius;
        y = this.lng + Math.sin(angle) * radius;
        const p = { lat: x, lng: y };
        return p;
    }
    closeSearchResults() {
        this.closeCategories();
        this.showSearchResults = false;
        this.displaySurroundingObjectList = true;
        this.showSearchBox = false;
        this.map = false;
    }
    myFavorites() {
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
        this.spawnCategories({ category: 'food' });
        this.showMobilePrompt = false;
        this.showMobilePrompt2 = true;
    }
    async populateYelpResults(data) {
        let results = data.businesses;
        let i = 0;
        const resultsToRemove = [];
        results.forEach(business => {
            //Remove some banned yelp results.
            if (this.bannedYelpIDs.indexOf(business.id) > -1) {
                resultsToRemove.push(i);
            }
            business.rating_image = (0, info_object_helper_1.setYelpRatingImage)(business.rating);
            business.type_of_info_object = this.typeOfInfoObject;
            business.type_of_info_object_category = this.searchCategory;
            business.is_community_member = false;
            if (business.is_closed) {
                business.is_closed_msg = 'Closed';
            }
            else {
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
                    friendlyTransaction = business.transactions.replace('restaurant_reservation', 'restaurant reservations');
                    friendlyTransaction = friendlyTransaction + '.';
                    break;
            }
            business.friendly_transactions = friendlyTransaction;
            business.distance = (0, info_object_helper_1.metersToMiles)(business.distance);
            business.icon = business.image_url;
            i++;
        });
        for (let y = 0; y < resultsToRemove.length; y++) {
            results.splice(resultsToRemove[y], 1);
        }
        this.searchResultsOriginal = results;
        results = results.filter(searchResult => searchResult.distance < this.maxDistance);
        this.searchResults = results;
        if (this.sortingOrder === 'desc') {
            this.sortingOrder = 'asc';
        }
        else {
            this.sortingOrder = 'desc';
        }
        this.sortBy(this.sortAc);
        switch (this.searchCategory) {
            case '1':
                this.searchResultsSubtitle = 'Spots';
                break;
            case '2':
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
    openTerms() { }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], MapComponent.prototype, "business", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], MapComponent.prototype, "spotType", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], MapComponent.prototype, "signUpEvt", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], MapComponent.prototype, "openBusinessSettingsEvt", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('homeDashboard')
], MapComponent.prototype, "homeDashboard", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('featureWrapper')
], MapComponent.prototype, "featureWrapper", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('featureWrapperAnchor')
], MapComponent.prototype, "featureWrapperAnchor", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('scrollMapAppAnchor')
], MapComponent.prototype, "scrollMapAppAnchor", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('bottomAdBanner')
], MapComponent.prototype, "bottomAdBanner", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('singleAdApp')
], MapComponent.prototype, "singleAdApp", void 0);
MapComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-map',
        templateUrl: './map.component.html',
        styleUrls: ['./map.component.css'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], MapComponent);
exports.MapComponent = MapComponent;
//# sourceMappingURL=map.component.js.map