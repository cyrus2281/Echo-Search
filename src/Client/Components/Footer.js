import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CoffeeIcon from "@mui/icons-material/CoffeeTwoTone";

import { CHANNELS } from "../../constants.mjs";

const { ipcSend, ipcListen } = window.api;

const getReleaseUrl = (homepage) => {
  const repo = homepage.split("/").slice(-2).join("/").split("#")[0];
  const releaseUrl = `https://api.github.com/repos/${repo}/releases/latest`;
  return releaseUrl;
};

const openUrl = (url) => {
  ipcSend(CHANNELS.OPEN_URL, { url });
};

const getLatestReleaseUrl = async (homepage, currentVersion) => {
  const releaseUrl = getReleaseUrl(homepage);
  let latestReleaseUrl;
  try {
    const response = await fetch(releaseUrl);
    const data = await response.json();
    const latestVersion = data.name.split("v")[1];
    if (currentVersion.startsWith(latestVersion)) {
      // The current version is the latest release
      return null;
    }
    latestReleaseUrl = data.html_url;
  } catch {
    return null;
  }
  return latestReleaseUrl;
};

function Footer() {
  const [pkg, setPkg] = useState();
  const [latestRelease, setLatestRelease] = useState();

  useEffect(() => {
    ipcSend(CHANNELS.INFO_PKG_REQUEST);
    return ipcListen(CHANNELS.INFO_PKG_RESPONSE, async (pkg) => {
      setPkg(pkg);
      if (pkg?.homepage && pkg?.version) {
        const latestRelease = await getLatestReleaseUrl(
          pkg.homepage,
          pkg.version
        );
        setLatestRelease(latestRelease);
      }
    });
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        mt: 1,
      }}
    >
      <Tooltip title="Support the developer by buying him a coffee. ❤️" sx={{}}>
        <IconButton onClick={() => openUrl(pkg?.buyMeACoffee.url)}>
          <CoffeeIcon />
        </IconButton>
      </Tooltip>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Typography variant="caption">
          Created By
          <Typography
            variant="caption"
            onClick={() => openUrl(pkg?.author.url)}
            sx={{ color: "primary.main", ml: 0.5, cursor: "pointer" }}
          >
            {pkg?.author.name}
          </Typography>
        </Typography>
        <Typography variant="caption">
          Version {pkg?.version}
          {latestRelease && (
            <Link
              pl={1}
              variant="caption"
              sx={{ cursor: "pointer" }}
              onClick={() => ipcSend(CHANNELS.OPEN_URL, { url: latestRelease })}
            >
              (Newer Version Available)
            </Link>
          )}
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;
