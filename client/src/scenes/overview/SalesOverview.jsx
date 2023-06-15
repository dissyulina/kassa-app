import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import { DataGrid, GridToolbar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import { shades } from "../../theme";

const StyledCard = styled(Card)({
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'center', 
  alignItems:'center', 
  padding: '2rem',  
  width:'200px',
  backgroundColor: shades.neutral[100],
  borderRadius: '10px'
});

function SalesOverview() {
  const [ordersData, setOrdersData] = useState([]);
  const [ordersQuantityData, setOrdersQuantityData] = useState([]);
  const [ordersPaymentData, setOrdersPaymentData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [retursData, setRetursData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalItemsSold, setTotalItemsSold] = useState(0);
  const [orderPerItemData, setOrderPerItemData] = useState([]);
  
  useEffect(() => {
    getItems();
    getOrders();
  },[])

  useEffect(() => {
    getOrderPerItem();
  },[itemsData, ordersQuantityData ])

  async function getItems() {
    const items = await fetch(
      "http://localhost:1337/api/items",
      { method: "GET" }
    );
    const itemsJson = await items.json();
    console.log("itemsJson", itemsJson)

    let itemsData = []
    itemsJson.data.map(x => itemsData.push({ 
      id: x.id, 
      name: x.attributes.name,
      category: x.attributes.category
    }));
    
    console.log("data items", itemsData)
    setItemsData(itemsData);
  }

  async function getOrders() {
    // RETUR
    const returs = await fetch(
      "http://localhost:1337/api/returs",
      { method: "GET" }
    );
    const retursJson = await returs.json();
    console.log("retursJson", retursJson)

    let retursData = []
    retursJson.data.map(x => retursData.push({ 
      id: x.id, 
      name: x.attributes.itemName,
      price: x.attributes.price,
      quantity: x.attributes.quantity,
      amount: x.attributes.price * x.attributes.quantity
    }));
    
    // ORDERS
    console.log("data returs", retursData)
    setRetursData(retursData);

    const orders = await fetch(
      "http://localhost:1337/api/orders",
      { method: "GET" }
    );
    const ordersJson = await orders.json();
    
    let ordersData = []
    ordersJson.data.map(x => ordersData.push(x.attributes));
    console.log("ordersData", ordersData)
    setOrdersData(ordersData);

    let quantityData = []
    ordersData.map(x => x.products.map(y => {
      quantityData.push({
        name: y.name,
        quantity: y.count,
        price: y.price,
        amount: y.price * y.count,
        payment: x.payment
      })
    }));
    
    console.log("orders quantity data", quantityData)
    setOrdersQuantityData(quantityData);

    // CALCULATE TOTAL SALES
    const totalSales = quantityData.reduce((sum, obj) => {
      return sum + obj.amount;
    }, 0);
 
    const totalReturAmount = retursData.reduce((sum, obj) => {
      return sum + obj.amount;
    }, 0);
 
    setTotalSales(totalSales - totalReturAmount)

    // TOTAL ITEMS SOLD
    const totalItems= quantityData.reduce((sum, obj) => {
      return sum + obj.quantity;
    }, 0);
 
    const totalReturQuantity = retursData.reduce((sum, obj) => {
      return sum + obj.quantity;
    }, 0);
 
    setTotalItemsSold(totalItems - totalReturQuantity)

    // PAYMENT DATA
    const paymentData = ['cash', 'sumup', 'qrcode', 'undefined'].map(x => {
      const paymentAmount = quantityData.reduce((sum, obj) => {
        if (obj.payment=== x) {
          return sum + obj.amount;
        }
        return sum;
      }, 0);

      return (
        { 
          id: x,
          count: ordersData.filter(obj => (x === 'undefined' ? obj.payment === null : obj.payment === x)).length,
          amount: paymentAmount
        }
      )
    })

    console.log("orders payment data", paymentData)
    setOrdersPaymentData(paymentData);
  }

  const getOrderPerItem = () => {
    const orderPerItemData = itemsData.map(x => {
      const quantity = ordersQuantityData.reduce((sum, obj) => {
        if (obj.name === x.name) {
          return sum + obj.quantity;
        }
        return sum;
      }, 0);

      const amount = ordersQuantityData.reduce((sum, obj) => {
        if (obj.name === x.name) {
          return sum + obj.amount;
        }
        return sum;
      }, 0);

      const returQuantity = retursData.reduce((sum, obj) => {
        if (obj.name === x.name) {
          return sum + obj.quantity;
        }
        return sum;
      }, 0);

      const returAmount = retursData.reduce((sum, obj) => {
        if (obj.name === x.name) {
          return sum + obj.amount;
        }
        return sum;
      }, 0);

      return (
        { 
          id: x.id,
          name: x.name,
          quantity: quantity - returQuantity,
          amount: amount - returAmount
        }
      )
    })

    console.log("order per item", orderPerItemData)
    setOrderPerItemData(orderPerItemData);
  }

  const orderPerItemColumn = [
    { field: 'name', headerName: 'Item Name', flex: 1 },
    { field: 'quantity', headerName: 'Quantity Sold', type: 'number', flex: 1 },
    { field: 'amount', headerName: 'Total Amount', valueFormatter: ({ value }) => currencyFormatter.format(value), type: 'number', flex: 1 },
  ];

  const orderPerPaymentColumn = [
    { field: 'id', headerName: 'Payment Type', flex: 1  },
    { field: 'count', headerName: 'Quantity', type: 'number', flex: 1 },
    { field: 'amount', headerName: 'Total Amount', valueFormatter: ({ value }) => currencyFormatter.format(value), type: 'number', flex: 1 },
  ];

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  });
  

  return (
    <Container sx={{ margin: "80px auto", width: '100%'}} >
      <Typography variant="h3" textAlign="center" mb="2rem">
        <b>Sales Overview</b>
      </Typography> 
      <Grid container>
        <Grid item xs={12} sm={4} sx={{display: 'flex', justifyContent:'center'}}>
          <StyledCard>
            <Typography variant="body1" >Total Sales</Typography>
            <Typography variant="h5" ><b>€{totalSales}</b></Typography>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={4} sx={{display: 'flex', justifyContent:'center'}}>
          <StyledCard>
            <Typography variant="body1" >Total Transactions</Typography>
            <Typography variant="h5" ><b>{ordersData?.length}</b></Typography>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={4} sx={{display: 'flex', justifyContent:'center'}}>
          <StyledCard>
            <Typography variant="body1" >Total Items Sold</Typography>
            <Typography variant="h5" ><b>{totalItemsSold}</b></Typography>
          </StyledCard>
        </Grid>
      </Grid>
      <Box width='100%' sx={{display: 'flex', justifyContent:'center'}}>
        <DataGrid
          rows={orderPerItemData}
          columns={orderPerItemColumn}
          rowHeight={30}
          autoHeight
          pageSize={25}
          pagination
          sx={{ border: 0, 
            width: '600px',
            marginTop: '2rem',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: shades.neutral[200]
            }
          }}
          hideFooterPagination
        />
      </Box>
      <Box width='100%' sx={{display: 'flex', justifyContent:'center'}}>
        <DataGrid
          rows={ordersPaymentData}
          columns={orderPerPaymentColumn}
          width='fit-content'
          rowHeight={30}
          autoHeight
          pageSize={25}
          pagination
          sx={{ border: 0, 
            width: '600px', 
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: shades.neutral[200]
            }
          }}
          hideFooterPagination
        />
      </Box>
      
    </Container>
  )
}

export default SalesOverview;