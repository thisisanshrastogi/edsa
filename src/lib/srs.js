const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function snapToStartOfDay(timestamp) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export const GRADES = {
  AGAIN: 'AGAIN',
  HARD: 'HARD',
  GOOD: 'GOOD',
  EASY: 'EASY'
};

export function schedule(card, grade, now = Date.now()) {
  let currentCard = card || {
    ease: 2.5,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: snapToStartOfDay(now),
    lastReviewed: null,
    previousState: null
  };

  // Same-day override: If reviewed within the last 12 hours, treat this as 
  // correcting a mistake rather than a brand new repetition.
  if (currentCard.lastReviewed && (now - currentCard.lastReviewed) < 12 * 60 * 60 * 1000) {
    if (currentCard.previousState) {
      currentCard = currentCard.previousState;
    }
  }

  const stateSnapshot = { ...currentCard };
  let { ease, interval, reps, lapses, lastReviewed } = currentCard;

  const actualDaysElapsed = lastReviewed 
    ? Math.max(0, (now - lastReviewed) / MS_PER_DAY) 
    : 0;

  if (grade === GRADES.AGAIN) {
    reps = 0;
    lapses += 1;
    interval = 0;
    ease = Math.max(1.3, ease - 0.2);
  } else {
    reps += 1;
    
    if (reps === 1) {
      if (grade === GRADES.HARD) {
        interval = 2;
        ease = Math.max(1.3, ease - 0.15);
      } else if (grade === GRADES.GOOD) {
        interval = 4;
      } else if (grade === GRADES.EASY) {
        interval = 9;
        ease += 0.15;
      }
    } else {
      let baseInterval;
      if (reps === 2) {
        baseInterval = 7;
      } else {
        const effectiveInterval = (grade === GRADES.GOOD || grade === GRADES.EASY) && lastReviewed && actualDaysElapsed < interval
          ? actualDaysElapsed
          : interval;
        baseInterval = effectiveInterval * ease;
      }

      if (grade === GRADES.HARD) {
        interval = baseInterval * 0.8;
        ease = Math.max(1.3, ease - 0.15);
      } else if (grade === GRADES.GOOD) {
        interval = baseInterval;
      } else if (grade === GRADES.EASY) {
        interval = baseInterval * 1.3;
        ease += 0.15;
      }
      
      interval = Math.min(365, Math.max(1, Math.round(interval)));
    }
  }

  const due = snapToStartOfDay(now + interval * MS_PER_DAY);

  return {
    ease,
    interval,
    reps,
    lapses,
    due,
    lastReviewed: now,
    previousState: stateSnapshot,
    lastGrade: grade
  };
}
