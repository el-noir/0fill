export type ChatRole = 'user' | 'assistant';

export interface FieldProgress {
    fieldId: string;
    label: string;
    status: 'completed' | 'current' | 'upcoming' | 'skipped';
    questionNumber: number;
    sectionIndex: number;
}

export interface SectionProgress {
    sectionId: string;
    title: string;
    status: 'completed' | 'current' | 'upcoming';
    percentage: number;
    answeredCount: number;
    totalFields: number;
    pageNumber: number;
}

export interface ProgressDetail {
    percentage: number;
    answeredCount: number;
    totalFields: number;
    currentFieldIndex: number;
    fields: FieldProgress[];
    sections?: SectionProgress[];
    totalPages: number;
    currentPage: number;
}

export interface Message {
    role: ChatRole;
    content: string;
    timestamp?: string;
    progress?: number;
    state?: string;
    fieldSummaries?: Array<{
        label: string;
        value: string;
        fieldId: string;
    }>;
}
