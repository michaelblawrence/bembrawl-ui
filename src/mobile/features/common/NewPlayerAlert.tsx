import React, { useState, useEffect } from "react";
import {
  Snackbar,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { PlayerState } from "../PageProps";

export function NewPlayerAlert(props: { state: PlayerState }) {
  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const { RoomInfo } = props.state;
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
  const openAlert = !!(showBannerTimeout && RoomInfo.lastJoined);
  const handleClose = (event: any, reason?: any) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBannerTimeout(0);
  };
  return (
    <Snackbar
      open={openAlert}
      autoHideDuration={showBannerTimeout}
      onClose={handleClose}
    >
      {RoomInfo.lastJoined && (
        <Alert onClose={handleClose} severity="success">
          "{RoomInfo.lastJoined.playerName}" has{" "}
          {RoomInfo.lastJoined.eventNotificationType}!
        </Alert>
      )}
    </Snackbar>
  );
};