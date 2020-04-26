import React, {  } from "react";
import "./WaitingRoomPage.css";
import { Branding } from "../../../core-common/Branding";
import { PageProps, PlayerState } from "../PageProps";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Tooltip,
} from "@material-ui/core";
import { Nothing } from "../../enums/PageState";
import { NewPlayerAlert } from "../common/NewPlayerAlert";

export function WaitingRoomPage(props: PageProps) {
  const { PlayerInfo } = props.state;
  const [open, setOpen] = React.useState(false);
  const [hasOpened, setHasOpened] = React.useState(false);

  const submitPlayerName = (newPlayerName: string | null) => {
    setOpen(false);
    const playerNameValue = newPlayerName || PlayerInfo.playerName || null;
    if (playerNameValue) {
      props.setMessage.ChangePlayerName({
        payload: { playerName: playerNameValue },
      });
    }
  };

  const openEditName = () => {
    setOpen(true);
    setHasOpened(true);
  };
  
  const onCloseRoom = () => props.setMessage.CloseRoom(Nothing);

  return (
    <div>
      <Branding />
      <NewPlayerAlert state={props.state} />
      <div className="WaitingRoom">
        <EditPlayerNamePopup
          playerName={PlayerInfo.playerName || ""}
          open={open}
          submit={submitPlayerName}
        />
        <header className="WaitingRoom-header">
          <WaitingRoomContainer
            hideTooltip={hasOpened}
            openEditName={openEditName}
            state={props.state}
            onCloseRoom={onCloseRoom}
          />
        </header>
      </div>
    </div>
  );
}

function WaitingRoomContainer(props: {
  hideTooltip: boolean;
  openEditName: () => void;
  state: PlayerState;
  onCloseRoom: () => void;
}) {
  const {
    hideTooltip,
    state,
    onCloseRoom,
    openEditName,
  } = props;
  const {PlayerInfo, RoomInfo} = state;
  const isMaster = PlayerInfo.isMaster;
  const isJoinDisabled = RoomInfo.isJoining || RoomInfo.playerCount < 2;
  return (
    <div className="WaitingRoom-header-container">
      {PlayerInfo.playerName && (
        <h3>
          WELCOME{" "}
          <Tooltip
            title="Edit Player Name"
            enterDelay={500}
            placement="top"
            open={!hideTooltip}
            onClick={openEditName}
            arrow
          >
            <span onClick={openEditName}>{PlayerInfo.playerName}</span>
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
  );
}

function EditPlayerNamePopup(props: {
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
