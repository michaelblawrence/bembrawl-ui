import React, { useState, useEffect } from "react";
import "./WaitingRoomPage.css";
import { Branding } from "../../../core-common/Branding";
import { PageProps } from "../PageProps";
import { Button, Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { Nothing } from "../../enums/PageState";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function WaitingRoomPage(props: PageProps) {
  const { PlayerInfo, RoomInfo } = props.state;
  const [showBannerTimeout, setShowBannerTimeout] = useState(0);

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
  const onCloseRoom = () => props.setMessage.CloseRoom(Nothing);
  const isMaster = PlayerInfo.isMaster;
  const isJoining = RoomInfo.isJoining;
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
            Player {RoomInfo.lastJoined.playerId} has joined the room!
          </Alert>
        )}
      </Snackbar>
      <div className="WaitingRoom">
        <header className="WaitingRoom-header">
          <h1>YOU IN THE WAITING ROOM</h1>
          <h2>Check out the big screen!</h2>
          {isMaster && (
            <Button disabled={isJoining} onClick={onCloseRoom}>
              All Players In
            </Button>
          )}
        </header>
      </div>
    </div>
  );
}
