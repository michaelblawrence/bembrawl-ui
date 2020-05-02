import React from "react";
import { Branding } from "../../../core-common/Branding";
import { Grid, Box } from "@material-ui/core";
import "./EndScores.scss";
import { PageProps } from "../PageProps";

export function EndScores(props: PageProps) {
  // const { EmojiGame, RoomInfo } = props.state;
  
  return (
    <div className="ResultsPage">
      <Branding />
      <Grid
        container
        direction="column"
        alignContent="center"
        justify="center"
        alignItems="center"
        className="EndScoreTable"
      >
        <Grid container direction="row" className="ScoreRow">
          <ScoreCard />
          <ScoreCard />
          <ScoreCard />
          <ScoreCard />
        </Grid>

        <Grid
          container
          direction="row"
          className="ScoreRow"
        >
          <ScoreCard />
          <ScoreCard />
          <ScoreCard />
          <ScoreCard />
        </Grid>
      </Grid>
    </div>
  );
}

function ScoreCard() {
  return (
    <Grid
      container
      justify="center"
      direction="column"
      alignContent="center"
      alignItems="center"
      spacing={4}
      xs={3}
      className="ScoreCard"
    >
      <Box
        borderRadius="100%"
        width={1 / 2}
        height={3 / 8}
        className="ScoreCardCenter"
      >
        player
        <br />
        score
      </Box>
    </Grid>
  );
}
