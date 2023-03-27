import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";

import { shallow } from "zustand/shallow";
import useEditor from "../../store/useEditor";

function EditorBottomBar() {
  const [language, setLanguage, availableLanguages] = useEditor(
    (state) => [state.language, state.setLanguage, state.availableLanguages],
    shallow
  );
  const [fontSize, setFontSize] = useEditor(
    (state) => [state.fontSize, state.setFontSize],
    shallow
  );
  const [wordWrap, setWordWrap] = useEditor(
    (state) => [state.wordWrap, state.setWordWrap],
    shallow
  );
  const isDirty = useEditor((state) => state.isDirty);

  // an array from 8 to 36 in steps of 2
  const fontSizes = Array.from({ length: 15 }, (_, i) => i * 2 + 8);

  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "26px",
        height: "26px",
        padding: "0 1rem",
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "rgba(18, 18, 18)",
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16))",
      }}
      variant="dense"
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isDirty && <Typography variant="caption">Unsaved changes</Typography>}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ToggleButton
          value="wordWrap"
          size="small"
          selected={wordWrap}
          onChange={() => {
            setWordWrap(!wordWrap);
          }}
          sx={{
            fontSize: "0.75rem",
            height: "24px",
            textTransform: "capitalize",
          }}
        >
          Word Wrap
        </ToggleButton>
        <Box>
          <Typography pr={1} id="font-size-label" variant="caption">
            Font Size:
          </Typography>
          <Select
            labelId="font-size-label"
            id="font-size-select"
            size="small"
            variant="standard"
            sx={{
              height: "24px",
              fontSize: "0.75rem",
            }}
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          >
            {fontSizes.map((size, index) => (
              <MenuItem key={index} value={size}>
                {size}px
              </MenuItem>
            ))}
          </Select>
        </Box>
        {availableLanguages.length && (
          <Box>
            <Typography pr={1} id="language-label" variant="caption">
              Language:
            </Typography>
            <Select
              labelId="language-label"
              id="language-select"
              size="small"
              variant="standard"
              sx={{
                height: "24px",
                fontSize: "0.75rem",
              }}
              value={language}
              onChange={(e) => {
                const newLanguage = availableLanguages.find((lang) =>
                  lang.aliases
                    ? lang.aliases.includes(e.target.value)
                    : lang.id === e.target.value
                );
                setLanguage(newLanguage.id);
              }}
            >
              {availableLanguages
                .sort((a, b) => (a.id > b.id ? 1 : -1))
                .map((lang, index) => {
                  const label = lang.aliases ? lang.aliases[0] : lang.id;
                  return (
                    <MenuItem key={index} value={lang.id}>
                      {label}
                    </MenuItem>
                  );
                })}
            </Select>
          </Box>
        )}
      </Box>
    </Toolbar>
  );
}

export default EditorBottomBar;
