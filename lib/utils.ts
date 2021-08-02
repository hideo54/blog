import dayjs, { Dayjs } from 'dayjs';

export const stringifyDate = (date: string | Date | Dayjs) => {
    const d = dayjs(date);
    const now = dayjs();
    const format = d.year === now.year ? 'M月D日' : 'YYYY年M月D日';
    return d.format(format);
};
