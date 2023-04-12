import React, { useState } from "react";

import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import HistoryIcon from "@mui/icons-material/History";

import { shallow } from "zustand/shallow";
import { SEARCH_MODES } from "../../constants.mjs";
import useSearchQuery from "../store/useSearchQuery.js";

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
      <Box sx={{ m: 1 }}>
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
              <MenuItem onClick={handleClearHistory}>
                <Typography
                  variant="caption"
                  sx={{ textAlign: "center", width: "100%" }}
                  noWrap
                >
                  Clear History
                </Typography>
              </MenuItem>
            )}
            {history.length === 0 && <MenuItem disabled>No History</MenuItem>}
          </Menu>
        </Box>
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
          maxWidth: 500,
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
          <Typography>directories:</Typography>
          <Typography
            variant="inherit"
            noWrap
            sx={{ direction: "rtl", textAlign: "left", ml: 0.5 }}
          >
            {dir}
          </Typography>
        </Box>
        <Typography variant="inherit" noWrap>
          query: {item.searchQuery}
        </Typography>
        {isSearchContent && !item.isSearchOnly && (
          <Typography variant="inherit" noWrap>
            replace: {item.replaceQuery || "<empty>"}
          </Typography>
        )}
      </Box>
    </MenuItem>
  );
};

export default BannerButtons;
