export const usernameControl = (value) => {
  const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;
  return usernameRegex.test(value);
};
export const roomControl = (value) => {
  const roomRegex = /^[a-zA-Z0-9_]{6,16}$/;
  return roomRegex.test(value);
};
export const filledSet = (filled, ship, gridSize, status = true) => {
  filled = [...filled];
  let locations = getAllLocations(ship);
  if (status) {
    locations.forEach((e) => {
      if (
        filled.findIndex((f) => JSON.stringify(f) === JSON.stringify(e)) === -1
      )
        filled.push(e);
    });
  } else {
    let indexs = [];
    locations.forEach((e) => {
      indexs.push(
        filled.findIndex((f) => JSON.stringify(f) === JSON.stringify(e))
      );
    });
    indexs.sort((a, b) => b - a);
    for (let ind of indexs) {
      filled.splice(ind,1);
    }
  }
  return filled;
};

export const isLocationSuit = (filled, ship, gridSize) => {
  const locations = getAllLocations(ship);
  for(let loc of locations){
    let ind = filled.findIndex((e) => (e.x === loc.x && e.y === loc.y));
    if(ind !== -1 || loc.x <0 || loc.y<0 || loc.x>gridSize || loc.y > gridSize) return false;
  }
  return true;
};


export const getAllLocations = (ship) => {
  const { isHorizontal, length, location } = ship;
  let locations = [];
  locations[0] = location;
  for (let i = 1; i < length; i++) {
    locations[i] = isHorizontal
      ? { x: locations[i - 1].x + 1, y: locations[i - 1].y }
      : { x: locations[i - 1].x, y: locations[i - 1].y + 1 };
  }
  return locations;
};


export const isShipsReady = (values,count)=>{
  return values.length === count;
}