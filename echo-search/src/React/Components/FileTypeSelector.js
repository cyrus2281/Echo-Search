import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

function FileTypeSelector({ form }) {
  const [allTypes, setAllTypes] = useState(true);
  const [fileTypes, setFileTypes] = useState([]);
  const [fileType, setFileType] = useState("");

  const addFileType = (type) => {
    if (type.trim()) {
      type = type.trim();
      if (type.startsWith(".")) {
        type = type.substring(1);
      }
      setFileTypes(Array.from(new Set([...fileTypes, type])));
      setFileType("");
    }
  };

  const removeFileType = (type) => {
    setFileTypes(fileTypes.filter((t) => t !== type));
  };

  useEffect(() => {
    form.current.fileTypes = fileTypes;
  }, [fileTypes]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ml: 6,
      }}
    >
      <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Typography variant="body1">File extensions to include:</Typography>
        <ToggleButton
          value="check"
          selected={allTypes}
          size="small"
          sx={{ mx: 2 }}
          onChange={() => {
            if (!allTypes) {
              setFileTypes([]);
              setFileType("");
            }
            setAllTypes(!allTypes);
          }}
        >
          <Typography noWrap variant="body2">
            ALL
          </Typography>
        </ToggleButton>
        <Autocomplete
          freeSolo
          disabled={allTypes}
          sx={{
            flexGrow: 1,
            "&::-webkit-scrollbar": {
              height: "0.3em",
            },
            "&::-webkit-scrollbar-track": {
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              outline: "1px solid slategrey",
              borderRadius: "5px",
            },
          }}
          id="fileType"
          disableClearable
          options={extensions
            .filter((option) => !fileTypes.includes(option))
            .sort()}
          onChange={(_, newValue) => {
            addFileType(newValue);
            setFileType("");
          }}
          value=""
          inputValue={fileType}
          onInputChange={(event, newInputValue) => {
            setFileType(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="eg. js, py, ts, html, css, etc."
              variant="standard"
              InputProps={{
                ...params.InputProps,
              }}
            />
          )}
        />
        <IconButton disabled={allTypes || !fileType} sx={{ mr: 3, ml: 1 }} onClick={() => addFileType(fileType)}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
      <Box sx={{ width: "100%" }}>
        {fileTypes.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            overflow={"auto"}
            py={1}
            mt={1}
            sx={{
              "&::-webkit-scrollbar": {
                height: "0.3em",
              },
              "&::-webkit-scrollbar-track": {
                boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,.1)",
                outline: "1px solid slategrey",
                borderRadius: "5px",
              },
            }}
          >
            {fileTypes.map((type) => (
              <Chip
                key={type}
                label={type}
                clickable={false}
                onDelete={() => removeFileType(type)}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default FileTypeSelector;

// programming file extensions
const extensions = [
  "c",
  "cpp",
  "cs",
  "java",
  "js",
  "py",
  "rb",
  "sh",
  "swift",
  "ts",
  "tsx",
  "jsx",
  "vue",
  "html",
  "css",
  "scss",
  "less",
  "json",
  "xml",
  "yml",
  "yaml",
  "md",
  "txt",
  "csv",
  "sql",
  "bash",
  "bat",
  "php",
  "h",
  "pl",
  "go",
  "dart",
  "r",
  "fxml",
  "ino",
];
