import React, { useState, useEffect } from "react";
import "./PlayersGuessingPage.scss";
import { Branding } from "../../../core-common/Branding";
import { PageProps } from "../PageProps";
import { QuestionSection } from "../common/components/QuestionSection";
import { PlayerGuessTicker } from "../../../core-common/PlayerGuessTicker/PlayerGuessTicker";
import { PlayerGuessInput } from "../common/components/PlayerGuessInput";

export function PlayersGuessingPage(props: PageProps) {
  const { EmojiGame } = props.state;
  const answerSlotsN = EmojiGame.Question.EmojiCount;
  const prompt = EmojiGame.GuessFirst.Question.PromptEmoji || [];
  const subject = EmojiGame.Question.Subject || "Describe something";

  // TODO: add simple hashing and standardize impl across server + client
  const toSecret = (secret: string) => {
    return secret
      .toLocaleLowerCase()
      .split(" ")
      .filter((word) => word)
      .join("_");
  };

  // TODO: do this server-side
  const secretToGuess = toSecret(
    EmojiGame.GuessFirst.Question.Secret || "secret"
  );
  const [guessInput, setGuessInput] = useState<string | null>(null);
  const [tickerClear, setTickerClear] = useState(false);

  const onPromptSubmitted = (promptAnswer: string): boolean => {
    const secretMatch = toSecret(promptAnswer) === secretToGuess;
    if (!secretMatch) {
      props.setMessage.WrongGuess({
        payload: { promptAnswer },
      });
      setGuessInput(promptAnswer);
      return false;
    }
    setGuessInput("");
    setTickerClear(true);
    props.setMessage.CorrectGuess({
      payload: { promptAnswer },
    });
    return secretMatch;
  };

  useEffect(() => {
    if (tickerClear) setTickerClear(false);
  }, [tickerClear]);

  const [toggleOn, setToggleOn] = useState(false);

  return (
    <div onClick={() => setToggleOn(!toggleOn)}>
      <Branding />
      <QuestionSection
        emojiCount={answerSlotsN}
        playerPrompt={{ type: "emoji", emoji: prompt }}
        subject={subject}
      />
      <PlayerGuessInput onGuess={onPromptSubmitted} />
      <PlayerGuessTicker
        latestGuess={guessInput}
        displayCount={5}
        clear={tickerClear}
      />
    </div>
  );
}
