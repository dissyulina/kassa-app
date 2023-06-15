import React, { useState, useEffect } from 'react';
import { Box, Typography, Container} from '@mui/material';
import Card from '@mui/material/Card';
import { DataGrid, GridToolbar, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid';
import { shades } from "../../theme";

function SalesOverview() {
  const [ordersQuantityData, setOrdersQuantityData] = useState(null);
  const [ordersPaymentData, setOrdersPaymentData] = useState(null);
  const [itemsData, setItemsData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [orderPerItemData, setOrderPerItemData] = useState(0);
  
  useEffect(() => {
    getItems();
    getOrders();
    getOrderPerItem();
  },[])

  useEffect(() => {
    getOrderPerItem();
  },[itemsData, ordersQuantityData])

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
    const orders = await fetch(
      "http://localhost:1337/api/orders",
      { method: "GET" }
    );
    const ordersJson = await orders.json();
    
    let ordersData = []
    ordersJson.data.map(x => ordersData.push(x.attributes));
    console.log("ordersData", ordersData)

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

    const totalSales = quantityData.reduce((sum, obj) => {
      return sum + obj.amount;
    }, 0);
    console.log('totalSales', totalSales)

    setTotalSales(totalSales)

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

      return (
        { 
          id: x.id,
          name: x.name,
          quantity: quantity,
          amount: amount
        }
      )
    })

    console.log("order per item", orderPerItemData)
    setOrderPerItemData(orderPerItemData);
  }

  return (
    <Container sx={{ margin: "80px auto"}} >
      <Typography variant="h3" textAlign="center" mb="24px">
        <b>Sales Overview</b>
      </Typography>
      <Card sx={{ display: 'flex', justifyContent: 'center', alignItems:'center', padding: '2rem', border: '1px solid black', width:'fit-content'}}>
        <Typography variant="h4" >
          Total Sales: €{totalSales}
        </Typography>
      </Card>
    </Container>
  )
}

export default SalesOverview;