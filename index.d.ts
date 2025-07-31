interface ArchiveData {
    title: string;
    date: Date;
    update?: Date;
    category: string;
    tags: string[];
    ogp?: string;
}

interface SerializableArchiveData extends Omit<ArchiveData, 'date' | 'update'> {
    date: string;
    update: string | null;
}
