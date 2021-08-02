/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />

interface ArchiveData {
    title: string;
    date: Date;
    update?: Date;
    category: string;
    tags: string[];
}

interface SerializableArchiveData extends Omit<ArchiveData, 'date' | 'update'> {
    date: string;
    update: string | null;
}
