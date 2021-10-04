// React - core
import { ChangeEvent, memo, useEffect, useRef, useState } from 'react';

// components
import { useIntl } from 'umi';
import { CheckboxOptionType, Input, InputProps } from 'antd';
import FilterAddon from './components/FilterAddon';

// utils
import { isArray } from 'lodash';
import Fuse from 'fuse.js';

// types
import type { ProColumns } from '@ant-design/pro-table';

// styles - move search into separate
import './index.less';

// constants
const FUSE_THRESHOLD = 0.3;

type TableSearchProps<T> = {
  columns: ProColumns<any>[];
  columnFilter?: boolean;
  dataSet: T[];
  onSearch: (arg0: T[]) => void;
} & InputProps;

const TableSearch = memo(
  <T extends any>({
    columns,
    columnFilter = false,
    dataSet,
    onSearch,
    ...inputProps
  }: TableSearchProps<T>) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterOptions, setFilterOptions] = useState<CheckboxOptionType[]>(
      [],
    );
    const [searchFilters, setSearchFilters] = useState<string[]>([]);
    const [fuse, setFuse] = useState(null);

    const columnFields = useRef([]);
    const intl = useIntl();

    useEffect(() => {
      const { options, activeValues, fieldKeys } = columns.reduce<{
        options: CheckboxOptionType[];
        activeValues: string[];
        fieldKeys: string[];
      }>(
        (acc, { title: label, dataIndex }) => {
          if (!dataIndex) {
            return acc;
          }

          // join with . so that it's understandable to fuse.js - ant pro handles nested paths
          // as string[] while fuse.js is expecting a string so we concatenate them; e.g.: ['key1', 'key2'] => 'key1.key2'
          const value = isArray(dataIndex)
            ? dataIndex.join('.').toString()
            : dataIndex.toString();

          acc.options.push({ label, value });
          acc.activeValues.push(value);
          acc.fieldKeys.push(value);

          return acc;
        },
        { options: [], activeValues: [], fieldKeys: [] },
      );

      setFilterOptions(options);
      onColumnFilterChange(activeValues);
      columnFields.current = fieldKeys;
    }, []);

    useEffect(() => {
      const options = {
        keys: searchFilters,
        threshold: FUSE_THRESHOLD,
      };
      const fuseInstance = new Fuse(dataSet, options);

      setFuse(fuseInstance);
    }, [dataSet]);

    useEffect(() => {
      // if there's no query ('') then just set whatever we got when we last
      // queried the endpoint
      if (!searchQuery) {
        onSearch(dataSet);
        return;
      }

      // kill it if no fuse
      if (!fuse) return;

      const data = fuse.search(searchQuery);
      const parsedData = data.map(({ item }) => item);

      onSearch(parsedData);
    }, [fuse, searchQuery]);

    useEffect(() => {
      const options = {
        keys: searchFilters,
        threshold: FUSE_THRESHOLD,
      };
      const fuseInstance = new Fuse(dataSet, options);

      setFuse(fuseInstance);
    }, [searchFilters]);

    const onChange = ({
      target: { value },
    }: ChangeEvent<HTMLInputElement>): void => {
      setSearchQuery(value);
    };

    const onColumnFilterChange = (fields: string[]) => {
      setSearchFilters(fields);
    };

    return (
      <Input
        addonAfter={
          columnFilter && (
            <FilterAddon
              filterOptions={filterOptions}
              onColumnFilterChange={onColumnFilterChange}
              searchFilters={searchFilters}
              columnFields={columnFields.current}
            />
          )
        }
        placeholder={intl.formatMessage({
          id: 'component.search.placeholder',
          defaultMessage: 'Search',
        })}
        {...inputProps}
        onChange={onChange}
        value={searchQuery}
      />
    );
  },
);

export default TableSearch;
