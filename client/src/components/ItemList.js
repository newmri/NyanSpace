import React, { useEffect, useState } from "react";
import { getItems, addItem } from "../api/itemApi";
import {
  Button,
  TextField,
  List,
  ListItem,
  Typography,
  Box,
} from "@mui/material";

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");

  const fetchItems = async () => {
    try {
      const res = await getItems();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;
    try {
      await addItem(newItemName);
      setNewItemName("");
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Item List
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          label="New Item"
          variant="outlined"
          size="small"
        />
        <Button variant="contained" onClick={handleAddItem}>
          Add
        </Button>
      </Box>
      <List>
        {items.map((item) => (
          <ListItem key={item._id}>{item.name}</ListItem>
        ))}
      </List>
    </Box>
  );
}
