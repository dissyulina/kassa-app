import React, { useState, useEffect } from 'react';
import { Typography, InputBase, InputLabel, OutlinedInput } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { shades } from "../theme";


function AddEditItemForm({open, handleClose, item, handleSubmit, isEdit}) {
  const [editName, setEditName] = useState(item ? item.attributes.name : '');
  const [editPrice, setEditPrice] = useState(item ? item.attributes?.price : 0);
  const [editCategory, setEditCategory] = useState(item ? item.attributes?.category : '');

  console.log("Item", item)

  const handleSave = () => {
    console.log(editName, editPrice, editCategory)
    handleSubmit(editName, editPrice, editCategory)
  }

  // async function handleSubmit() {
  //   console.log(editName, editPrice, editCategory)

  //   const payload = { 
  //     data: {
  //       name: editName, 
  //       price: editPrice, 
  //       category: editCategory
  //     }
  //   };

  //   const response = await fetch(`http://localhost:1337/api/items/${item.id}`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });

  //   const session = await response.json();
  //   console.log(session)
  //   if (response) {
  //     if (response.status === 200) {
  //       console.log("SUCCESS");
  //       //getAlertMessage('success', "Data is saved.")
  //     }
  //   }
  //   if (session.error) {
  //     console.log(session);
  //     //getAlertMessage('warning', session.error.name)
  //   }
    
  // }

  return (
    <Dialog open={open} onClose={handleClose}>
      {isEdit ? 
        <DialogTitle>Edit Item</DialogTitle> : <DialogTitle>Add Item</DialogTitle>
      }
      <DialogContent>
        <DialogContentText>
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={editName || ''}
          onChange={(event) => setEditName(event.target.value)}
        />
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
        <FormControl fullWidth sx={{ marginTop: '0.5rem'}}>
          <InputLabel id="select-label">Category</InputLabel>
          <Select
            labelId="select-label"
            id="category"
            value={editCategory || ''}
            label="Category"
            fullWidth
            input={<OutlinedInput label="Category" margin="dense"/>}
            onChange={(event) => setEditCategory(event.target.value)}
          >
            <MenuItem value={'drink'}>Drink</MenuItem>
            <MenuItem value={'nasi'}>Nasi</MenuItem>
            <MenuItem value={'snack'}>Snack</MenuItem>
            <MenuItem value={'sate'}>Sate</MenuItem>
            <MenuItem value={'other'}>Other</MenuItem>
          </Select>
        </FormControl>
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

export default AddEditItemForm;