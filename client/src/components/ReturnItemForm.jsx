import React, { useState, useEffect } from 'react';
import { Typography, InputBase, InputLabel, OutlinedInput } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { shades } from "../theme";
import { useSelector } from "react-redux";

function ReturnItemForm({open, handleClose, handleSubmit}) {
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editQuantity, setEditQuantity] = useState(1);
  const [reload, setReload] = useState(0);
  const [itemNames, setItemNames] = useState([]);

  useEffect(() => {
    getItems();
  }, [reload]);

  async function getItems() {
    const items = await fetch(
      "http://localhost:1337/api/items",
      { method: "GET" }
    );
    const itemsJson = await items.json();
    let itemNames = []
    itemsJson.data.map(obj => itemNames.push(obj.attributes.name))
    setItemNames(itemNames);
  }

  const handleSave = () => {
    console.log(editName, editPrice, editQuantity)
    handleSubmit(editName, editPrice, editQuantity)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Return Item</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ marginTop: '0.5rem'}}>
          <InputLabel id="select-name">Name</InputLabel>
          <Select
            labelId="select-name"
            id="name"
            value={editName || ''}
            label="Name"
            fullWidth
            input={<OutlinedInput label="Name" margin="dense"/>}
            onChange={(event) => setEditName(event.target.value)}
          > 
            {itemNames?.sort().map((name, i) => <MenuItem key={i} value={name}>{name}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          autoFocus
          margin="dense"
          id="price"
          label="Price"
          type="number"
          fullWidth
          variant="outlined"
          value={editPrice || ''}
          onChange={(event) => setEditPrice(event.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="quantity"
          label="Quantity"
          type="number"
          fullWidth
          variant="outlined"
          value={editQuantity || ''}
          onChange={(event) => setEditQuantity(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{padding: '1rem 1.5rem 2rem 1.5rem'}}>
        <Button onClick={handleClose} 
          sx={{ 
            border: `1px solid ${shades.primary[200]}`, color: shades.primary[500], 
            marginRight: '1rem', padding: '0.5rem 1.25rem'
            }}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} 
          sx={{ backgroundColor: shades.primary[200], color: "white", padding: '0.5rem 1.25rem'}}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReturnItemForm;
