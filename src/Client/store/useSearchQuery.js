import { create } from "zustand";
import { SEARCH_MODES } from "../../constants.mjs";
import {
  getExistingElements,
  getRegexFlagsArray,
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../Utils.js";

export const defaultRegexFlags = {
  global: true,
  multiline: false,
  insensitive: false,
  sticky: false,
  unicode: false,
  single: false,
};

export const defaultContentSearchQuery = {
  searchQuery: "",
  replaceQuery: "",

  isRegex: false,
  matchWhole: false,
  caseInsensitive: false,
  isSearchOnly: false,

  directories: [],
  fileTypes: [],
  excludes: [],
  excludeHiddenDirectories: false,
  excludeHiddenFiles: false,
  excludeLibraries: false,

  isMultiThreaded: false,
  numOfThreads: 1,
  regexFlags: defaultRegexFlags,

  searchMode: SEARCH_MODES.FILE_CONTENT,

  openAdvancedSettings: false,
  openCustomInclusion: false,
};

export const defaultNameSearchQuery = {
  ...defaultContentSearchQuery,
  searchMode: SEARCH_MODES.FILE_NAME,
};

const useSearchQuery = create((set, get) => {
  const history = loadFromLocalStorage("searchHistory", []);
  return {
    // Fields
    history,
    profiles: [],
    ...defaultContentSearchQuery,

    // Setters
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setReplaceQuery: (replaceQuery) => set({ replaceQuery }),
    setRegexFlags: (regexFlags) => {
      set({
        regexFlags,
        caseInsensitive: regexFlags.insensitive,
      });
    },
    setIsRegex: (isRegex) => set({ isRegex }),
    setMatchWhole: (matchWhole) => set({ matchWhole }),
    setCaseInsensitive: (caseInsensitive) => {
      set((state) => ({
        caseInsensitive,
        regexFlags: {
          ...state.regexFlags,
          insensitive: caseInsensitive,
        },
      }));
    },
    setIsSearchOnly: (isSearchOnly) => set({ isSearchOnly }),
    setDirectories: (directories) => set({ directories }),
    setFileTypes: (fileTypes) => set({ fileTypes }),
    setExcludes: (excludes) => set({ excludes }),
    setExcludeHiddenDirectories: (excludeHiddenDirectories) =>
      set({ excludeHiddenDirectories }),
    setExcludeHiddenFiles: (excludeHiddenFiles) => set({ excludeHiddenFiles }),
    setExcludeLibraries: (excludeLibraries) => set({ excludeLibraries }),
    setIsMultiThreaded: (isMultiThreaded) => set({ isMultiThreaded }),
    setNumOfThreads: (numOfThreads) => set({ numOfThreads }),
    setSearchMode: (searchMode) => {
      set((state) => {
        if (state.searchMode === searchMode) {
          return {};
        }
        return { searchMode };
      });
    },
    setOpenAdvancedSettings: (openAdvancedSettings) =>
      set({ openAdvancedSettings }),
    setOpenCustomInclusion: (openCustomInclusion) =>
      set({ openCustomInclusion }),

    // Resetters
    resetCustomInclusion: () => {
      set({
        fileTypes: [],
        excludes: [],
        excludeHiddenDirectories: false,
        excludeHiddenFiles: false,
        excludeLibraries: false,
      });
    },
    resetAdvancedSettings: () => {
      set((state) => ({
        isMultiThreaded: false,
        numOfThreads: 1,
        regexFlags: {
          ...defaultRegexFlags,
          insensitive: state.caseInsensitive,
        },
      }));
    },
    resetSearchQuery: (mode = SEARCH_MODES.FILE_CONTENT) => {
      let defaultValues = {};
      if (mode === SEARCH_MODES.FILE_CONTENT) {
        defaultValues = defaultContentSearchQuery;
      } else if (mode === SEARCH_MODES.FILE_NAME) {
        defaultValues = defaultNameSearchQuery;
      }
      set((state) => ({
        ...state,
        ...defaultValues,
      }));
    },

    // Utils
    isCustomInclusionDirty: () => {
      const state = get();
      return (
        state.fileTypes.length > 0 ||
        state.excludes.length > 0 ||
        state.excludeHiddenDirectories ||
        state.excludeHiddenFiles ||
        state.excludeLibraries
      );
    },
    isAdvancedSettingsDirty: () => {
      const state = get();
      const cleanRegexFlags = {
        ...defaultRegexFlags,
        insensitive: state.caseInsensitive,
      };
      return (
        state.isMultiThreaded ||
        getRegexFlagsArray(state.regexFlags).join("") !==
          getRegexFlagsArray(cleanRegexFlags).join("")
      );
    },
    prefillSearchQuery: (searchQuery) => {
      set((state) => {
        const newValues = {
          ...state,
          ...searchQuery,
        };
        newValues.query.replaceQuery = newValues.isSearchOnly
          ? false
          : newValues.query.replaceQuery;
        return {
          ...newValues,
          regexFlags: {
            ...newValues.regexFlags,
            insensitive: newValues.caseInsensitive,
          },
        };
      });
    },
    getSearchQuery: () => {
      const state = get();
      const searchQuery = { query: {} };
      // Search Mode
      searchQuery.searchMode = state.searchMode;
      // Query
      searchQuery.query.searchQuery = state.searchQuery;
      searchQuery.query.replaceQuery = state.isSearchOnly
        ? false
        : state.replaceQuery;
      searchQuery.query.isRegex = state.isRegex;
      searchQuery.query.matchWhole = state.matchWhole;
      searchQuery.query.regexFlags = getRegexFlagsArray(state.regexFlags);
      // Inclusion
      searchQuery.directories = state.directories;
      searchQuery.fileTypes = state.fileTypes;
      searchQuery.excludes = state.excludes;
      searchQuery.excludeOptions = {
        excludeHiddenDirectories: state.excludeHiddenDirectories,
        excludeHiddenFiles: state.excludeHiddenFiles,
        excludeLibraries: state.excludeLibraries,
      };
      // Advanced Settings
      searchQuery.isMultiThreaded = state.isMultiThreaded;
      searchQuery.numOfThreads = state.numOfThreads;

      return searchQuery;
    },
    // History
    addToHistory: (histState) => {
      set((state) => {
        const newState = getExistingElements(
          histState || state,
          defaultContentSearchQuery
        );
        // load from local storage
        const history = loadFromLocalStorage("searchHistory", []);
        // check for duplicate
        const index = history.findIndex(
          ({ timestamp: _, ...hState }) =>
            JSON.stringify(hState) === JSON.stringify(newState)
        );
        // Add timestamp
        newState.timestamp = Date.now();
        // move duplicate and add to first
        if (index > -1) {
          history.splice(index, 1);
          history.unshift(newState);
        } else {
          history.unshift(newState);
        }
        // remove last element if history is greater than 7
        if (history.length > 7) {
          history.pop();
        }
        // Save to local storage
        saveToLocalStorage("searchHistory", history);
        return { history };
      });
    },
    clearHistory: () => {
      set({ history: [] });
      saveToLocalStorage("searchHistory", []);
    },
    applyHistory: ({ timestamp: _, ...histState }) => {
      // load from local storage
      const history = loadFromLocalStorage("searchHistory", []);
      set((state) => {
        const newState = getExistingElements(
          histState || state,
          defaultContentSearchQuery
        );
        return {
          ...state,
          ...(newState.searchMode === SEARCH_MODES.FILE_NAME
            ? defaultNameSearchQuery
            : defaultContentSearchQuery),
          ...newState,
          history,
        };
      });
    },
    // Profile
    getCurrentProfileState: () => {
      const state = get();
      const profileState = getExistingElements(
        state,
        defaultContentSearchQuery
      );
      return profileState;
    },
    setProfiles: (profiles) => set({ profiles }),
    selectProfile: (profile) => {
      set((state) => {
        const selectedProfile = state.profiles.find((p) => p.id === profile.id);
        if (!selectedProfile) {
          return {};
        }
        return {
          ...state,
          ...selectedProfile.state,
        };
      });
    },
  };
});

export default useSearchQuery;
