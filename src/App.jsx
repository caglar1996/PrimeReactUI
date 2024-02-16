import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomDataTable from './components/DataTables/CustomDataTables';
import { Button } from 'primereact/button';
import { DateTimeConvertTr } from './Utils/DateTimeUtils';
import { highlightMatches } from './Utils/DataTableUtils';

function App() {
  const [data, setData] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [globalSearchInput, setGlobalSearchInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [sortedColumn, setSortedColumn] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchValue.length == 0 || searchValue.length > 2) fetchData();
  }, [currentPage, rows, searchValue, sortedColumn]);

  const fetchData = () => {
    let url =
      `http://localhost:5181/api/wheel-log/global-search?` +
      `searchValue=${searchValue}&` +
      `page=${currentPage}&` +
      `pageSize=${rows}&` +
      `orderByProperty=${sortedColumn ? sortedColumn.field : ''}&` +
      `ascending=${sortedColumn ? sortedColumn.ascendingSort : true}`;

    //console.log('🚀 ~ fetchData ~ url:', url);

    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        setData(response.data.results);
        setTotalRecords(response.data.rowCount);
        setLoading(false);
      })
      .catch((error) => {
        // İstek başarısız ise burada hata işlemleri yapabilirsiniz.
        console.error(error);
        setLoading(false);
      });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;

    setGlobalSearchInput(value);

    if (value.length === 0) {
      setSearchValue('');
      setCurrentPage(1);
      setFirst(1);
    }
  };

  const onGlobalFilterEnterPress = (e) => {
    if (e.key === 'Enter') {
      setSearchValue(globalSearchInput);
    }
  };

  const onPageChange = (event) => {
    setCurrentPage(event.page + 1);
    setFirst(event.first);
    setRows(event.rows);
  };

  function showState(params) {
    console.log('🚀 ~ App ~ params:', globalSearchInput);
  }

  const customInsertDateColumnTemplate = (rowData, field) => {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: highlightMatches(
            DateTimeConvertTr(rowData.insertDate),
            globalSearchInput
          ),
        }}
      />
    );
  };

  const customColumnCollection = [
    {
      header: 'Id',
      field: 'id',
      visible: true,
      sortable: true,
      ascendingSort: true,
    },
    {
      header: 'User Id',
      field: 'userId',
      visible: true,
      sortable: true,
      ascendingSort: null,
    },
    {
      header: 'EQUIPMENT',
      field: 'equipment',
      visible: true,
      sortable: true,
      ascendingSort: null,
    },
    {
      header: 'INSERT_DATE',
      field: 'insertDate',
      visible: true,
      sortable: true,
      ascendingSort: null,
      columnTemplate: customInsertDateColumnTemplate,
    },
    {
      header: 'CURRENT_PERSONAL',
      field: 'currentPersonal',
      visible: true,
      sortable: true,
      ascendingSort: null,
    },
  ];

  const [colums, setColumns] = useState(customColumnCollection);

  return (
    <>
      <CustomDataTable
        columns={colums}
        setColumns={setColumns}
        value={data}
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        globalFilterValue={globalSearchInput}
        setSortedColumn={setSortedColumn}
        loading={loading}
        onPageChange={onPageChange}
        onGlobalFilterChange={onGlobalFilterChange}
        onGlobalFilterEnterPress={onGlobalFilterEnterPress}
      ></CustomDataTable>
      <Button onClick={showState}>Show</Button>
    </>
  );
}

export default App;
