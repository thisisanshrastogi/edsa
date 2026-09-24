import { describe, it, expect } from 'vitest';
import { schedule, GRADES, snapToStartOfDay } from './srs';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

describe('schedule()', () => {
  const now = new Date('2026-09-24T12:00:00Z').getTime();

  it('initializes a new card on first GOOD attempt', () => {
    const next = schedule(null, GRADES.GOOD, now);
    expect(next.ease).toBe(2.5);
    expect(next.interval).toBe(4);
    expect(next.reps).toBe(1);
    expect(next.lapses).toBe(0);
    expect(next.lastReviewed).toBe(now);
    expect(next.due).toBe(snapToStartOfDay(now + 4 * MS_PER_DAY));
  });

  it('adjusts first attempt based on grade', () => {
    const hardNext = schedule(null, GRADES.HARD, now);
    expect(hardNext.interval).toBe(2);
    expect(hardNext.ease).toBe(2.35); // 2.5 - 0.15

    const easyNext = schedule(null, GRADES.EASY, now);
    expect(easyNext.interval).toBe(9);
    expect(easyNext.ease).toBe(2.65); // 2.5 + 0.15
  });

  it('handles AGAIN correctly and increments lapses', () => {
    const card = {
      ease: 2.5, interval: 7, reps: 2, lapses: 0, lastReviewed: now - 7 * MS_PER_DAY
    };
    const next = schedule(card, GRADES.AGAIN, now);
    expect(next.interval).toBe(0);
    expect(next.reps).toBe(0);
    expect(next.lapses).toBe(1);
    expect(next.ease).toBe(2.3); // 2.5 - 0.2
  });

  it('does not drop ease below 1.3', () => {
    const card = { ease: 1.4, interval: 5, reps: 3, lapses: 2, lastReviewed: now - 5 * MS_PER_DAY };
    const next = schedule(card, GRADES.AGAIN, now);
    expect(next.ease).toBe(1.3);
  });

  it('caps interval at 365 days', () => {
    const card = { ease: 2.5, interval: 300, reps: 5, lapses: 0, lastReviewed: now - 300 * MS_PER_DAY };
    const next = schedule(card, GRADES.EASY, now);
    expect(next.interval).toBe(365);
  });

  it('adjusts effective interval on early GOOD/EASY review', () => {
    // Supposed to be 10 days interval, but reviewed after 4 days
    const card = { ease: 2.5, interval: 10, reps: 3, lapses: 0, lastReviewed: now - 4 * MS_PER_DAY };
    
    // With GOOD, effective interval = 4 (elapsed), next base = 4 * 2.5 = 10
    const next = schedule(card, GRADES.GOOD, now);
    expect(next.interval).toBe(10); // 4 * 2.5 = 10

    // Without early review logic, it would have been 10 * 2.5 = 25.
  });

  it('does not use early review logic for HARD', () => {
    const card = { ease: 2.5, interval: 10, reps: 3, lapses: 0, lastReviewed: now - 4 * MS_PER_DAY };
    const next = schedule(card, GRADES.HARD, now);
    // effective interval = 10 (stored), base = 10 * 2.5 = 25, interval = 25 * 0.8 = 20
    expect(next.interval).toBe(20);
    expect(next.ease).toBe(2.35);
  });
});
