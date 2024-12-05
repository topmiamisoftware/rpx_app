import {Business} from "../../../../models/business";

export interface MeetUp {
  id: number;
  user_id: number;
  business_id: number;
  business: Business;
  updated_at: string;
  time: string;
}
