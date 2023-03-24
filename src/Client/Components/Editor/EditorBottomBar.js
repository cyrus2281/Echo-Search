import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { shallow } from "zustand/shallow";
import useEditor from "../../store/useEditor";

function EditorBottomBar() {
  const [language, setLanguage, availableLanguages] = useEditor(
    (state) => [state.language, state.setLanguage, state.availableLanguages],
    shallow
  );
  const isDirty = useEditor((state) => state.isDirty);

  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "26px",
        padding: "0 1rem",
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
      {availableLanguages.length && (
        <Box>
          <Typography pr={1} id="language-label" variant="caption">language:</Typography>
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
            {availableLanguages.sort((a,b) => a.id > b.id ? 1 : -1 ).map((lang, index) => {
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
    </Toolbar>
  );
}

export default EditorBottomBar;
