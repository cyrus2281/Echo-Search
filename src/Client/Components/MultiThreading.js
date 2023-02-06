import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import { CHANNELS } from "../../constants.mjs";

const { ipcSend, ipcListen } = window.api;

const MultiThreadingTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    sx={{ ml: 1 }}
    classes={{ popper: className }}
    title={
      <Typography color="inherit">
        <b>Concurrency</b> means multiple searches happening at the same time.
        Higher number of threads does NOT mean faster results. Concurrency
        depends on different factors such as the <em>number of threads</em>,
        <em> power of each core</em>, and the
        <em> amount of the available memory</em>. Note that concurrency uses
        considerably more amount of memory. Please be sure not overload your system
        memory. With Concurrency you might feel some asynchronous behavior or miss some
        messages. <br></br> You're not allowed to use more than <b>80%</b> of
        your CPU cores.<br></br> We recommend testing with different number of
        threads to find the best performance.
      </Typography>
    }
  />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 600,
    margin: "36px",
  },
});

function MultiThreading({ form }) {
  const [isMultiThreaded, setIsMultiThreaded] = useState(false);
  const [numOfThreads, setNumOfThreads] = useState(1);
  const [maxNumOfThreads, setMaxNumOfThreads] = useState(8);

  useEffect(() => {
    form.current.isMultiThreaded = isMultiThreaded;
    form.current.numOfThreads = numOfThreads;
  }, [isMultiThreaded, numOfThreads]);

  useEffect(() => {
    ipcSend(CHANNELS.INFO_CORES_REQUEST);
    return ipcListen(CHANNELS.INFO_CORES_RESPONSE, (totalCores) => {
      // Set 80% of total cores as max number of threads
      setMaxNumOfThreads(Math.floor(totalCores * 0.8));
      setNumOfThreads(Math.min(Math.floor(totalCores * 0.5), 4));
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        ml: 3,
        pr: 3,
        gap: 1,
      }}
    >
      <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Typography variant="body1">Use Concurrency:</Typography>
        <MultiThreadingTooltip>
          <IconButton>
            <InfoOutlinedIcon />
          </IconButton>
        </MultiThreadingTooltip>
        <Switch
          checked={isMultiThreaded}
          onChange={(e) => setIsMultiThreaded(e.target.checked)}
          inputProps={{ "aria-label": "controlled" }}
        />
      </Box>
      {isMultiThreaded && (
        <Box sx={{ width: "100%" }}>
          <Typography id="input-slider" variant="caption" gutterBottom>
            Number of Threads (Max: 80% of CPU Cores)
          </Typography>
          <Slider
            aria-label="Number of Threads"
            value={numOfThreads}
            onChange={(e, value) => setNumOfThreads(value)}
            valueLabelFormat={(value) => value + " Threads"}
            valueLabelDisplay="auto"
            step={1}
            min={2}
            max={maxNumOfThreads}
            marks
          />
        </Box>
      )}
    </Box>
  );
}

export default MultiThreading;
