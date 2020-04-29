import React, { useState } from "react";
import "./PlayersAnswerReviewPage.scss";
import { Branding } from "../../../core-common/Branding";
import { Grid, Button } from "@material-ui/core";
import { PageProps, EmojiAnswer } from "../PageProps";
import { EmojiRow } from "../../../core/components/EmojiGame/EmojiAnswers";

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
  const subject = EmojiGame.Question.Subject || "Describe something";
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

  const onVoteChanged = async (playerId: string, votesIncrement: number) => {
    return await new Promise<boolean>((res) =>
      setVotesUsed((votes) => {
        const nextVoteCount = votes + votesIncrement;
        if (nextVoteCount > maxAvailableVotes) {
          res(false);
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
        res(true);
        return nextVoteCount;
      })
    );
  };

  return (
    <div className="QuestionSectionReview">
      <Branding />
      <header className="QuestionSectionReview-header">
        <h1 className="QuestionSectionReview-question">
          "{subject}" in {emojiCount} emoji...
        </h1>
        <h2>You have {maxAvailableVotes - votesUsed} votes left to use</h2>
        <h2>{songTitle}</h2>
        <EmojiAnswerPrompt
          answers={answers}
          votes={voteMap}
          onVoteChanged={onVoteChanged}
        />
        <Button onClick={onConfirm} variant="contained">
          Confirm
        </Button>
      </header>
    </div>
  );
}

function EmojiAnswerPrompt(props: {
  answers: EmojiAnswer[];
  votes: VoteStateStore;
  onVoteChanged: (playerId: string, votesIncrement: number) => Promise<boolean>;
}) {
  const { answers, votes, onVoteChanged } = props;

  const slots = answers.map((answer, idx) => {
    const currentVotes = votes.get(answer.playerId)?.votes || 0;
    const onSlotClick = async () => {
      const didChange = await onVoteChanged(answer.playerId, 1);
      if (!didChange) await onVoteChanged(answer.playerId, -currentVotes);
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
        {/* <h4>{answer.responseEmoji.join(" ")}</h4> */}
        <EmojiRow emojiList={answer.responseEmoji} />
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
