import React, { useEffect } from "react";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import { Grid } from "@material-ui/core";
import "./WaitingForUsersPage.css";
import { PageProps } from "../PageProps";

export function WaitingForUsersPage(props: PageProps) {
  const { RoomInfo } = props.state;

  const [playerNames, setPlayerNames] = useState(["Waiting for players"]);
  const [roomId, setRoomId] = useState<number | null>(null);

  useEffect(() => {
    if (RoomInfo.roomId) {
      setRoomId(RoomInfo.roomId);
    }
    if (RoomInfo.players.length) {
      setPlayerNames(
        RoomInfo.players.map((player) => `Player ${player.playerId}`)
      );
    }
  }, [RoomInfo]);

  return (
    <div className="App">
      <Branding />
      <div className={"root-tv"}>
        <Grid container spacing={3}>
          <WaitingForUsers roomId={roomId} />
          <Grid item xs={6} spacing={3}>
            <PlayersList playerNames={playerNames} />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

function PlayersList(props: { playerNames: string[] }) {
  const { playerNames } = props;
  const players = playerNames.map((name, idx) => (
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
      <Grid xl={6} spacing={10}>
        <div className="PlayersList-div">{players}</div>
      </Grid>
    </Grid>
  );
}

function WaitingForUsers(props: { roomId: number | null }) {
  const { roomId } = props;
  return (
    <Grid item xs={6}>
      <div className="WaitingForUsers">
        <h1>Room ID: {roomId || "Waiting..."}</h1>
      </div>
    </Grid>
  );
}
