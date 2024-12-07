export function normalizeProfile(profileList: [], myUserId) {
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

export function normalizeProfileFromSearch(profileList: []) {
  const normalizedProfileList = [];

  profileList.forEach((profile: any) => {
    let user_profile = profile;
    normalizedProfileList.push({
      ...profile,
      user_profile,
    });
  });

  return normalizedProfileList;
}
