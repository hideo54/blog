import { serialize } from 'next-mdx-remote/serialize';
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
    return archivesData;
};
