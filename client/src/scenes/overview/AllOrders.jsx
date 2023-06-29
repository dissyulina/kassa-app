import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import { Container } from '@mui/material';
import { shades } from "../../theme";
import { useSnackbar } from "../../hooks/useSnackbar";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
});

const formatDateTime = (params) => {
  const date = (params?.value).substring(0, 10);
  const time = new Date(params?.value).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
  
  return `${date} ${time}`
}

const columns = [
  {
    field: 'time',
    headerName: 'Created At',
    valueFormatter: formatDateTime,
    flex: 2,
  },
  {
    field: 'order',
    headerName: 'Orders',
    flex: 4,
  },
  {
    field: 'payment',
    headerName: 'Payment',
    flex: 1,
    editable: true,
    type: "singleSelect",
    valueOptions: [
      { value: '', label: "" },
      { value: 'sumup', label: "Sum Up" },
      { value: "cash", label: "Cash" },
      { value: "qrcode", label: "QR Code" },
    ],
    valueFormatter: ({ value }) => value === null ? '' : value,
  },
  {
    field: 'total',
    headerName: 'Total Paid',
    valueFormatter: ({ value }) => currencyFormatter.format(value),
    type: 'number',
    flex: 1,
  },
  {
    field: 'received',
    headerName: 'Total Received',
    valueFormatter: ({ value }) => currencyFormatter.format(value),
    type: 'number',
    flex: 1,
  },
];

export default function OrderOverview() {
  const { AlertMessage, isVisible, getAlertMessage } = useSnackbar();
  const [data, setData] = useState(null);
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [rowCountState, setRowCountState] = useState(0);

  useEffect(() => {
    getData();
  },[paginationModel])

  async function getData() {
    const orders = await fetch(
      `http://localhost:1337/api/orders?sort[1]=createdAt:desc&pagination[pageSize]=${paginationModel.pageSize}&pagination[page]=${paginationModel.page + 1}`,
      { method: "GET" }
    );
    const ordersJson = await orders.json();

    setRowCountState(ordersJson.meta.pagination.total);

    let dataForTable = []
    ordersJson.data.map(x => {
      dataForTable.push({
        id: x.id,
        time: x.attributes.createdAt,
        order: x.attributes.products.map(obj => `${obj.name}: ${obj.count}`).join(', '),
        payment: x.attributes.payment,
        total: x.attributes.total,
        received: x.attributes.payment === 'sumup' ? 0.981 * x.attributes.total : x.attributes.total
      })
    });
    setRows(dataForTable)

    let detailProductData = []
    ordersJson.data.map(x => x.attributes.products.map(y => {
      detailProductData.push({
        id: x.id,
        time: x.attributes.createdAt,
        [y.name]: y.count,
      })
    }))
    
    setData(ordersJson);
  }

  async function processRowUpdate(newRow) {
    const updatedRow = { ...newRow, isNew: false };

    const payload = { data: { payment: newRow.payment }}
    
    const response = await fetch(`http://localhost:1337/api/orders/${newRow.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const session = await response.json();
    if (response) {
      if (response.status === 200) {
        getAlertMessage('success', "Data is saved.")
      }
    }
    if (session.error) {
      console.log(session);
      getAlertMessage('warning', session.error.name || session.error.title)
    }

    return updatedRow;
  };

  return (
  <Container sx={{ margin: "80px auto"}} >
    <Box sx={{ width: '100%', height: '100%' }}>
      <Typography variant="h3" textAlign="center" mb="24px">
        <b>All Orders</b>
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{toolbar: CustomToolbar}}
        disableRowSelectionOnClick
        rowHeight={30}
        processRowUpdate={processRowUpdate}
        rowCount={rowCountState}
        pageSizeOptions={[5, 10, 15, 20, 25]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        sx={{ border: 0, 
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: shades.neutral[200],
          },
          // '&.MuiDataGrid-root .MuiDataGrid-cell': {
          //   padding: '5px 0',
          // },
        }}
      />
    </Box>
    {isVisible === true ? <AlertMessage /> : ''}
  </Container>
  );
}