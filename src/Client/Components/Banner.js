import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

function Banner() {
  return (
    <>
      <Toolbar disableGutters sx={{ paddingBottom: "1rem", display: "flex", justifyContent: "center" }}>
        <Typography
          variant="h1"
          noWrap
          sx={{
            fontFamily: "Roboto",
            fontWeight: 700,
            fontSize: "2rem",
            letterSpacing: ".125rem",
            marginLeft: "1rem",
            textTransform: "uppercase",
            color: "primary.main",
          }}
        >
          Echo Search
        </Typography>
      </Toolbar>
      <Divider />
    </>
  );
}

export default Banner;
