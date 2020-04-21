import React from "react";
import { PageState } from "../../enums/PageState";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import { Grid, Paper } from "@material-ui/core";
import "./WaitingForUsersPage.css";


export function WaitingForUsersPage(props: { setPage: (page: PageState) => void }) {

  const [playerNames] = useState(["player1", "player2", "player3", "player4", "player5", "player6", "player7", "player8"])

  const [roomId, setRoomId] = useState<number | null>(null);

  return (
    <div className="App">
      <Branding />
      <div className={"root-tv"}>
        <Grid container spacing={3}>
          <WaitingForUsers roomId={roomId}/>
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
      <h4 className={`player-${idx}`}>{name}</h4>
    </Grid>
  ));

  return (
    <Grid xl={6} spacing={10}>
      <div className="PlayersList-div">
        {players}
      </div>
    </Grid>
  );
}

function WaitingForUsers(props: { roomId: number | null }) {
  const { roomId } = props;
  return <Grid item xs={6}>
    <div className="WaitingForUsers">
      <h1>Room ID: {roomId || "Waiting..."}</h1>
    </div>
  </Grid>
}