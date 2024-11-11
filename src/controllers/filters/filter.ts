import { BaseFilter } from './base.filter';
import { FilterOptions } from './ifilter.options';

export class Filter extends BaseFilter {
    getFilterOptions(): FilterOptions {
        const filterOptions: FilterOptions = {};

        filterOptions.date = this.parseDate(this.params.date);
        filterOptions.status = this.parseStatus(this.params.status);
        filterOptions.teacherIds = this.parseTeacherIds(this.params.teacherIds);
        filterOptions.studentsCount = this.parseStudentsCount(this.params.studentsCount);

        return filterOptions;
    }

    private parseDate(date: string): string | { $gte: string; $lte: string } | null {
        if (!date) return null;
        const dateRange = date.split(',');
        if (dateRange.length === 1) {
            return dateRange[0];
        } else if (dateRange.length === 2) {
            return { $gte: dateRange[0], $lte: dateRange[1] };
        }
        throw new Error('Invalid date format');
    }

    private parseStatus(status: any): number | undefined {
        if (status === undefined) return undefined;
        const statusNumber = parseInt(status.toString(), 10);
        if (![0, 1].includes(statusNumber)) {
            throw new Error('Status must be 0 or 1');
        }
        return statusNumber;
    }

    private parseTeacherIds(teacherIds: string): number[] | undefined {
        if (!teacherIds) return undefined;
        return teacherIds.split(',').map((id) => parseInt(id, 10));
    }

    private parseStudentsCount(studentsCount: string): number | { $gte: number; $lte: number } | null {
        if (!studentsCount) return null;
        const countRange = studentsCount.split(',');
        if (countRange.length === 1) {
            return parseInt(countRange[0], 10);
        } else if (countRange.length === 2) {
            return { $gte: parseInt(countRange[0], 10), $lte: parseInt(countRange[1], 10) };
        }
        throw new Error('Invalid studentsCount format');
    }
}
