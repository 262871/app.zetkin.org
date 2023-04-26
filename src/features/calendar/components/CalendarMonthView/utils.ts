import dayjs from 'dayjs';

/**
 * Returns the number of days that will be displayed which are before the first day
 * of the month
 */
export const getDaysBeforeFirstDay = (firstDayOfMonth: Date): number => {
  const daysBeforeFirstDay = firstDayOfMonth.getDay();
  if (daysBeforeFirstDay === 0) {
    return 6;
  } else {
    return daysBeforeFirstDay - 1;
  }
};

/**
 * Returns the index of the day within the grid.
 */
export const getDayIndex = (
  rowIndex: number,
  columnIndex: number,
  numberOfColumns: number
): number => {
  return columnIndex + rowIndex * numberOfColumns;
};

/**
 * Returns the week number for a row in the grid.
 */
export const getWeekNumber = (firstDayOfCalendar: Date, rowIndex: number) => {
  return dayjs(firstDayOfCalendar).add(rowIndex, 'week').isoWeek();
};
