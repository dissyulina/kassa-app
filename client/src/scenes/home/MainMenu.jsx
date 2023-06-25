import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AddIcon from '@mui/icons-material/Add';
import { shades } from "../../theme";
import Item from "../../components/Item";
import { Typography, Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../../state";
import { useSnackbar } from "../../hooks/useSnackbar";
import AddEditItemForm from "../../components/AddEditItemForm";

const MainMenu = () => {
  const dispatch = useDispatch();
  const { AlertMessage, isVisible, getAlertMessage } = useSnackbar();
  const [value, setValue] = useState("all");
  const [reload, setReload] = useState(0);
  const [open, setOpen] = useState(false);
  const items = useSelector((state) => state.cart.items);
  const breakPoint = useMediaQuery("(min-width:600px)");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getItems();
  }, [reload]);

  async function getItems() {
    const items = await fetch(
      "http://localhost:1337/api/items",
      { method: "GET" }
    );
    const itemsJson = await items.json();
    dispatch(setItems(itemsJson.data));
  }

  const nasiItems = items?.filter(
    (item) => item.attributes.category === "nasi"
  );
  const drinkItems = items?.filter(
    (item) => item.attributes.category === "drink"
  );
  const sateItems = items?.filter(
    (item) => item.attributes.category === "sate"
  );
  const snackItems = items?.filter(
    (item) => item.attributes.category === "snack"
  );
  const otherItems = items?.filter(
    (item) => item.attributes.category === "other"
  );

  async function handleEdit(editName, editPrice, editCategory, id) {
    const payload = { 
      data: {
        name: editName, 
        price: editPrice, 
        category: editCategory
      }
    };

    const response = await fetch(`http://localhost:1337/api/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const session = await response.json();
    setOpen(false);
    showAlert(response, session);
  }

  async function handleAddItem(name, price, category) {
    const payload = { 
      data: {
        name: name, 
        price: price, 
        category: category
      }
    };

    const response = await fetch("http://localhost:1337/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const session = await response.json();
    setOpen(false);
    showAlert(response, session);
  }

  const showAlert = (response, session) => {
    if (response) {
      if (response.status === 200) {
        setReload(reload + 1)
        getAlertMessage('success', "Data is saved.")
      }
    }
    if (session.error) {
      getAlertMessage('warning', session.error.name || session.error.title)
    }
  }

  return (
		<Box width="80%" margin="80px auto">
      <Typography variant="h3" textAlign="center">
        <b>Our Menus <span>
				<Button size="small"
          sx={{ marginLeft: '0.5rem', padding: '0.5rem', backgroundColor: '#fff', border: `1px solid ${shades.primary[500]}`, color: shades.primary[700]}} 
          aria-label="add-item" 
          onClick={() => setOpen(true)}>
					<AddIcon sx={{ mr: 1 }}/>
          Add Item
				</Button>
			</span></b>
      </Typography>
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        centered
        TabIndicatorProps={{ sx: { display: breakPoint ? "block" : "none" } }}
        sx={{
          m: "25px",
          "& .MuiTabs-flexContainer": {
            flexWrap: "wrap",
          },
        }}
      >
        <Tab label="ALL" value="all" />
        <Tab label="NASI" value="nasi" />
        <Tab label="SATE" value="sate" />
        <Tab label="OTHER DISHES" value="other" />
        <Tab label="DRINKS" value="drink" />
        <Tab label="SNACKS" value="snack" />
      </Tabs>
      {items &&
      <Box
        margin="0 auto"
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 250px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
      >
        {value === "all" &&
          items.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} handleEdit={handleEdit} />
          ))}
        {value === "nasi" &&
          nasiItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} handleEdit={handleEdit} />
          ))}
        {value === "sate" &&
          sateItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} handleEdit={handleEdit} />
          ))}
        {value === "other" &&
          otherItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} handleEdit={handleEdit} />
          ))}
        {value === "drink" &&
          drinkItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} handleEdit={handleEdit} />
          ))}
        {value === "snack" &&
          snackItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
      </Box>
      }
      {isVisible === true ? <AlertMessage /> : ''}
      
      <AddEditItemForm
        open={open} 
        handleClose={() => setOpen(false)}
        handleSubmit={handleAddItem}
        isEdit={false}
      />
    </Box>
	)
}

export default MainMenu;