import React from "react";
import { LinearProgress } from "@material-ui/core";

export default function Timer({ duration }: { duration: number }) {
  const [counterMs, setCounterMs] = React.useState(duration * 1000);

  React.useEffect(() => {
    if (counterMs > 0) {
      const timer = setInterval(() => {
        setCounterMs(Math.round(counterMs - 250));
      }, 250);
      return () => clearInterval(timer);
    }
  }, [counterMs]);

  return (
    <div className="Timer">
      <div>{Math.round(counterMs / 1000)}</div>
      <LinearProgress
        variant="buffer"
        value={(1 - counterMs / 1000 / duration) * 100}
      />
    </div>
  );
}
