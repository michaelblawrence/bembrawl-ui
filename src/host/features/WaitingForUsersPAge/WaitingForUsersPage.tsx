import React, { useEffect } from "react";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import { Grid } from "@material-ui/core";
import "./WaitingForUsersPage.css";
import { PageProps } from "../PageProps";

export function WaitingForUsersPage(props: PageProps) {
  const { RoomInfo } = props.state;

  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<number | null>(null);

  useEffect(() => {
    if (RoomInfo.roomId) {
      setRoomId(RoomInfo.roomId);
    }
    if (RoomInfo.players.length) {
      setPlayerNames(
        RoomInfo.players.map((player) => player.playerName)
      );
    }
  }, [RoomInfo]);

  return (
    <div className="App">
      <Branding />
      <div className={"root-tv"}>
        <Grid container spacing={3}>
          <WaitingForUsers roomId={roomId} />
          <Grid item xs={6}>
            <PlayersList
              playerNames={playerNames}
              defaultMessage="Waiting for players"
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

function PlayersList(props: { playerNames: string[]; defaultMessage: string }) {
  const { playerNames, defaultMessage } = props;
  const displayPlayers = playerNames.length ? playerNames : [defaultMessage];
  const players = displayPlayers.map((name, idx) => (
    <Grid className="PlayerList-grid" item xl={4} key={idx}>
      <h2 className={`player-${idx}`}>{name}</h2>
    </Grid>
  ));
  return (
    <Grid
      container
      direction="row"
      alignContent="center"
      justify="center"
      style={{ height: "100%" }}
    >
      <Grid container direction="column">
        {displayPlayers.length > 0 && (
          <Grid xl={6}>
            <h2>Ready players:</h2>
          </Grid>
        )}
        <Grid xl={6}>
          <div className="PlayersList-div">{players}</div>
        </Grid>
      </Grid>
    </Grid>
  );
}

function WaitingForUsers(props: { roomId: number | null }) {
  const { roomId } = props;
  const url = document.location.host;
  return (
    <Grid item xs={6}>
      <div className="WaitingForUsers">
        <h3>Get tapping on your phone web browser to: </h3>
        <h2>{url}</h2>
        <h1>
          Room ID: <span>{roomId || "Waiting..."}</span>
        </h1>
      </div>
    </Grid>
  );
}
