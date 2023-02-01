import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export const defaultRegexFlags = {
  global: true,
  multiline: false,
  insensitive: false,
  sticky: false,
  unicode: false,
  single: false,
};

export const defaultRegexFlagsValues = ["g"];

function RegexFlags({ form, channel }) {
  const [flags, setFlags] = useState(defaultRegexFlags);

  useEffect(() => {
    if (channel.current.isCaseInsensitive) {
      setFlags({ ...flags, insensitive: true });
    }
  }, []);

  const updateCaseInsensitivity = (checked) => {
    setFlags({ ...flags, insensitive: checked });
    channel.current.isCaseInsensitive = checked;
    channel.current.caseInsensitivity?.setToggle &&
      channel.current.caseInsensitivity?.setToggle(checked);
  };

  channel.current.caseInsensitivity.setFlag = (checked) =>
    setFlags({ ...flags, insensitive: checked });

  useEffect(() => {
    const regexFlags = [];
    flags.global && regexFlags.push("g");
    flags.multiline && regexFlags.push("m");
    flags.insensitive && regexFlags.push("i");
    flags.unicode && regexFlags.push("u");
    flags.sticky && regexFlags.push("y");
    flags.single && regexFlags.push("s");
    form.current.query.regexFlags = regexFlags;
  }, [flags]);

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
                  checked={flags.global}
                  onChange={(e) => {
                    setFlags({ ...flags, global: e.target.checked });
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
                  checked={flags.multiline}
                  onChange={(e) => {
                    setFlags({ ...flags, multiline: e.target.checked });
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
                  checked={flags.insensitive}
                  onChange={(e) => {
                    updateCaseInsensitivity(e.target.checked);
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
                  checked={flags.unicode}
                  onChange={(e) => {
                    setFlags({ ...flags, unicode: e.target.checked });
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
                  checked={flags.sticky}
                  onChange={(e) => {
                    setFlags({ ...flags, sticky: e.target.checked });
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
                  checked={flags.single}
                  onChange={(e) => {
                    setFlags({ ...flags, single: e.target.checked });
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
