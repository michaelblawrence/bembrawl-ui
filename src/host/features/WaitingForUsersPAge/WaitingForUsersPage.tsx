import React from "react";
import { PageState } from "../../enums/PageState";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import { Input, Button, Grid, Paper } from "@material-ui/core";
import { WaitingMessage } from "../../../core-common/WaitingMessage";

export function WaitingForUsersPage(props: { setPage: (page: PageState) => void }) {

  const [playerNames] = useState(["player1", "player2"])

  const [roomId, setRoomId] = useState<number | null>(null);

  return (
    <div className="App">
      <Branding />
      <div className={"root-tv"}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper className={"paper"}>
              <div className="WaitingForUsers">
                <h1>Room ID: {roomId}</h1>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={6}>
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
    <Grid item xl={4} key={idx}>
      <h4>{name}</h4>
    </Grid>
  ));

  return (
    <Paper className={"paper"}>
      <Grid xl={6}>
        <div className="QuestionSection">
          {players}
        </div>
      </Grid>
    </Paper>
  );
}