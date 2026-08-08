import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns';

export function getDateRangeFromPreset(preset: string): { start: Date; end: Date } {
  const now = new Date();

  switch (preset) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
    case 'yesterday':
      const yesterday = subDays(now, 1);
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday),
      };
    case 'last_7_days':
      return {
        start: startOfDay(subDays(now, 7)),
        end: endOfDay(now),
      };
    case 'last_30_days':
      return {
        start: startOfDay(subDays(now, 30)),
        end: endOfDay(now),
      };
    case 'last_90_days':
      return {
        start: startOfDay(subDays(now, 90)),
        end: endOfDay(now),
      };
    case 'this_month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    case 'last_month':
      const lastMonth = subMonths(now, 1);
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      };
    default:
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
  }
}

export function getPreviousDateRange(currentRange: { start: Date; end: Date }): { start: Date; end: Date } {
  const duration = currentRange.end.getTime() - currentRange.start.getTime();
  const start = new Date(currentRange.start.getTime() - duration);
  const end = new Date(currentRange.end.getTime() - duration);

  return { start, end };
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  const days: Date[] = [];
  let current = start;

  while (current <= end) {
    days.push(new Date(current));
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }

  return days;
}
