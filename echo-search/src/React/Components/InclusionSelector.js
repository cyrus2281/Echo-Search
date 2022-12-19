import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import FileTypeSelector from "./FileTypeSelector";
import ExcludeSelector from "./ExcludeSelector";

function InclusionSelector({ form }) {
  const [customize, setCustomize] = useState(false);

  useEffect(() => {
    if (!customize) {
      form.current.fileTypes = [];
      form.current.excludes = [];
    }
  }, [customize]);

  return (
    <Grid container spacing={2} display="flex" alignItems={"center"}>
      <Grid item xs={12} ml={2} display="flex" justifyContent="flex-start">
        <FormControlLabel
          control={
            <Checkbox
              checked={customize}
              onChange={(event) => setCustomize(event.target.checked)}
            />
          }
          label="Customize File Inclusion"
        />
      </Grid>
      {customize && (
        <>
          <Grid item xs={12}>
            <FileTypeSelector form={form} />
          </Grid>
          <Grid item xs={11} margin="auto">
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <ExcludeSelector form={form} />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default InclusionSelector;
