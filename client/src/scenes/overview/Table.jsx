import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import { Container } from '@mui/material';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}

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
    flex: 6,
  },
];

export default function DataGridDemo() {
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
  //console.log(data)

  return (
    <Container>
    <Box sx={{ height: '80vh', width: '100%', marginTop: '5rem' }}>
      <Typography variant="h3" textAlign="center" mb="24px">
        <b>All Orders</b>
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[25]}
        slots={{toolbar: CustomToolbar}}
        disableRowSelectionOnClick
        rowHeight={40}
      />
    </Box>
    </Container>
  );
}