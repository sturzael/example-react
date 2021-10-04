// React - core
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

// components
import { FormattedMessage } from 'umi';
import { FilterOutlined } from '@ant-design/icons';
import { Checkbox, CheckboxOptionType, Popover, Tooltip } from 'antd';

type FilterAddonProps = {
  onColumnFilterChange: (arg0: (string | number)[]) => void;
  searchFilters: (string | number)[];
  filterOptions: CheckboxOptionType[];
  columnFields: (string | number)[];
};

const FilterAddon: FC<FilterAddonProps> = memo(
  ({
    filterOptions,
    onColumnFilterChange,
    searchFilters,
    columnFields,
  }: FilterAddonProps) => {
    const [isAllFieldsIndeterminate, setIsAllFieldsIndeterminate] =
      useState(false);
    const [allFields, setAllFields] = useState(true);

    useEffect(() => {
      const isIndeterminate =
        searchFilters.length && searchFilters.length !== columnFields.length;
      const isAllChecked = searchFilters.length === columnFields.length;

      setIsAllFieldsIndeterminate(isIndeterminate);
      setAllFields(isAllChecked);
    }, [searchFilters]);

    const toggleAll = useCallback(
      ({ target: { checked } }) => {
        onColumnFilterChange(checked ? columnFields : []);
        setIsAllFieldsIndeterminate(false);
        setAllFields(checked);
      },
      [columnFields],
    );

    const title = useMemo(
      () => (
        <div>
          <Checkbox
            indeterminate={isAllFieldsIndeterminate}
            checked={allFields}
            onChange={toggleAll}
          >
            <FormattedMessage id="component.search.filter.toggleAll" />
          </Checkbox>
        </div>
      ),
      [isAllFieldsIndeterminate, allFields, toggleAll],
    );

    const content = useMemo(
      () => (
        <div className="search-filter-options">
          <Checkbox.Group
            options={filterOptions}
            onChange={onColumnFilterChange}
            value={searchFilters}
          />
        </div>
      ),
      [filterOptions, onColumnFilterChange, searchFilters],
    );

    return (
      <Popover
        arrowPointAtCenter
        overlayClassName="search-filter"
        placement="bottomRight"
        trigger="click"
        title={title}
        content={content}
      >
        <Tooltip
          title={
            <FormattedMessage
              id="component.search.filter"
              defaultMessage="Filter"
            />
          }
        >
          <FilterOutlined />
        </Tooltip>
      </Popover>
    );
  },
);

FilterAddon.displayName = 'FilterAddon';

export default FilterAddon;
