import {SpotbieUser} from "../../../../models/spotbieuser";

export function normalizeProfile(profileList: SpotbieUser[], myUserId) {
  const normalizedProfileList = [];
  let user_profile;

  profileList.forEach((profile: any) => {
    if (profile.user_id === myUserId) {
      user_profile = profile.friend_profile;
    } else if (profile.friend_id === myUserId) {
      user_profile = profile.user_profile;
    }

    normalizedProfileList.push({
      ...profile,
      user_profile,
    });
  });

  return normalizedProfileList;
}

export function normalizeProfileFromFriendSearch(profileList: [], myUserId: number) {
  const normalizedProfileList = [];

  profileList.forEach((profile: any) => {
    let user_profile;
    if (myUserId === profile.user_id) {
      user_profile = profile.friend_spotbie_profile;
      user_profile.spotbie_user = profile.friend_spotbie_profile;
    } else {
      user_profile = profile.spotbie_profile;
      user_profile.spotbie_user = profile.spotbie_pofile;
    }

    normalizedProfileList.push({
      ...profile,
      user_profile,
    });
  });

  return normalizedProfileList;
}
