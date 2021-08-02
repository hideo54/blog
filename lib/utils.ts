import dayjs from 'dayjs';

export const stringifyDate = (date: Date) => {
    const d = dayjs(date);
    const now = dayjs();
    const format = d.year === now.year ? 'M月D日' : 'YYYY年M月D日';
    return d.format(format);
};
