import {io} from "socket.io-client";

const {REACT_APP_API_URL} = process.env;
const socket = io(REACT_APP_API_URL);

export default socket;