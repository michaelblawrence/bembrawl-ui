import React, { useState } from "react";
import "./PlayersAnswerReviewPage.css";
import { Branding } from "../../../core-common/Branding";
import { Grid } from "@material-ui/core";
import { PageProps, EmojiAnswer } from "../PageProps";

export function PlayersAnswerReviewPage(props: PageProps) {
  const { EmojiGame } = props.state;
  const emojiCount = EmojiGame.Question.EmojiCount;
  const answers = EmojiGame.AnswerEmoji;
  const songTitle = EmojiGame.Question.Prompt || "Loading Song Title";

  return (
    <div>
      <Branding />
      <QuestionSection
        emojiCount={emojiCount}
        answers={answers}
        songTitle={songTitle}
      />
    </div>
  );
}

function QuestionSection(props: {
  emojiCount: number;
  answers: EmojiAnswer[];
  songTitle: string;
}) {
  const { emojiCount: rawEmojiCount, answers, songTitle } = props;
  const emojiCount = Math.max(0, Math.min(6, rawEmojiCount));

  return (
    <div className="QuestionSection">
      <header className="QuestionSection-header">
        <h1 className="QuestionSection-question">
          Describe a song in {emojiCount} emoji...
        </h1>
        <EmojiAnswerPrompt answers={answers} />
        <h2>{songTitle}</h2>
      </header>
    </div>
  );
}

function EmojiAnswerPrompt(props: { answers: EmojiAnswer[] }) {
  const { answers } = props;

  const slots = answers.map((answer, idx) => (
    <Grid item xl={4} xs={6} key={idx}>
      <h4>{answer.responseEmoji.join(" ")}</h4>
    </Grid>
  ));

  return (
    <div className="EmojiAnswerDisplay">
      <Grid className="EmojiAnswer" container justify="center" spacing={2}>
        {slots}
      </Grid>
    </div>
  );
}
