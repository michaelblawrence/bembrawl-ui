import React, { useState, useEffect, ChangeEvent } from "react";
import "./WaitingRoomPage.css";
import { Branding } from "../../../core-common/Branding";
import { PageProps } from "../PageProps";
import {
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Tooltip,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { Nothing } from "../../enums/PageState";

export function WaitingRoomPage(props: PageProps) {
  const { PlayerInfo, RoomInfo } = props.state;
  const [showBannerTimeout, setShowBannerTimeout] = useState(0);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [hasOpened, setHasOpened] = React.useState(false);

  const openEditName = () => {
    setOpen(true);
    setHasOpened(true);
  };

  useEffect(() => {
    if (PlayerInfo.playerId) {
      setPlayerId("PLAYER " + PlayerInfo.playerId);
    }
  }, [PlayerInfo.playerId]);

  useEffect(() => {
    let handle: number | null = null;

    if (RoomInfo.lastJoined) {
      const toShowMs = RoomInfo.lastJoined.displayUntilMs - Date.now();
      console.log("toShowS", toShowMs / 1000);
      if (toShowMs > 0) {
        setShowBannerTimeout(toShowMs);
        handle = setTimeout(() => setShowBannerTimeout(0), toShowMs) as any;
      }
    }

    return () => {
      if (handle) {
        clearTimeout(handle);
      }
    };
  }, [RoomInfo.lastJoined]);
  const handleClose = (event: any, reason?: any) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBannerTimeout(0);
  };
  const submitPlayerName = (newPlayerName: string | null) => {
    setOpen(false);
    const playerNameValue = newPlayerName || playerId;
    setPlayerId(playerNameValue);
    if (playerNameValue) {
      props.setMessage.ChangePlayerName({
        payload: { playerName: playerNameValue },
      });
    }
  };
  const onCloseRoom = () => props.setMessage.CloseRoom(Nothing);
  const isMaster = PlayerInfo.isMaster;
  const isJoinDisabled = RoomInfo.isJoining || RoomInfo.playerCount < 2;
  const openAlert = !!(showBannerTimeout && RoomInfo.lastJoined);
  return (
    <div>
      <Branding />
      <Snackbar
        open={openAlert}
        autoHideDuration={showBannerTimeout}
        onClose={handleClose}
      >
        {RoomInfo.lastJoined && (
          <Alert onClose={handleClose} severity="success">
            "{RoomInfo.lastJoined.playerName}" has {RoomInfo.lastJoined.eventNotificationType}!
          </Alert>
        )}
      </Snackbar>
      <div className="WaitingRoom">
        <EditPlayerName
          playerName={playerId || ""}
          open={open}
          submit={submitPlayerName}
        />
        <header className="WaitingRoom-header">
          <div className="WaitingRoom-header-container">
            {playerId && (
              <h3>
                WELCOME{" "}
                <Tooltip
                  title="Edit Player Name"
                  enterDelay={500}
                  placement="top"
                  open={!hasOpened}
                  arrow
                >
                  <span onClick={openEditName}>{playerId}</span>
                </Tooltip>
              </h3>
            )}
            <h1>YOU IN THE WAITING ROOM</h1>
            <h2>Check out the big screen!</h2>
            {isMaster && (
              <Button
                disabled={isJoinDisabled}
                onClick={onCloseRoom}
                variant="contained"
                color="primary"
              >
                All Players In
              </Button>
            )}
          </div>
        </header>
      </div>
    </div>
  );
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function EditPlayerName(props: {
  playerName: string;
  submit: (playerName: string | null) => void;
  open: boolean;
}) {
  const [playerName, setPlayerName] = React.useState(props.playerName);

  const handleClose = () => {
    setPlayerName("");
    props.submit(null);
  };

  const handleSubmit = () => {
    props.submit(playerName);
    setPlayerName("");
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setPlayerName(e.target.value);
  };
  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Player Name</DialogTitle>
      <DialogContent style={{ margin: "0px 15px" }}>
        <TextField
          onChange={handleNameChange}
          value={playerName}
          autoFocus
          margin="normal"
          label="Player Name"
          fullWidth
        />
      </DialogContent>
      <DialogActions style={{ margin: "0px 15px 5px" }}>
        <Button onClick={handleClose} color="primary" variant="contained">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
