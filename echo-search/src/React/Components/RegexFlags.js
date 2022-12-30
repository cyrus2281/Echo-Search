import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";

export const defaultRegexFlags = {
  global: true,
  multiline: false,
  insensitive: false,
  extended: false,
  single: false,
  unicode: false,
  unGreedy: false,
  anchored: false,
  jChanged: false,
  dollarEndOnly: false,
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
    flags.extended && regexFlags.push("x");
    flags.single && regexFlags.push("s");
    flags.unicode && regexFlags.push("u");
    flags.unGreedy && regexFlags.push("U");
    flags.anchored && regexFlags.push("A");
    flags.dollarEndOnly && regexFlags.push("D");
    flags.jChanged && regexFlags.push("J");
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
          title="x modifier: extended. Spaces and text after a # in the pattern are ignored"
          sx={{ ml: 1 }}
        >
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={flags.extended}
                  onChange={(e) => {
                    setFlags({ ...flags, extended: e.target.checked });
                  }}
                />
              }
              label="Extended"
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
              label="Single"
            />
          </Box>
        </Tooltip>
        <Tooltip
          title="u modifier: unicode. Pattern strings are treated as UTF-16. Also causes escape sequences to match unicode characters"
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
          title="U modifier: Ungreedy. The match becomes lazy by default. Now a ? following a quantifier makes it greedy"
          sx={{ ml: 1 }}
        >
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={flags.unGreedy}
                  onChange={(e) => {
                    setFlags({ ...flags, unGreedy: e.target.checked });
                  }}
                />
              }
              label="Un-greedy"
            />
          </Box>
        </Tooltip>
        <Tooltip
          title="A modifier: Anchored. The pattern is forced to become anchored at the start of the search, or at the position of the last successful match, equivalent to a \G"
          sx={{ ml: 1 }}
        >
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={flags.anchored}
                  onChange={(e) => {
                    setFlags({ ...flags, anchored: e.target.checked });
                  }}
                />
              }
              label="Anchored"
            />
          </Box>
        </Tooltip>
        <Tooltip
          title="J modifier: Allow duplicate subpattern names"
          sx={{ ml: 1 }}
        >
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={flags.jChanged}
                  onChange={(e) => {
                    setFlags({ ...flags, jChanged: e.target.checked });
                  }}
                />
              }
              label="J-Changed"
            />
          </Box>
        </Tooltip>
        <Tooltip
          title="D modifier: Dollar. Force the a dollar sign, $, to always match end of the string, instead of end of the line. This option is ignored if the m-flag is set"
          sx={{ ml: 1 }}
        >
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={flags.dollarEndOnly}
                  onChange={(e) => {
                    setFlags({ ...flags, dollarEndOnly: e.target.checked });
                  }}
                />
              }
              label="Dollar end only"
            />
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default RegexFlags;
