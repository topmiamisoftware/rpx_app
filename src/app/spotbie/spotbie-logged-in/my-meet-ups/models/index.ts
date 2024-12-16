import {Business} from "../../../../models/business";

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
}
