// return the userId from the session storage
export const getUserEmail = () => {
  return sessionStorage.getItem("email") || null;
};

// return the userName data from the session storage
export const getUserName = () => {
  return sessionStorage.getItem("userName") || null;
};

// return the userType from the session storage
export const getUserTypeId = () => {
  return parseInt(sessionStorage.getItem("userTypeId")) || null;
};

// return the userType from the session storage
export const getUserType = () => {
  return sessionStorage.getItem("userType") || null;
};

// set the userId and userName and userType from the session storage
export const setUserSession = (email, userName, userTypeId, userType) => {
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("userName", userName);
  sessionStorage.setItem("userTypeId", userTypeId);
  sessionStorage.setItem("userType", userType);
};

// remove the userId and userName and userType from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userTypeId");
  sessionStorage.removeItem("userType");
};
