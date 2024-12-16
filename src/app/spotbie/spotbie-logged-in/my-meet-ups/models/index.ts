import {Business} from "../../../../models/business";
import {SpotbieUser} from "../../../../models/spotbieuser";
import {User} from "../../../../models/user";

export interface MeetUpInvitation {
  id: number
  user_id: number
  business_id: any
  time: string
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
  time: string
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
