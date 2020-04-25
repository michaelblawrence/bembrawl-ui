import React from "react";

export default function Timer({duration}: {duration: number} ) {
    const [counter, setCounter] = React.useState(duration);
    // const [timeLeft, setTimeLeft] = React.useState(0);
    // let timeLeft = 60;

    React.useEffect(() => {

      if (counter > 0){
        const timer = setInterval(() => {setCounter(Math.round(counter - 1));}, 1000);
        return () => clearInterval(timer);

      }
    }, [counter]);
  
    return (
      <div className="Timer">
        <div>Countdown: {Math.round(counter)}</div>
      </div>
    );
  }
  