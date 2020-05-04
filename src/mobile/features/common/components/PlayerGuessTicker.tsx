import React, { useState, useEffect, useRef } from "react";
import "./PlayerGuessTicker.scss";
import { Grid } from "@material-ui/core";

export function PlayerGuessTicker(props: {
  latestGuess: string | null;
  displayCount: number;
  clear?: boolean;
}) {
  const { latestGuess, clear, displayCount } = props;
  const [guesses, setGuesses] = useState(latestGuess ? [latestGuess] : []);
  useEffect(() => {
    if (clear) return setGuesses([]);
    if (!latestGuess) return;
    setGuesses((guesses) => [...guesses, latestGuess]);
    // const handle = setTimeout(
    //   () =>
    //     setGuesses((guesses) =>
    //       guesses.slice(Math.max(0, guesses.length - numberItems))
    //     ),
    //   500
    // );
    // return () => clearTimeout(handle);
  }, [clear, latestGuess]);
  const [tickerHeight, setTickerHeight] = useState<number | null>(null);
  const ticker = useRef<HTMLDivElement>(null);
  useEffect(() => setTickerHeight(ticker.current?.clientHeight || null), [
    ticker,
  ]);

  const itemHeight = (tickerHeight || 0) / displayCount;

  return (
    <div
      className="PlayerGuessTicker"
      style={{ overflowY: "hidden" }}
      ref={ticker}
    >
      <TickerList
        displayCount={displayCount}
        guesses={guesses}
        itemHeight={itemHeight}
      />
    </div>
  );
}
function TickerList(props: {
  displayCount: number;
  guesses: string[];
  itemHeight: number;
}) {
  const { displayCount, guesses, itemHeight } = props;
  const itemOffset =
    guesses.length > displayCount
      ? -itemHeight * (guesses.length - displayCount)
      : 0;
  return (
    <div
      className="PlayerGuessTicker-Items"
      style={{
        position: "relative",
        top: itemOffset,
      }}
    >
      <Grid container justify="center">
        {guesses.map((guess, idx) => (
          <Grid
            item
            xs={9}
            key={guess + idx}
            style={{ height: itemHeight }}
            className="PlayerGuessTicker-Item"
          >
            {guess}
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
