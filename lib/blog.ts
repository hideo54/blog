import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import dayjs from 'dayjs';
import { countBy } from 'lodash';
import fs from 'fs/promises';
import matter from 'gray-matter';

export const getArchivesData = async () => {
    const archivesDir = './archives/';
    const archiveFilenames = await fs.readdir(archivesDir);
    const archivesData = await Promise.all(
        archiveFilenames.filter(filename => filename.endsWith('.mdx')).map(filename =>
            fs.readFile(archivesDir + filename, 'utf-8').then(d => {
                const file = matter(d, {
                    excerpt: true,
                    excerpt_separator: '<!-- more -->',
                });
                const data = file.data as ArchiveData;
                const serializableData: SerializableArchiveData = {
                    ...data,
                    date: data.date.toISOString(),
                    update: data.update ? data.update?.toISOString() : null,
                };
                const excerptMarkdown = file.excerpt || '';
                const excerptSourcePromise = serialize(excerptMarkdown);
                return Promise.all([serializableData, excerptMarkdown, excerptSourcePromise]);
            }).then(([data, excerptMarkdown, excerptSource]) => ({
                data,
                excerptMarkdown,
                excerptSource,
                filename: filename.split('.')[0],
            }))
        )
    );
    archivesData.sort((a, b) => dayjs(a.data.date) < dayjs(b.data.date) ? 1 : -1);
    return archivesData;
};

export const getCategoryCounts = async (archivesData: {
    data: SerializableArchiveData;
    excerptSource: MDXRemoteSerializeResult<Record<string, unknown>>;
    filename: string;
}[]) => {
    const categories = archivesData.map(archiveData => archiveData.data.category);
    const categoryCount = countBy(categories);
    const categoryCountsSorted = Object.entries(categoryCount).sort((a, b) =>
        a[1] < b[1] ? 1 : -1
    ).map(([category, categoryCount]) => ({
        category, categoryCount,
        latest: dayjs(
            archivesData.filter(
                archiveData => archiveData.data.category === category
            )[0].data.date
        ).format('YYYY年M月D日'),
    }));
    return categoryCountsSorted;
};

export const getTagCounts = async (archivesData: {
    data: SerializableArchiveData;
    excerptSource: MDXRemoteSerializeResult<Record<string, unknown>>;
    filename: string;
}[]) => {
    const tags = archivesData.map(archiveData => archiveData.data.tags);
    const tagCount = countBy(tags.flat());
    const tagCountsSorted = Object.entries(tagCount).sort((a, b) =>
        a[1] < b[1] ? 1 : -1
    ).filter(([, tagCount]) => tagCount > 1)
        .map(([tag, tagCount]) => ({
            tag, tagCount,
            latest: dayjs(
                archivesData.filter(
                    archiveData => archiveData.data.tags.includes(tag)
                )[0].data.date
            ).format('YYYY年M月D日'),
        }));
    return tagCountsSorted;
};

export const getBodySource = async (id: string) => {
    const archivePath = `./archives/${id}.mdx`;
    const fileText = await fs.readFile(archivePath, 'utf-8');
    const file = matter(fileText);
    const bodySource = await serialize(file.content);
    return bodySource;
};
