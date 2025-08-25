import { describe, it, expect } from 'vitest';
import { formatHeaderDate } from '../lib/date';

describe('formatHeaderDate', () => {
  it('formats correctly', () => {
    const date = new Date('2025-08-25T00:00:00Z');
    expect(formatHeaderDate(date)).toContain('25/08/2025');
  });
});
