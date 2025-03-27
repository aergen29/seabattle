import { booleanToStr, strToBoolean } from "./valueControls";

class Storage {
  static getUsername = () => localStorage.getItem("username");
  static setUsername = (username) => localStorage.setItem("username", username);
  static deleteUsername = () => localStorage.removeItem("username");
  static changeMode = (e) => localStorage.setItem("darkTheme", booleanToStr(e));
  static getMode = () => {
    if(localStorage.getItem("darkTheme") === null) return null;
    return strToBoolean(localStorage.getItem("darkTheme"))
  };
}
export default Storage;
