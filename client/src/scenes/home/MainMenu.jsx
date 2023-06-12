import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Item from "../../components/Item";
import { Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../../state";

const MainMenu = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("all");
  const items = useSelector((state) => state.cart.items);
  const breakPoint = useMediaQuery("(min-width:600px)");
  console.log("items", items)
  console.log("value", value)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getItems() {
    const items = await fetch(
      "http://localhost:1337/api/items",
      { method: "GET" }
    );
    const itemsJson = await items.json();
    dispatch(setItems(itemsJson.data));
  }

  useEffect(() => {
    getItems();
  }, []);

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

  return (
		<Box width="80%" margin="80px auto">
      <Typography variant="h3" textAlign="center">
        <b>Our Menus</b>
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
        gridTemplateColumns="repeat(auto-fill, 300px)"
        justifyContent="space-around"
        rowGap="20px"
        columnGap="1.33%"
      >
        {value === "all" &&
          items.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "nasi" &&
          nasiItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "sate" &&
          sateItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "other" &&
          otherItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "drink" &&
          drinkItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
        {value === "snack" &&
          snackItems.map((item) => (
            <Item item={item} key={`${item.name}-${item.id}`} />
          ))}
      </Box>
}
    </Box>
	)
}

export default MainMenu;