import React from "react";
import { useState, useEffect } from "react";

export function WaitingMessage() {
  const WaitingMsgs = [
    "Prepping emoji",
    "Thinking up jokes",
    "Finding new trash TV",
    "Initializing ideas",
    "Starting the mainframe",
  ];
  const [waitingMsg, setWaitingMsg] = useState("");
  useEffect(() => {
    const randIdx = () =>
      Math.floor(Math.random() * (WaitingMsgs.length - 0.01));
    const interval = setInterval(
      () => setWaitingMsg(WaitingMsgs[randIdx()]),
      5000
    );
    return () => clearInterval(interval);
  });
  return <h2>{waitingMsg ? waitingMsg + "..." : "👋"}</h2>;
}
