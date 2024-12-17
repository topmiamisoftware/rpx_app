import {Business} from "../../../../models/business";
import {SpotbieUser} from "../../../../models/spotbieuser";
import {User} from "../../../../models/user";
import {format} from "date-fns";
import {toZonedTime} from "date-fns-tz";

export interface MeetUpInvitation {
  id: number
  user_id: number
  business_id: any
  time: string | Date
  time_friendly: string | Date
  deleted_at: any
  created_at: string
  updated_at: string
  friend_list: string
  business_id_sb: number
  friend_id: number
  meet_up_id: number
  going: number
  business: Business
  friend_profile: SpotbieUser;
  owner_profile: SpotbieUser;
  user_profile;
  meet_up: MeetUp;
}

export interface MeetUp {
  id: number
  user_id: number
  business_id: any
  time: string | Date;
  time_friendly: string | Date; // ISO rep, for ion-datetime
  deleted_at: any
  created_at: string
  updated_at: string
  friend_list: string
  business_id_sb: number
  friend_id: number
  meet_up_id: number
  going: number
  business: Business
  name: string
  description: string
  invitation_list: MeetUpInvitation[];
  owner: User;
}

export function normalizeMeetUpList(meetUpList: MeetUpInvitation[]): MeetUp[] {
  return meetUpList.map(a => {
    const inUTCFormat = format(a.meet_up.time, "yyyy-MM-dd'T'HH:mm:ssXXX");

    // You need ISO standard for Ion-datetime
    const timeIso = toZonedTime(inUTCFormat, Intl.DateTimeFormat().resolvedOptions().timeZone);
    const localTime = toZonedTime(inUTCFormat, Intl.DateTimeFormat().resolvedOptions().timeZone);

    console.log("in LOCAL TIMZESONE", localTime, timeIso);

    return {
      ...a.meet_up,
      time_friendly: localTime,
      time: timeIso,
    };
  });
}
