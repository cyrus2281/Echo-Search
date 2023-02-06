import React, { useEffect } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";

function ExcludeSelector({ form }) {
  const [excludes, setExcludes] = React.useState([]);
  const [exclude, setExclude] = React.useState("");

  const addToExcludes = (exclude) => {
    if (exclude.trim()) {
      exclude = exclude.trim();
      setExcludes(Array.from(new Set([...excludes, exclude])));
      setExclude("");
    }
  };

  const onRemoveExclude = (index) => {
    const newList = excludes.filter((_, i) => i !== index);
    setExcludes(newList);
  };

  useEffect(() => {
    form.current.excludes = excludes;
  }, [excludes]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ml: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Typography variant="body1">Files/Directories To Exclude:</Typography>
          <Tooltip
            title="Paths can be complete or partial match. It can also be used to exclude specific file extensions."
            sx={{ ml: 1 }}
          >
            <IconButton>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
          <TextField
            id="exclude"
            variant="standard"
            placeholder="e.g. node_modules, .git, .class, etc."
            sx={{ flexGrow: 1, ml: 1 }}
            onChange={(e) => setExclude(e.target.value)}
            value={exclude}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addToExcludes(exclude);
              }
            }}
          />
        </Box>
        <IconButton
          disabled={!exclude}
          sx={{ ml: 1 }}
          onClick={() => addToExcludes(exclude)}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
      <Box sx={{ width: "100%", py: 1 }}>
      <List
          dense={false}
          sx={{
            pr:2,
            overflow: "auto",
            maxHeight: 150,
          }}
        >
          {excludes.map((value, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onRemoveExclude(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <FolderOffIcon/>
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={value} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default ExcludeSelector;
