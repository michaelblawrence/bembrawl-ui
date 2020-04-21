import React from "react";
import { PageState } from "../../enums/PageState";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import { Input, Button, Grid } from "@material-ui/core";
import { WaitingMessage } from "../../../core-common/WaitingMessage";

export function QuestionsAndAnswersPage(props: { setPage: (page: PageState) => void }) {

    const [playerNames] = useState(["player1", "player2"])

    const [roomId, setRoomId] = useState<number | null>(null);
    return (
      <div className="App">
        <Branding />
        <div className="WaitingForUsers">
          <h1>Enter room ID:</h1>
          <Grid xl={6} >
          </Grid>
        </div>
      </div>
    );
  }
