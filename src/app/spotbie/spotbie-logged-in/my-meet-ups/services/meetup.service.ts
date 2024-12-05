import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {catchError} from "rxjs/operators";
import {handleError} from "../../../../helpers/error-helper";
import {BehaviorSubject} from "rxjs";
import {Business} from "../../../../models/business";

const MEETUP_API = `${environment.apiEndpoint}meet-ups`;

@Injectable({
  providedIn: 'root'
})
export class MeetupService {

  // This will store the third-party API search results.
  searchResults$ = new BehaviorSubject([]);
  // This will store the third-party API search results.
  communityMemberList$ = new BehaviorSubject<Array<Business>>([]);

  constructor(
    private httpClient: HttpClient
  ) { }

  myMeetUps(){
    return this.httpClient.get(`${MEETUP_API}/index`).pipe(
      catchError(handleError('myMeetUps')),
    );
  }

  createMeetUp(req){
    return this.httpClient.post(`${MEETUP_API}`, req).pipe(
      catchError(handleError('createMeetUp')),
    );
  }

  deleteMeetUp(){
    const body = {};
    return this.httpClient.delete( `${MEETUP_API}`, body).pipe(
      catchError(handleError('myMeetUps')),
    );
  }

  showMeetUp(meetUpId: string) {
    return this.httpClient.get(`${MEETUP_API}/${meetUpId}`).pipe(
      catchError(handleError('myMeetUps')),
    );
  }
}
