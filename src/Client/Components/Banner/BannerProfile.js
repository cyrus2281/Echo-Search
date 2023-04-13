import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import BookmarksIcon from "@mui/icons-material/Bookmarks";

import { useSnackbar } from "notistack";
import { shallow } from "zustand/shallow";

import { CHANNELS, PROFILE_UPDATE_TYPE } from "../../../constants.mjs";
import useSearchQuery from "../../store/useSearchQuery.js";
import { generateID } from "../../Utils.js";
import BannerProfileItem from "./BannerProfileItem.js";

const { ipcSend, ipcListen } = window.api;

function BannerProfile({ disabled }) {
  const { enqueueSnackbar } = useSnackbar();
  const [profiles, setProfiles, selectProfile, getCurrentProfileState] =
    useSearchQuery(
      (state) => [
        state.profiles,
        state.setProfiles,
        state.selectProfile,
        state.getCurrentProfileState,
      ],
      shallow
    );
  const [editingEl, setEditingEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const onProfileEdit = (profile) => {
    setEditingEl(profile.id);
  };

  const onProfileSelect = (profile) => {
    selectProfile(profile);
    !editingEl && setAnchorEl(null);
  };

  const onProfileUpdate = (profile, type, newName) => {
    const newProfiles = [...profiles];
    const profileIndex = newProfiles.findIndex((p) => p.id === profile.id);
    if (profileIndex === -1) {
      return;
    }
    let newProfile = newProfiles[profileIndex];
    switch (type) {
      case PROFILE_UPDATE_TYPE.NAME:
        newProfile = {
          ...newProfile,
          name: newName,
        };
        break;
      case PROFILE_UPDATE_TYPE.REFRESH:
        newProfile = {
          ...newProfile,
          state: getCurrentProfileState(),
        };
        break;
    }
    setEditingEl(null);
    newProfiles[profileIndex] = newProfile;
    setProfiles(newProfiles);
    ipcSend(CHANNELS.PROFILES_SAVE, { profiles: newProfiles });
    enqueueSnackbar("Profile updated", { variant: "info" });
  };

  const onProfileDelete = (profile) => {
    const newProfiles = [...profiles];
    const profileIndex = newProfiles.findIndex((p) => p.id === profile.id);
    if (profileIndex === -1) {
      return;
    }
    newProfiles.splice(profileIndex, 1);
    setProfiles(newProfiles);
    ipcSend(CHANNELS.PROFILES_SAVE, { profiles: newProfiles });
  };

  const onProfileCreate = () => {
    const uid = generateID();
    const profileState = getCurrentProfileState();
    const newProfile = {
      id: uid,
      name: "Profile " + (profiles.length + 1),
      state: profileState,
    };
    setEditingEl(uid);
    const newProfiles = [newProfile, ...profiles];
    setProfiles(newProfiles);
    ipcSend(CHANNELS.PROFILES_SAVE, { profiles: newProfiles });
  };

  useEffect(() => {
    if (anchorEl === null && editingEl !== null) {
      setEditingEl(null);
    }
  }, [anchorEl]);

  useEffect(() => {
    // Get profiles from backend
    ipcSend(CHANNELS.PROFILES_LOAD_REQUEST);
    const onProfileLoad = ({ profiles }) => {
      setProfiles(profiles);
    };
    return ipcListen(CHANNELS.PROFILES_LOAD_RESPONSE, onProfileLoad);
  }, []);

  return (
    <>
      <Box>
        <Tooltip title="Saved Search Profiles">
          <IconButton
            onClick={(event) => setAnchorEl(event.currentTarget)}
            disabled={disabled}
          >
            <BookmarksIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          disableAutoFocusItem
          open={openMenu}
          autoFocus={false}
          onClose={() => setAnchorEl(null)}
          sx={{
            maxHeight: "600px",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            sx={{ mb: 1, width: "300px", maxWidth: "300px" }}
            key="create-new"
          >
            <Button
              sx={{
                width: "100%",
                textAlign: "center",
              }}
              variant="contained"
              onClick={onProfileCreate}
            >
              Create Profile
            </Button>
          </MenuItem>
          {profiles.map((profile) => (
            <BannerProfileItem
              key={profile.id}
              profile={profile}
              isEditing={editingEl === profile.id}
              onEdit={onProfileEdit}
              onUpdate={onProfileUpdate}
              onDelete={onProfileDelete}
              onSelect={onProfileSelect}
            />
          ))}
          {profiles.length === 0 && (
            <MenuItem disabled key="no-item">
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "center",
                }}
                variant="button"
              >
                No Saved Profiles
              </Typography>
            </MenuItem>
          )}
        </Menu>
      </Box>
    </>
  );
}

export default BannerProfile;
