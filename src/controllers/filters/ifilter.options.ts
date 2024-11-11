export interface FilterOptions {
    date?: string | { $gte: string; $lte: string };
    status?: number;
    teacherIds?: number[];
    studentsCount?: number | { $gte: number; $lte: number };
    page?: number;
    lessonsPerPage?: number;
}
