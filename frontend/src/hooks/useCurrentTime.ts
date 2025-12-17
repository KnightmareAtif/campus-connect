import { useState, useEffect } from 'react';

/**
 * Hook that provides the current time and updates every minute
 * Used for real-time status updates based on timetables
 */
export const useCurrentTime = (updateIntervalMs = 60000) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, updateIntervalMs);

    return () => clearInterval(interval);
  }, [updateIntervalMs]);

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[currentTime.getDay()];
  };

  const getCurrentTimeString = () => {
    return currentTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  const isTimeInRange = (startTime: string, endTime: string) => {
    const current = getCurrentTimeString();
    return current >= startTime && current < endTime;
  };

  const getCurrentPeriod = (periodTimes: { start: string; end: string }[]) => {
    const current = getCurrentTimeString();
    for (let i = 0; i < periodTimes.length; i++) {
      if (current >= periodTimes[i].start && current < periodTimes[i].end) {
        return i + 1;
      }
    }
    return null;
  };

  return {
    currentTime,
    currentDay: getCurrentDay(),
    currentTimeString: getCurrentTimeString(),
    isTimeInRange,
    getCurrentPeriod,
  };
};

export default useCurrentTime;
