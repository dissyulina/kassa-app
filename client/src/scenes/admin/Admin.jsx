import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Item from "../../components/Item";
import { Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../../state";

const Admin = () => {
  const dispatch = useDispatch();
  const breakPoint = useMediaQuery("(min-width:600px)");

  async function getItems() {
    const items = await fetch(
      "http://localhost:1337/api/items",
      { method: "GET" }
    );
    const itemsJson = await items.json();
  }

  useEffect(() => {
    getItems();
  }, []);


  return (
		<Box width="80%" margin="80px auto">
      <Typography variant="h3" textAlign="center" mb="24px">
        <b>Admin</b>
      </Typography>
    </Box>
	)
}

export default Admin;