import {Business} from "../../../../models/business";
import {SpotbieUser} from "../../../../models/spotbieuser";
import {User} from "../../../../models/user";
import {format, formatISO} from "date-fns";
import {spotbie_UTC} from "../../../../helpers/time";
import {Capacitor} from "@capacitor/core";
import {InfoObject} from "../../../../models/info-object";

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
  friend_id: number | string;
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
  time: string;
  time_friendly: string;
  deleted_at: any
  created_at: string
  updated_at: string
  friend_list: string
  business_id_sb: number
  friend_id: number
  meet_up_id: number
  going: number
  business: Business | InfoObject
  name: string
  description: string
  invitation_list: MeetUpInvitation[];
  owner: User;
  contact_list: {name: string, number: string, image: string}[];
}

export function normalizeMeetUpList(meetUpList: MeetUpInvitation[]): MeetUp[] {
  return meetUpList.map(a => {
    const localTime =  format(
      `${spotbie_UTC(a.meet_up.time)}`,
      "LLL. dd ''yy h:mm a"
    );

    // You need ISO standard for Ion-datetime
    let toISO;
    if (Capacitor.getPlatform() === 'ios') {
      toISO = formatISO(spotbie_UTC(a.meet_up.time));
    } else {
      toISO = formatISO(`${spotbie_UTC(a.meet_up.time)}`);
    }

    return {
      ...a.meet_up,
      time_friendly: localTime,
      time: toISO,
    };
  });
}
