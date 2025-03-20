class Storage{
  static getUsername = ()=>localStorage.getItem("username");
  static setUsername = (username)=>localStorage.setItem("username",username);
  static deleteUsername = ()=> localStorage.removeItem("username");
}
export default Storage;