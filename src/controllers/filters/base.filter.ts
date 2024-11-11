import { FilterParams } from './ifilter.params';
import { FilterOptions } from './ifilter.options';

export abstract class BaseFilter {
    constructor(protected params: FilterParams) {}

    abstract getFilterOptions(): FilterOptions;
}
