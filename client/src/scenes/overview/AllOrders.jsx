import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import { Container } from '@mui/material';
import { shades } from "../../theme";

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

const columns = [
  {
    field: 'time',
    headerName: 'Created At',
    valueFormatter: params => new Date(params?.value).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false}),
    flex: 1,
  },
  {
    field: 'order',
    headerName: 'Orders',
    flex: 3,
  },
  {
    field: 'payment',
    headerName: 'Payment',
    flex: 1,
    editable: true,
      type: "singleSelect",
      valueOptions: [
        { value: 'sumup', label: "Sum Up" },
        { value: "cash", label: "Cash" },
        { value: "qrcode", label: "QR Code" },
      ],
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
  const [data, setData] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getData();
  },[])

  async function getData() {
    const orders = await fetch(
      "http://localhost:1337/api/orders",
      { method: "GET" }
    );
    const ordersJson = await orders.json();
    console.log("ordersJson", ordersJson)

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
    
    console.log("data", dataForTable)
    setData(ordersJson);
  }
  console.log(data)

  return (
  <Container sx={{ margin: "80px auto"}} >
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" textAlign="center" mb="24px">
        <b>All Orders</b>
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        //pageSizeOptions={[10, 20, 25]}
        slots={{toolbar: CustomToolbar}}
        disableRowSelectionOnClick
        rowHeight={30}
        //getRowHeight={() => 'auto'}
        onRowEditCommit={(id, event) => console.log(id, event)}
        initialState={{
          sorting: {
            sortModel: [{ field: 'time', sort: 'desc' }],
          },
        }}
        //autoHeight
       // autoPageSize
       pageSize={25}
        pagination
        sx={{ border: 0, '& .MuiDataGrid-columnHeaders': {
          backgroundColor: shades.neutral[200]
        }}}
      />
    </Box>
  </Container>
  );
}