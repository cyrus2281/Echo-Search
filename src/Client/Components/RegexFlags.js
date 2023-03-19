import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { shallow } from 'zustand/shallow'
import useSearchQuery from "../store/useSearchQuery";

export const defaultRegexFlagsValues = ["g"];

function RegexFlags() {
  const [regexFlags, setRegexFlags] = useSearchQuery((state) => [
    state.regexFlags,
    state.setRegexFlags,
  ], shallow);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ml: 3,
      }}
    >
      <Typography variant="body1">
        Regular Expression Modifier Flags:
      </Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexWrap="wrap"
      >
        <Tooltip
          title="g modifier: global. All matches (don't return after first match)"
          sx={{ ml: 1 }}
        >
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={regexFlags.global}
                  onChange={(e) => {
                    setRegexFlags({ ...regexFlags, global: e.target.checked });
                  }}
                />
              }
              label="Global"
            />
          </Box>
        </Tooltip>
        <Tooltip
          title="m modifier: multi line. Causes ^ and $ to match the begin/end of each line (not only begin/end of string)"
          sx={{ ml: 1 }}
        >
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={regexFlags.multiline}
                  onChange={(e) => {
                    setRegexFlags({
                      ...regexFlags,
                      multiline: e.target.checked,
                    });
                  }}
                />
              }
              label="Multi-line"
            />
          </Box>
        </Tooltip>
        <Tooltip
          title="i modifier: insensitive. Case insensitive match (ignores case of [a-zA-Z])"
          sx={{ ml: 1 }}
        >
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={regexFlags.insensitive}
                  onChange={(e) => {
                    setRegexFlags({
                      ...regexFlags,
                      insensitive: e.target.checked,
                    });
                  }}
                />
              }
              label="Insensitive"
            />
          </Box>
        </Tooltip>
        <Tooltip
          title="u modifier: unicode. Enable all unicode features and interpret all unicode escape sequences as such"
          sx={{ ml: 1 }}
        >
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={regexFlags.unicode}
                  onChange={(e) => {
                    setRegexFlags({ ...regexFlags, unicode: e.target.checked });
                  }}
                />
              }
              label="Unicode"
            />
          </Box>
        </Tooltip>
        <Tooltip
          title="y modifier: sticky. Force the pattern to only match consecutive matches from where the previous match ended."
          sx={{ ml: 1 }}
        >
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={regexFlags.sticky}
                  onChange={(e) => {
                    setRegexFlags({ ...regexFlags, sticky: e.target.checked });
                  }}
                />
              }
              label="Sticky"
            />
          </Box>
        </Tooltip>
        <Tooltip
          title="s modifier: single line. Dot matches newline characters"
          sx={{ ml: 1 }}
        >
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={regexFlags.single}
                  onChange={(e) => {
                    setRegexFlags({ ...regexFlags, single: e.target.checked });
                  }}
                />
              }
              label="Single-line"
            />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default RegexFlags;
