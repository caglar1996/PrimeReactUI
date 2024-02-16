import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { highlightMatches } from '../../Utils/DataTableUtils';

const defaultAscendingSort = true; // Varsayılan sıralama durumu: küçükten büyüğe

export default function CustomDataTable({
  columns,
  value,
  first,
  rows,
  totalRecords,
  globalFilterValue,
  loading,
  setColumns,
  setSortedColumn,
  onPageChange,
  onGlobalFilterChange,
  onGlobalFilterEnterPress,
}) {
  useEffect(() => {}, []);

  const dataTableHeaderTemplate = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            onKeyDown={onGlobalFilterEnterPress}
            placeholder="Kelime + Enter"
            disabled={loading}
          />
        </span>
      </div>
    );
  };

  const columnHeaderTemplate = (col) => {
    return (
      <>
        {col.sortable ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleColumnHeaderClick(col.field);
            }}
            style={{ cursor: 'pointer' }}
          >
            <span>{col.header}</span>
            <i
              style={{ paddingLeft: '5px' }}
              className={`pi pi-sort-${
                col.ascendingSort === null
                  ? 'alt'
                  : col.ascendingSort
                  ? 'amount-down-alt'
                  : 'amount-up'
              }`}
            />
          </div>
        ) : (
          <div>
            <span>{col.header}</span>
          </div>
        )}
      </>
    );
  };

  const defaultColumnTemplate = (rowData, column) => {
    const field = column.field;
    const value = rowData[field];

    return (
      <span
        dangerouslySetInnerHTML={{
          __html: highlightMatches(value, globalFilterValue),
        }}
      />
    );
  };

  const handleColumnHeaderClick = (field) => {
    console.log('🚀 ~ handleColumnHeaderClick ~ field:', field);

    const newColumns = columns.map((col) => ({
      ...col,
      ascendingSort:
        col.field === field
          ? col.ascendingSort === null
            ? defaultAscendingSort
            : !col.ascendingSort
          : null,
    }));

    setColumns(newColumns);

    const selectedColumn = newColumns.find((col) => col.field === field);
    setSortedColumn({
      field: selectedColumn.field,
      ascendingSort: selectedColumn.ascendingSort,
    });
  };

  return (
    <div className="card">
      <DataTable
        header={dataTableHeaderTemplate}
        value={value}
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPage={onPageChange}
        loading={loading}
      >
        {columns.map((column, index) => {
          return (
            <Column
              key={index}
              field={column.field}
              header={columnHeaderTemplate(column)}
              style={{ fontWeight: `${column.fontWeight}` }}
              body={
                column.columnTemplate
                  ? column.columnTemplate
                  : defaultColumnTemplate
              }
            />
          );
        })}
      </DataTable>
      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onPageChange={onPageChange}
      />
    </div>
  );
}
