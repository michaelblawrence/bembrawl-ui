import React, { useState } from "react";
import "./PlayersAnswerReviewPage.css";
import { Branding } from "../../../core-common/Branding";
import { Grid, Button } from "@material-ui/core";
import { PageProps, EmojiAnswer } from "../PageProps";

type VoteStateStore = Map<string, { id: string; votes: number }>;

export function PlayersAnswerReviewPage(props: PageProps) {
  
  const { EmojiGame } = props.state;
  const emojiCount = Math.max(0, Math.min(6, EmojiGame.Question.EmojiCount));
  const defaultAnswers: EmojiAnswer[] = [
    { playerId: "1", responseEmoji: ["emoji"] },
    { playerId: "2", responseEmoji: ["emoji"] },
    { playerId: "3", responseEmoji: ["emoji"] },
  ];
  const answers = EmojiGame.AnswerEmoji || defaultAnswers;
  const songTitle = EmojiGame.Question.Prompt || "Loading Song Title";
  const maxAvailableVotes = EmojiGame.maxAvailableVotes || 3;

  const [votesUsed, setVotesUsed] = useState(0);
  const [voteMap, setVoteMap] = useState(
    answers.reduce((a, c) => {
      a.set(c.playerId, { id: c.playerId, votes: c.sessionVotes || 0 });
      return a;
    }, new Map<string, { id: string; votes: number }>())
  );
  const onConfirm = () => {
    const entries = voteMap.entries();
    const playerIdVotes = Array.from(entries).map<[string, number]>(
      ([k, v]) => [k, v.votes]
    );
    props.setMessage.submitEmojiVotes({
      payload: { playerIdVotes: playerIdVotes },
    });
  };

  const onVoteChanged = (playerId: string, votesIncrement: number) => {
    setVotesUsed((votes) => {
      const nextVoteCount = votes + votesIncrement;
      if (nextVoteCount > maxAvailableVotes) {
        return votes;
      }
      const playersNextVotes = {
        id: playerId,
        votes: (voteMap.get(playerId)?.votes || 0) + votesIncrement,
      };
      setVoteMap(
        new Map<string, { id: string; votes: number }>(voteMap).set(
          playerId,
          playersNextVotes
        )
      );
      return nextVoteCount;
    });
  };

  const votesLeft = maxAvailableVotes - votesUsed;
  return (
    <div>
      <Branding />
      <div className="QuestionSectionReview">
        <header className="QuestionSectionReview-header">
          <h1 className="QuestionSectionReview-question">
            Describe a song in {emojiCount} emoji...
          </h1>
          <h2>You have {votesLeft} votes left to use</h2>
          <h2>{songTitle}</h2>
          <EmojiAnswerPrompt
            answers={answers}
            votes={voteMap}
            onVoteChanged={onVoteChanged}
            maxVotes={votesLeft}
          />
          <Button onClick={onConfirm}>Confirm</Button>
        </header>
      </div>
    </div>
  );
}

function EmojiAnswerPrompt(props: {
  answers: EmojiAnswer[];
  votes: VoteStateStore;
  onVoteChanged: (playerId: string, votesIncrement: number) => void;
  maxVotes: number;
}) {
  const { answers, votes, onVoteChanged, maxVotes } = props;

  const slots = answers.map((answer, idx) => {
    const currentVotes = votes.get(answer.playerId)?.votes || 0;
    const onSlotClick = () => {
      const nextVotes = (currentVotes + 1) % maxVotes;
      onVoteChanged(answer.playerId, nextVotes - currentVotes);
    };
    return (
      <Grid
        item
        xl={4}
        xs={6}
        className="EmojiAnswer-Item"
        key={idx}
        onClick={onSlotClick}
      >
        <h4>{answer.responseEmoji.join(" ")}</h4>
        <p>{currentVotes} Votes</p>
      </Grid>
    );
  });

  return (
    <div className="EmojiAnswerDisplay">
      <Grid className="EmojiAnswer" container justify="center">
        {slots}
      </Grid>
    </div>
  );
}
