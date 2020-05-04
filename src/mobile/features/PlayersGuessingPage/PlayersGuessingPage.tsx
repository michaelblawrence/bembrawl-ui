import React, { useState, useEffect } from "react";
import "./PlayersGuessingPage.scss";
import { Branding } from "../../../core-common/Branding";
import { PageProps } from "../PageProps";
import { QuestionSection } from "../common/components/QuestionSection";
import { PlayerGuessTicker } from "../common/components/PlayerGuessTicker";
import { PlayerGuessInput } from "../common/components/PlayerGuessInput";

export function PlayersGuessingPage(props: PageProps) {
  const { GuessFirstGame } = props.state;
  const answerSlotsN = GuessFirstGame.Question.EmojiCount;
  const prompt = GuessFirstGame.Question.Prompt || "Loading Song Title";
  const subject = GuessFirstGame.Question.Subject || "Describe something";

  const toSecret = (secret: string) => {
    return secret
      .toLocaleLowerCase()
      .split(" ")
      .filter((word) => word)
      .join("_");
  };

  const secretToGuess = toSecret(GuessFirstGame.Question.Secret || "secret");
  const [guessInput, setGuessInput] = useState<string | null>(null);

  const [tickerClear, setTickerClear] = useState(false);

  const onPromptSubmitted = (promptAnswer: string): boolean => {
    const secretMatch = toSecret(promptAnswer) === secretToGuess;
    if (!secretMatch) {
      setGuessInput(promptAnswer);
      return false;
    }
    setGuessInput("");
    setTickerClear(true);
    props.setMessage.SubmitPromptMatch({
      payload: { promptAnswer, promptEmoji: prompt, promptSubject: subject },
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
        playerPrompt={prompt}
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
