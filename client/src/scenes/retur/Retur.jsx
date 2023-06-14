/* Create a new table called retur
Columns: itemName, price, quantity
*/

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from "@mui/material";
import { DataGrid, GridToolbar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import { shades } from "../../theme";
import ReturnItemForm from '../../components/ReturnItemForm';
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

function Retur() {
  const { AlertMessage, isVisible, getAlertMessage } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [reload, setReload] = useState(0);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'time', headerName: 'Created At', valueFormatter: params => new Date(params?.value).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false}), flex: 1},
    { field: 'item', headerName: 'Name', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
    { field: 'total', headerName: 'Total', valueFormatter: ({ value }) => currencyFormatter.format(value), type: 'number', flex: 1 },
  ];

  useEffect(() => {
    getData();
  },[reload])

  async function getData() {
    const retur = await fetch(
      "http://localhost:1337/api/returs",
      { method: "GET" }
    );
    const returJson = await retur.json();
    console.log("returJson", returJson)

    let dataForTable = []
    returJson.data.map(x => {
      dataForTable.push({
        id: x.id,
        time: x.attributes.createdAt,
        item: x.attributes.itemName,
        price: x.attributes.price,
        quantity: x.attributes.quantity,
        total: x.attributes.price * x.attributes.quantity,
      })
    });
    console.log('dataForTable', dataForTable)
    setRows(dataForTable)
  }
  console.log(rows)

  async function handleAddRetur (name, price, quantity) {
    console.log(name, price, quantity)

    const response = await fetch("http://localhost:1337/api/returs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({data: { itemName: name, price, quantity }}),
      //body: JSON.stringify({ data: { name: 'Siomay', price: 10, count: 1 } }),
    });
    const session = await response.json();

    console.log(session)
    if (response) {
      console.log(response)
      if (response.status === 200) {
        console.log("SUCCESS");
        getAlertMessage('success', "Data is saved.")
      }
    }
    if (session.error) {
      console.log(session);
      getAlertMessage('warning', session.error.name || session.error.title)
    }
    setOpen(false);
    setReload(reload + 1);
  }

  return (
    <Box width="80%" margin="80px auto">
      <Typography variant="h3" textAlign="center">
        <b>Retur</b>
      </Typography>
      <Button
        sx={{
          backgroundColor: shades.primary[400],
          color: "white",
          borderRadius: 0,
          padding: "20px 40px",
          m: "20px 0",
          "&:hover": {backgroundColor: shades.primary[300]} 
        }}
        onClick={() => setOpen(true)}  
      >
        Add Retur
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        //pageSizeOptions={[5]}
        //pageSizeOptions={[5, 10, 15, 20, 25]}
        //slots={{toolbar: CustomToolbar}}
        //disableRowSelectionOnClick
        rowHeight={30}
        //getRowHeight={() => 'auto'}
        //onRowEditCommit={(id, event) => console.log(id, event)}
        autoHeight
        //autoPageSize
      />
      <ReturnItemForm 
        open={open} 
        handleClose={() => setOpen(false)} 
        handleSubmit={handleAddRetur}
      />
      {isVisible === true ? <AlertMessage /> : ''}
    </Box>
  )
}

export default Retur;
