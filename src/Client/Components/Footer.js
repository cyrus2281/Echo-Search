import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const { ipcSend, ipcListen } = window.api;

function Footer() {
  const [pkg, setPkg] = useState();

  const onNameClick = () => {
    ipcSend("open:url", {url: pkg?.author.url});
  };

  useEffect(() => {
    ipcSend("info:pkg:request")
    return ipcListen("info:pkg:response", setPkg);
  }, []);

  return (
    <Box
      sx={{
        display: "block",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        mt: 1,
      }}
    >
      <Typography variant="caption">
        Created By
        <Typography
          variant="caption"
          onClick={onNameClick}
          sx={{ color: "primary.main", ml: 0.5, cursor: "pointer" }}
        >
          {pkg?.author.name}
        </Typography>
      </Typography>
      <Typography variant="caption">Version {pkg?.version}</Typography>
    </Box>
  );
}

export default Footer;
