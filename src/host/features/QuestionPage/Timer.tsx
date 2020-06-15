import React from "react";
import { LinearProgress } from "@material-ui/core";

export default function Timer({ durationS }: { durationS: number }) {
  const [counterMs, setCounterMs] = React.useState(durationS * 1000);
  // const [timeLeft, setTimeLeft] = React.useState(0);
  // let timeLeft = 60;

  React.useEffect(() => {
    if (counterMs > 0) {
      const timer = setInterval(() => {
        setCounterMs(Math.round(counterMs - 250));
      }, 250);
      return () => clearInterval(timer);
    }
  }, [counterMs]);

  const counterS = counterMs / 1000;
  const progressDecimal = counterS / durationS;
  return (
    <div className="Timer">
      <div>{Math.round(counterMs / 1000)}</div>
      <LinearProgress variant="buffer" value={(1 - progressDecimal) * 100} />
    </div>
  );
}
