import {Business} from "../../../../models/business";
import {SpotbieUser} from "../../../../models/spotbieuser";
import {User} from "../../../../models/user";
import {format, formatISO} from "date-fns";
import {formatInTimeZone, toZonedTime} from "date-fns-tz";
import {spotbie_UTC} from "../../../../helpers/time";

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
  business: Business
  name: string
  description: string
  invitation_list: MeetUpInvitation[];
  owner: User;
}

export function normalizeMeetUpList(meetUpList: MeetUpInvitation[]): MeetUp[] {
  return meetUpList.map(a => {
    const localTime = format(
      new Date(`${spotbie_UTC(a.meet_up.time)}`),
      "LLL. dd ''yy h:mm a"
    );

    // You need ISO standard for Ion-datetime
    const toISO = formatISO(new Date(`${spotbie_UTC(a.meet_up.time)}`));

    return {
      ...a.meet_up,
      time_friendly: localTime,
      time: toISO,
    };
  });
}
