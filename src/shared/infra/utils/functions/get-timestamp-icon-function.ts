import { CLOCK_HOURS_EMOJI, SATELITE_EMOJI } from '../constants';

export function getTimestampIcon(date: Date) {
  const hours = date.getHours();

  const time = hours > 6 && hours < 18 ? 'DAY' : 'NIGHT';

  const isAM = hours < 12;

  const hour = isAM ? `${hours}H00` : `${hours - 12}H00`;

  return `${SATELITE_EMOJI[time]} ${CLOCK_HOURS_EMOJI[hour]}`;
}
