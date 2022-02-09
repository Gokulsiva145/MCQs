import {getUserName,getUserEmail, getUserType} from "../utils/Common";
// ----------------------------------------------------------------------

const account = {
  displayName: getUserName(),
  email: getUserEmail(),
  role:getUserType(),
  photoURL: '/static/mock-images/avatars/avatar_default.jpg'
};

export default account;
