import { serialize } from 'next-mdx-remote/serialize';
import dayjs from 'dayjs';
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
                const excerptSourcePromise = serialize(file.excerpt);
                return Promise.all([ serializableData, excerptSourcePromise ]);
            }).then(([ data, excerptSource ]) => ({
                data, excerptSource,
                filename: filename.split('.')[0],
            }))
        )
    );
    archivesData.sort((a, b) => dayjs(a.data.date) < dayjs(b.data.date) ? 1 : -1);
    return archivesData;
};

export const getBodySource = async (id: string) => {
    const archivePath = `./archives/${id}.mdx`;
    const fileText = await fs.readFile(archivePath, 'utf-8');
    const file = matter(fileText);
    const bodySource = await serialize(file.content);
    return bodySource;
};
