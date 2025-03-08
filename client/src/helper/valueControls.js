export const usernameControl = value=>{
  const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;
  return usernameRegex.test(value);
}
export const roomControl = value=>{
  const roomRegex = /^[a-zA-Z0-9_]{6,16}$/;
  return roomRegex.test(value);
}