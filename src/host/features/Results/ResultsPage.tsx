import React, { useState } from "react";
import { Branding } from "../../../core-common/Branding";
import { Grid } from "@material-ui/core";
import "./ResultsPage.css";
import { PageProps } from "../PageProps";

export function ResultsPage(props: PageProps) {
  const { EmojiGame, RoomInfo } = props.state;

  const playerAnswers = EmojiGame.PlayerAnswers;
  // Todo: refactor state methods (e.g. get user name from ID)
  const playerAnswersWithNames = playerAnswers?.map((answer) => {
    const playerName = RoomInfo.players.find(
      (player) => player.playerIndex == answer.playerIndex
    )?.playerName;
    return { ...answer, playerName: playerName };
  });

  return (
    <div className="ResultsPage">
      <Branding />
      <Grid
        container
        direction="column"
        alignContent="center"
        justify="center"
        className="ResultsTable"
        alignItems="center"
      >
        <Grid container direction="row">
          <Grid className="ColumnTitle">
            <h1>Player</h1>
          </Grid>
          <Grid className="ColumnTitle">
            <h1>Answer</h1>
          </Grid>
          <Grid className="ColumnTitle">
            <h1>Votes</h1>
          </Grid>
        </Grid>
        {playerAnswersWithNames?.map((answer) => (
          <Row
            playerName={answer.playerName || "Unknown"}
            playerAnswer={answer.answer}
            answerVotes={answer.votes}
          />
        )) || ( // TODO: add a separate component for Waiting message? like the branding banner?
          <Row playerName={""} playerAnswer={"Waiting..."} answerVotes={null} />
        )}
      </Grid>
    </div>
  );
}

function Row(props: {
  playerName: String;
  playerAnswer: String;
  answerVotes: Number | null;
}) {
  const { playerName, playerAnswer, answerVotes } = props;
  return (
    <Grid container direction="row">
      <Grid className="Cell">{playerName}</Grid>
      <Grid className="Cell">{playerAnswer}</Grid>
      <Grid className="Cell">{answerVotes || ""}</Grid>
    </Grid>
  );
}
