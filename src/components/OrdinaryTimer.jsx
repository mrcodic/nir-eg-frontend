import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";

export default function OrdinaryTimer({ minutes, start, finish }) {
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    // Only reset the timer when `start` changes
    if (start) {
      const newEndTime = new Date();
      newEndTime.setSeconds(newEndTime.getSeconds() + Number(minutes) * 60);
      setEndTime(newEndTime);
    }
  }, [start]); // Dependency array ensures timer resets only when `start` changes

  if (!endTime) {
    return <p>02:00</p>;
  }

  const Completionist = () => <span>Time Out!</span>;
  function completeFun(x) {
    finish();
  }

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <Completionist />;
    } else {
      return (
        <span>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      );
    }
  };

  return (
    <Countdown date={endTime} renderer={renderer} onComplete={completeFun} />
  );
}
