import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Box, Typography, useTheme, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../theme";
import { addToCart } from "../state";
import { useNavigate } from "react-router-dom";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddEditItemForm from './AddEditItemForm';

const Item = ({ item, handleEdit, width }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { palette: { neutral }} = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [count, setCount] = useState(1);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const open = Boolean(anchorEl);

  const { category, price, name} = item.attributes;
  const { id } = item;
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditItem = () => {
    handleClose();
    setOpenEditDialog(true);
  };

  const handleSubmit = (editName, editPrice, editCategory) => {
    handleEdit(editName, editPrice, editCategory, id);
    setOpenEditDialog(false);
  }
  
  return (
    <Box width={width}>
      <Box display="flex" flexDirection="column" justifyContent="start" border="1px solid black" >
        <Box display="flex" justifyContent="end" alignItems="center">
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem key={'editItem'} onClick={handleEditItem}>
              Edit Item
            </MenuItem>
          </Menu>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding="2rem" >
          <Typography variant='h5'><b>{name}</b></Typography>
          <Typography>€ {price}</Typography> 
        </Box>
        <Box display="flex" justifyContent="space-between">
          {/* AMOUNT */}
          <Box
            display="flex"
            alignItems="center"
            backgroundColor={shades.neutral[100]}
            borderRadius="3px"
          >
            <IconButton onClick={() => setCount(Math.max(count - 1, 1))} sx={{width: '40px'}}>
              <RemoveIcon />
            </IconButton>
            <Typography color={shades.primary[300]} sx={{ margin: '0 10px'}}>{count}</Typography>
            <IconButton onClick={() => setCount(count + 1)} sx={{width: '40px'}}>
              <AddIcon />
            </IconButton>
          </Box>

          {/* BUTTON */}
          <Button
            onClick={() => {
              dispatch(addToCart({ item: { ...item, count } }));
            }}
            sx={{ backgroundColor: shades.primary[300], color: "white", padding: '1rem', "&:hover": {backgroundColor: shades.primary[200]} }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
      <AddEditItemForm 
        open={openEditDialog} 
        item={item} 
        handleClose={() => setOpenEditDialog(false)}
        handleSubmit={handleSubmit}
        isEdit={true}
      />
    </Box>
  )
};

export default Item;