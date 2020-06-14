import React, { useEffect } from "react";
import { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import { Grid } from "@material-ui/core";
import "./PlayersWaitingRoomPage.scss";
import { PageProps } from "../PageProps";

export function PlayersWaitingRoomPage(props: PageProps) {
  const { EmojiGame, RoomInfo } = props.state;
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  useEffect(() => {
    if (RoomInfo.players.length) {
      setPlayerNames(RoomInfo.players.map((player) => player.playerName));
    }
  }, [RoomInfo]);

  const promptPlayerName = EmojiGame.Question.PromptPlayerName || null;
  return (
    <div className="AppTv">
      <Branding />
      <div className={"root-tv"}>
        <Grid container>
          <WaitingRoomMessage promptPlayerName={promptPlayerName} />
          <Grid item xs={6}>
            <WaitingPlayersList
              playerNames={playerNames}
              defaultMessage="Players List"
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

function WaitingPlayersList(props: { playerNames: string[]; defaultMessage: string }) {
  const { playerNames, defaultMessage } = props;
  const displayPlayers = playerNames.length ? playerNames : [defaultMessage];
  const players = displayPlayers.map((name, idx) => (
    <Grid className="WaitingPlayersList-grid" item xl={4} key={idx}>
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
      className="WaitingPlayersList"
    >
      <Grid container direction="column">
        {playerNames.length > 0 && (
          <Grid xl={6} spacing={10}>
            <h2>Ready players:</h2>
          </Grid>
        )}
        <Grid xl={6} spacing={10}>
          <div className="PlayersList-div">{players}</div>
        </Grid>
      </Grid>
    </Grid>
  );
}

function WaitingRoomMessage(props: { promptPlayerName: string | null }) {
  const { promptPlayerName } = props;
  return (
    <Grid item xs={6}>
      <div className="WaitingRoomMessage">
        <h1>Welcome to the Waiting Room!</h1>
        {promptPlayerName && (
          <h2>Right now '{promptPlayerName}' is setting the question</h2>
        )}
        <h3>
          Keep an eye on this screen!
        </h3>
      </div>
    </Grid>
  );
}
