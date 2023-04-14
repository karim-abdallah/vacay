import { profile, profileMock } from "../../mocks/profile.mocks";

const INIT_STATE = {
  profile: profile,
};

const Profile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "profile/update":
      // Takes in a whole profile object and replaces it
      return action.profile;
    default:
      return state;
  }
};

export default Profile;
