import {
  alpha,
  Grid2,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { set } from "../redux/slices/informationsSlice";
import { useDispatch, useSelector } from "react-redux";
import {usernameControl} from "../helper/valueControls"
import Storage from "../helper/storage";

const UserPaper = ({ swipePage }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.informations);
  const theme = useTheme().palette;

  useEffect(()=>{
    const username = Storage.getUsername();
    if(username){
      swipePage(1);
      dispatch(set({ name: "username", value: username }));
    }
  },[]);

  const swpPg = e=>{
    Storage.setUsername(state.username);
    swipePage(1);
  }

  return (
    <Paper
      sx={{
        bgcolor: alpha(theme.background.card, 0.5),
        p: 4,
        minHeight: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid2 container sx={{ width: "100%" }}>
        <Grid2
          item
          container
          justifyContent="center"
          alignItems="center"
          size={2}
        >
          <IconButton
            disabled
            sx={{ width: "50%", aspectRatio: "1/1" }}
            color="primary"
          >
            <ArrowBackIosOutlinedIcon />
          </IconButton>
        </Grid2>
        <Grid2 item size={8}>
          <UsernameBar state={state} dispatch={dispatch} />
        </Grid2>
        <Grid2
          item
          container
          justifyContent="center"
          alignItems="center"
          size={2}
        >
          <IconButton
            sx={{ width: "50%", aspectRatio: "1/1" }}
            onClick={swpPg}
            color="primary"
            disabled={!usernameControl(state.username)}
          >
            <ArrowForwardIosOutlinedIcon sx={{ width: "100%" }} />
          </IconButton>
        </Grid2>
      </Grid2>
    </Paper>
  );
};

const UsernameBar = ({state,dispatch}) => {
  return (
    <>
      <Grid2 container flexDirection="column" spacing={4}>
        <Grid2 textAlign="center" width="100%" item>
          <Typography component="h4" variant="h4">
            Kullanıcı Adı
          </Typography>
        </Grid2>
        <Grid2 item container flexDirection="row" spacing={2}>
          <TextField
            // helperText={
            //   state.wrongInputs.indexOf("username") !== -1
            //     ? "Username has to contain at least 6 character."
            //     : false
            // }
            // error={state.wrongInputs.indexOf("username") !== -1}
            // margin="normal"
            value={state.username}
            onChange={(e) =>
              dispatch(set({ name: "username", value: e.target.value }))
            }
            required
            fullWidth
            id="username"
            name="username"
            label="Kullanıcı Adı"
          />
        </Grid2>
      </Grid2>
    </>
  );
};

export default UserPaper;
