import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CachedIcon from "@mui/icons-material/Cached";
import RenameIcon from "@mui/icons-material/DriveFileRenameOutline";
import CheckIcon from "@mui/icons-material/CheckCircle";

import { PROFILE_UPDATE_TYPE, SEARCH_MODES } from "../../../constants.mjs";
import { ellipsisText } from "../../Utils.js";

const BannerProfileItem = ({
  profile,
  isEditing,
  onUpdate,
  onDelete,
  onEdit,
  onSelect,
}) => {
  const [showButtons, setShowButtons] = useState(false);
  const [inputText, setInputText] = useState(profile.name);
  const onLeftButtonClick = (e) => {
    e.stopPropagation();
    setShowButtons(false);
    if (isEditing) {
      onUpdate(profile, PROFILE_UPDATE_TYPE.NAME, inputText);
    } else {
      onEdit(profile);
    }
  };

  useEffect(() => {
    setInputText(profile.name);
  }, [profile, isEditing]);

  return (
    <Tooltip
      title={<ProfileTooltip name={profile.name} state={profile.state} />}
      enterDelay={300}
      enterNextDelay={300}
      placement="left"
    >
      <MenuItem
        key={profile.id}
        sx={{ pl: 1, width: "300px", maxWidth: "300px" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: 500,
            textOverflow: "ellipsis",
            pt: "0.25rem",
            pb: "0.75rem",
          }}
          onMouseEnter={() => setShowButtons(true)}
          onMouseLeave={() => setShowButtons(false)}
          onClick={() => !isEditing && onSelect(profile)}
        >
          <Tooltip title={isEditing ? "Save Name" : "Rename"}>
            <IconButton size="small" onClick={onLeftButtonClick}>
              {isEditing ? <CheckIcon /> : <RenameIcon />}
            </IconButton>
          </Tooltip>
          {isEditing ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{
                  width: "100%",
                }}
                defaultValue={inputText}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") {
                    onLeftButtonClick(e);
                  }
                }}
                onChange={(e) => setInputText(e.target.value)}
                autoFocus={true}
                variant="outlined"
              />
            </Box>
          ) : (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  width: "100%",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {profile.name}
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  visibility: showButtons ? "visible" : "hidden",
                }}
              >
                <Tooltip title="Delete Profile">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowButtons(false);
                      onDelete(profile);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Update Profile with current state">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate(profile, PROFILE_UPDATE_TYPE.REFRESH);
                    }}
                  >
                    <CachedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </Box>
      </MenuItem>
    </Tooltip>
  );
};

const ProfileTooltip = ({ name, state }) => {
  const directories = state.directories.join(", ") || "";
  const isSearchContent = state.searchMode === SEARCH_MODES.FILE_CONTENT;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        textOverflow: "ellipsis",
        overflow: "hidden",
        width: "250px",
        maxWidth: "250px",
        boxSizing: "border-box",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          borderBottom: "1px lightgrey solid",
          width: "100%",
          mb: 1,
        }}
      >
        {name}
      </Typography>
      <Typography>
        <b>Search Mode:</b> {isSearchContent ? "File Content" : "File Name"}
      </Typography>
      {state.directories?.length > 0 && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          <Typography>
            <b>Directories:</b>
          </Typography>
          <Typography
            noWrap
            sx={{
              textOverflow: "ellipsis",
              width: "100%",
              overflow: "hidden",
              direction: "rtl",
              textAlign: "left",
              ml: 0.5,
            }}
          >
            {directories}
          </Typography>
        </Box>
      )}

      {state.searchQuery && (
        <Typography>
          <b>Query:</b> {ellipsisText(state.searchQuery)}
        </Typography>
      )}
      {isSearchContent && !state.isSearchOnly && (
        <Typography noWrap>
          <b>Replace:</b> {ellipsisText(state.replaceQuery) || "<empty>"}
        </Typography>
      )}
      {state.fileTypes?.length > 0 && (
        <Typography
          noWrap
          sx={{
            textOverflow: "ellipsis",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <b>File Types:</b> {state.fileTypes.join(", ")}
        </Typography>
      )}
      {state.excludes?.length > 0 && (
        <Typography
          noWrap
          sx={{
            textOverflow: "ellipsis",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <b>Excludes:</b> {state.excludes.join(", ")}
        </Typography>
      )}
    </Box>
  );
};

export default BannerProfileItem;
