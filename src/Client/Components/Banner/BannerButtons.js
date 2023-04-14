import React, { useState } from "react";

import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import HistoryIcon from "@mui/icons-material/History";

import { shallow } from "zustand/shallow";
import { SEARCH_MODES } from "../../../constants.mjs";
import useSearchQuery from "../../store/useSearchQuery.js";
import BannerProfile from "./BannerProfile.js";

function BannerButtons({ disabled }) {
  // History menu
  const [history, applyHistory, clearHistory] = useSearchQuery(
    (state) => [state.history, state.applyHistory, state.clearHistory],
    shallow
  );
  const [historyAnchorEl, setHistoryAnchorEl] = useState(null);
  const openHistory = Boolean(historyAnchorEl);
  const handleHistoryClick = (event) => {
    setHistoryAnchorEl(event.currentTarget);
  };
  const handleHistoryClose = (item) => {
    setHistoryAnchorEl(null);
    if (item) applyHistory(item);
  };
  const handleClearHistory = () => {
    setHistoryAnchorEl(null);
    clearHistory();
  };

  return (
    <>
      <Box
        sx={{
          m: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box>
          <Tooltip title="Recent Searches">
            <IconButton onClick={handleHistoryClick} disabled={disabled}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={historyAnchorEl}
            open={openHistory}
            onClose={() => handleHistoryClose()}
            sx={{
              maxHeight: "600px",
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {history.map((item, index) =>
              HistoryMenuItem({
                item,
                key: index,
                onClick: () => handleHistoryClose(item),
              })
            )}
            {history.length !== 0 && (
              <MenuItem key="clear-history" onClick={handleClearHistory}>
                <Typography
                  variant="caption"
                  sx={{ textAlign: "center", width: "100%" }}
                  noWrap
                >
                  Clear History
                </Typography>
              </MenuItem>
            )}
            {history.length === 0 && (
              <MenuItem disabled key="no-item">
                <Typography
                  sx={{
                    width: "100%",
                    textAlign: "center",
                  }}
                  variant="button"
                >
                  No History
                </Typography>
              </MenuItem>
            )}
          </Menu>
        </Box>
        <BannerProfile disabled={disabled} />
      </Box>
    </>
  );
}

const HistoryMenuItem = ({ item, key, onClick }) => {
  const isSearchContent = item.searchMode === SEARCH_MODES.FILE_CONTENT;
  const date = new Date(item.timestamp);
  const dir = item.directories.join(", ");
  return (
    <MenuItem onClick={onClick} key={key}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: 400,
          textOverflow: "ellipsis",
          mt: "0.25rem",
          mb: "0.75rem",
        }}
      >
        <Typography variant="caption" noWrap>
          Search Mode: {isSearchContent ? "File Content" : "File Name"} {" - "}
          {date.toLocaleString()}
        </Typography>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Typography>Directories:</Typography>
          <Typography
            variant="inherit"
            noWrap
            sx={{ direction: "rtl", textAlign: "left", ml: 0.5 }}
          >
            {dir}
          </Typography>
        </Box>
        <Typography variant="inherit" noWrap>
          Query: {item.searchQuery}
        </Typography>
        {isSearchContent && !item.isSearchOnly && (
          <Typography variant="inherit" noWrap>
            Replace: {item.replaceQuery || "<empty>"}
          </Typography>
        )}
        {item.fileTypes?.length > 0 && (
          <Typography
            variant="inherit" noWrap
          >
            File Types: {item.fileTypes.join(", ")}
          </Typography>
        )}
        {item.excludes?.length > 0 && (
          <Typography
          variant="inherit" noWrap
          >
            Excludes: {item.excludes.join(", ")}
          </Typography>
        )}
      </Box>
    </MenuItem>
  );
};

export default BannerButtons;
