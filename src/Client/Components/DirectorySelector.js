import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useSnackbar } from "notistack";
import { CHANNELS } from "../../constants.mjs";

const { ipcSend, ipcListen } = window.api;

function DirectorySelector({ form }) {
  const { enqueueSnackbar } = useSnackbar();
  const [directories, setDirectories] = useState([]);

  const onSelectDirectory = () => {
    ipcSend(CHANNELS.DIRECTORY_SELECT);
  };

  const onRemoveDirectory = (index) => {
    const newList = directories.filter((_, i) => i !== index);
    setDirectories(newList);
  };

  useEffect(() => {
    return ipcListen(CHANNELS.DIRECTORY_SELECTED, (directory) => {
      if (directories.includes(directory)) {
        enqueueSnackbar("Directory already selected.", {
          variant: "error",
          autoHideDuration: 3000,
        });
        return;
      }
      if (directories.some((dir) => directory.includes(dir))) {
        enqueueSnackbar(
          "Can not select a child of an already selected directory. Please remove the parent first.",
          {
            variant: "error",
            autoHideDuration: 5000,
          }
        );
        return;
      }
      if (directories.some((dir) => dir.includes(directory))) {
        enqueueSnackbar(
          "Can not select the parent of an already selected directory. Please remove the child first.",
          {
            variant: "error",
            autoHideDuration: 5000,
          }
        );
        return;
      }
      setDirectories([...directories, directory]);
    });
  }, [directories, enqueueSnackbar]);

  useEffect(() => {
    form.current.directories = directories;
  }, [directories]);

  return (
    <Grid container spacing={2} display="flex" alignItems={"center"}>
      <Grid
        item
        xs={7}
        display="flex"
        alignItems={"center"}
        justifyContent="center"
      >
        <Typography variant="body1">Parent Directories</Typography>
        <Tooltip
          title="The root directories that the recursive search will start from."
          sx={{ pr: 1 }}
        >
          <IconButton>
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={4}>
        <Button variant="contained" fullWidth onClick={onSelectDirectory}>
          <CreateNewFolderIcon sx={{ mr: 2 }} /> SELECT
        </Button>
      </Grid>
      <Grid item xs={12}>
        <List
          dense={false}
          sx={{
            overflow: "auto",
            mr: 2,
            maxHeight: 150,
          }}
        >
          {directories.map((value, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onRemoveDirectory(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={value} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

export default DirectorySelector;
