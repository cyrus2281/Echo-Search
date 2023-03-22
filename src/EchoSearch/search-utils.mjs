/**
 *   Echo Search
 *
 *   An algorithm to search and replace strings in files recursively
 *
 *   author: Cyrus Mobini
 *
 *   Licensed under the BSD 3-Clause license.
 *
 *   Copyright 2023 Cyrus Mobini (https://github.com/cyrus2281)
 *
 *
 */
import fs from "fs";
import path from "path";
import { COMMON_LIBRARY_NAMES } from "../constants.mjs";

/**
 * Search Query parameter
 * @typedef {Object} QueryParam
 * @property {string|RegExp} searchQuery the search query (string or regex)
 * @property {string|false} replaceQuery the replacement string, false if search only
 * @property {string[]} regexFlags regular expression modifier flags
 * @property {boolean} isRegex whether the search query is a regex or not
 * @property {boolean} matchWhole whether the search query should match the whole word or not
 * @property {boolean?} caseInsensitive whether the search query should be case sensitive or not (only for filename search)
 */

/**
 *  predefined exclusion options
 * @typedef {Object} ExcludeOptions predefined exclusion options
 * @property {boolean} excludeHiddenDirectories whether to exclude hidden directories or not (directories starting with .)
 * @property {boolean} excludeHiddenFiles whether to exclude hidden files or not (files starting with .)
 * @property {boolean} excludeLibraries whether to exclude libraries or not (node_modules, lib, etc.)
 */

/**
 * EchoSearch Instance
 * @typedef {Object} SearchInstance
 * @property {Function} cancel a function to cancel the search request
 * @property {Promise<void>} search a promise that starts the search
 */

/**
 * User cancelled search error message
 */
export const searchInterruptedErrorMessage =
  "Search Interrupted: User Cancelled";

/**
 * get all files in a directory and append subdirectories to queue
 * @param {string} directory the directory to search in
 * @param {string[]} fileTypes the file types to search for. Empty array for all files
 * @param {string[]} excludes the directories/files to exclude. Empty array for no exclusion
 * @param {ExcludeOptions} excludeOptions predefined exclusion options
 * @param {string[]} queue sub-directories to be searched. Each directory will be appended to the queue
 * @param {{cancel: boolean}} ref an object that has a reference to whether the process is cancelled or not
 * @returns {string[]} files sub-files in the directory
 */
export const crawlDirectory = async (
  directory,
  fileTypes = [],
  excludes = [],
  excludeOptions = {},
  queue = [],
  ref = {}
) => {
  if (ref.cancel) throw new Error(searchInterruptedErrorMessage);
  const { excludeHiddenDirectories, excludeHiddenFiles, excludeLibraries } =
    excludeOptions;
  const dirnameValidationFn = getDirnameValidationFunction(
    excludes,
    excludeHiddenDirectories,
    excludeLibraries
  );
  const files = [];
  const items = await fs.promises.readdir(directory, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      if (dirnameValidationFn(item.name)) {
        queue.push(path.join(directory, item.name));
      }
    } else {
      if (
        !excludes.some((exc) => item.name.includes(exc)) && // exclude files
        !(excludeHiddenFiles && item.name.startsWith(".")) // exclude hidden files
      ) {
        if (fileTypes.length > 0) {
          if (fileTypes.includes(item.name.split(".").pop())) {
            files.push(path.join(directory, item.name));
          }
        } else {
          files.push(path.join(directory, item.name));
        }
      }
    }
  }
  return files;
};

/**
 * Escape a search query to be used in a regex.
 * Escape new line for both window and Linux/Unix
 * @param {string} searchQuery search string
 * @param {boolean} isRegex whether to escape all special characters or not
 * @returns {string} regex escaped search query
 */
const escapeSearchQuery = (searchQuery, isRegex) => {
  return isRegex
    ? searchQuery.replace(/\n/g, "\r?\n")
    : searchQuery
        .replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
        .replace(/\n/g, "\r?\n");
};

/**
 * replace a string in a given text value
 * @param {string} text the text to search in
 * @param {QueryParam} query the search query
 * @returns {boolean|string} false if search query is not found or is empty,
 * true if it's a search only, otherwise the new text
 */
export const replaceString = (text, query) => {
  const { searchQuery, replaceQuery, regexFlags, isRegex, matchWhole } = query;

  const flags = regexFlags.join("");
  const replaceFunction = flags.includes("g") ? "replaceAll" : "replace";

  let reg;
  if (isRegex) {
    reg = RegExp(escapeSearchQuery(searchQuery, isRegex), flags);
  } else {
    reg = matchWhole
      ? RegExp(`\\b${escapeSearchQuery(searchQuery)}\\b`, flags)
      : (reg = RegExp(escapeSearchQuery(searchQuery), flags));
  }

  // if the text doesn't have the search query or is empty
  if (!text.match(reg) || text.length === 0) {
    return false;
  }
  if (replaceQuery === false) {
    // search only: found match, no replace
    return true;
  }
  return text[replaceFunction](reg, replaceQuery);
};

/**
 * read a file and replace a string in it
 * @param {string} filePath the file path to search in
 * @param {QueryParam} query the search query
 * @returns {Promise<false|void>} false if the file doesn't have the search query or is empty, otherwise write the new text into file
 */
export const replaceStringInFile = async (filePath, query) => {
  const text = await fs.promises.readFile(filePath, { encoding: "utf-8" });
  if (/\ufffd/.test(text)) {
    return false;
  }
  const result = replaceString(text, query);
  if (typeof result === "boolean") {
    // type is boolean if there was no match found
    // or it is a search only operation
    return result;
  }
  await fs.promises.writeFile(filePath, result, { encoding: "utf-8" });
};

/**
 * returns a function that validates a filename based on the search query and the search mode
 * @param {string|RegExp} searchQuery search query
 * @param {boolean} isRegex whether the search query is a regex or not
 * @param {string[]} fileTypes the file types to search for. Empty array for all files
 * @param {string[]} excludes the directories/files to exclude. Empty array for no exclusion
 * @returns {(name: string) => boolean} a function that validates a filename based on the search query and the search mode
 */
export const getFilenameValidationFunction = (
  searchQuery,
  isRegex = false,
  caseInsensitive = false,
  fileTypes = [],
  excludes = []
) => {
  // Why is this function is ugly and hard to read?
  // Because it's a performance optimization. This function is expected to
  // run on scale of millions, so it's important keep it as close to O(1) as possible.
  // So instead of checking for all conditions, we create a function that only checks the
  // conditions that are relevant to the search query
  let validator;
  if (isRegex) {
    const regex = new RegExp(searchQuery, caseInsensitive ? "i" : "");
    validator = (filename) => regex.test(filename);
  } else {
    if (caseInsensitive) {
      searchQuery = searchQuery.toLowerCase();
      validator = (filename) => filename.toLowerCase().includes(searchQuery)
    } else {
      validator = (filename) => filename.includes(searchQuery);
    }
  }
  if (fileTypes.length > 0 && excludes.length == 0) {
    return (filename) =>
      validator(filename) && fileTypes.includes(filename.split(".").pop());
  }
  if (excludes.length > 0 && fileTypes.length == 0) {
    return (filename) =>
      validator(filename) && !excludes.some((exc) => filename.includes(exc));
  }
  if (excludes.length > 0 && fileTypes.length > 0) {
    return (filename) =>
      validator(filename) &&
      !excludes.some((exc) => filename.includes(exc)) &&
      fileTypes.includes(filename.split(".").pop());
  }
  return validator;
};

/**
 * returns a function that validates a dirname based on the search query and the search mode
 * @param {string[]} excludes the directories/files to exclude. Empty array for no exclusion
 * @param {boolean} excludeHiddenDirectories whether to exclude hidden directories or not
 * @param {boolean} excludeLibraries whether to exclude libraries or not
 * @returns {(name: string) => boolean} a function that validates a dirname based on the search query
 */
export const getDirnameValidationFunction = (
  excludes = [],
  excludeHiddenDirectories = false,
  excludeLibraries = false
) => {
  // Why is this function is ugly and hard to read?
  // Because it's a performance optimization. This function is expected to
  // run on scale of millions, so it's important keep it as close to O(1) as possible.
  // So instead of checking for all conditions, we create a function that only checks the
  // conditions that are relevant to the search query and the search mode.

  if (excludes.length > 0) {
    if (excludeHiddenDirectories) {
      if (excludeLibraries) {
        return (dirname) =>
          !excludes.some((exc) => dirname.includes(exc)) &&
          !dirname.startsWith(".") &&
          !COMMON_LIBRARY_NAMES.some((lib) => lib === dirname);
      }
      return (dirname) =>
        !excludes.some((exc) => dirname.includes(exc)) &&
        !dirname.startsWith(".");
    } else if (excludeLibraries) {
      return (dirname) =>
        !excludes.some((exc) => dirname.includes(exc)) &&
        !COMMON_LIBRARY_NAMES.some((lib) => lib === dirname);
    } else {
      return (dirname) => !excludes.some((exc) => dirname.includes(exc));
    }
  } else {
    if (excludeHiddenDirectories) {
      if (excludeLibraries) {
        return (dirname) =>
          !dirname.startsWith(".") &&
          !COMMON_LIBRARY_NAMES.some((lib) => lib === dirname);
      }
      return (dirname) => !dirname.startsWith(".");
    } else if (excludeLibraries) {
      return (dirname) => !COMMON_LIBRARY_NAMES.some((lib) => lib === dirname);
    } else {
      return () => true;
    }
  }
};
