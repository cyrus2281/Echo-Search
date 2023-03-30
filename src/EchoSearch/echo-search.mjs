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
import path from "path";
import fs from "fs";
import { Worker, BroadcastChannel } from "worker_threads";
import {
  MESSAGE_MODES,
  MESSAGE_PREFIX,
  SEARCH_MODES,
  SEARCH_TYPES,
  WORKER_CHANNELS,
} from "../constants.mjs";
import {
  crawlDirectory,
  getDirnameValidationFunction,
  getFilenameValidationFunction,
  replaceStringInFile,
  searchInterruptedErrorMessage,
} from "./search-utils.mjs";

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
 * EchoSearch search parameter
 * @typedef {Object} EchoSearchParam
 * @property {QueryParam} query the search query
 * @property {string[]} directories the directories to search in
 * @property {string[]} fileTypes the file types to search for. Empty array for all files
 * @property {string[]} excludes the directories/files to exclude. Empty array for no exclusion
 * @property {ExcludeOptions} excludeOptions predefined exclusion options
 * @property {boolean} isMultiThreaded whether to use multi-threading or not
 * @property {number} numOfThreads  number of threads to use
 * @property {"filename"|"content"} searchMode the search operation mode
 */

/**
 * EchoSearch Instance
 * @typedef {Object} SearchInstance
 * @property {Function} cancel a function to cancel the search request
 * @property {Promise<void>} search a promise that starts the search
 */

/**
 * Perform a search in a single thread for the given files base on the given query
 * @param {string[]} files files to search in
 * @param {QueryParam} query search query
 * @param {Function} onUpdate onUpdate callback
 * @param {{cancel: boolean;  progress: number; updatedFilesCount: number;}} ref reference values
 */
const singleThreadedSearch = async (files, query, onUpdate, ref) => {
  // progress per file
  const singleFileProgress = 100 / files.length;
  for (const file of files) {
    // returning if user canceled the search
    if (ref.cancel) throw new Error(searchInterruptedErrorMessage);
    try {
      // search and replace in file
      const updatedFile = await replaceStringInFile(file, query);
      if (updatedFile !== false) {
        // file was updated
        ref.updatedFilesCount++;
        onUpdate &&
          onUpdate({
            progress: ref.progress,
            // if updateFile is true, it means it's a search only operation
            message:
              (updatedFile === true
                ? MESSAGE_PREFIX.MATCH
                : MESSAGE_PREFIX.UPDATE) + file,
            mode: MESSAGE_MODES.UPDATE,
          });
      } else {
        // file was not updated, increasing progress
        onUpdate &&
          onUpdate({
            progress: ref.progress,
            mode: MESSAGE_MODES.INFO,
          });
      }
    } catch (error) {
      onUpdate &&
        onUpdate({
          progress: ref.progress,
          message: `Couldn't read file ${file}`,
          mode: MESSAGE_MODES.ERROR,
          error,
        });
    }
    ref.progress += singleFileProgress;
  }
};

/**
 * Perform a search using multiple workers for the given files base on the given query
 * @param {string[]} files files to search in
 * @param {QueryParam} query search query
 * @param {number} numOfThreads number of service workers to create
 * @param {Function} onUpdate onUpdate callback
 * @param {{cancel: boolean;  progress: number; updatedFilesCount: number;}} ref reference values
 */
const multiThreadedSearch = async (
  files,
  query,
  numOfThreads = 2,
  onUpdate,
  ref
) => {
  return new Promise((resolve, reject) => {
    try {
      if (ref.cancel) throw new Error(searchInterruptedErrorMessage);
      // progress per file
      const singleFileProgress = 100 / files.length;
      // Number of files per worker
      const perWorker = Math.ceil(files.length / numOfThreads);
      // List of workers
      const workers = [];
      const cancelChannel = new BroadcastChannel(WORKER_CHANNELS.CANCEL);

      for (let i = 0; i < numOfThreads; i++) {
        if (ref.cancel) throw new Error(searchInterruptedErrorMessage);
        // Creating the worker instance
        const worker = new Worker(new URL("./worker.mjs", import.meta.url), {
          workerData: {
            files: files.slice(i * perWorker, (i + 1) * perWorker),
            query,
          },
        });
        worker.on("message", async (data) => {
          const { type } = data;
          if (type === WORKER_CHANNELS.TERMINATE) {
            await worker.terminate();
            workers.splice(workers.indexOf(worker), 1);
            if (workers.length === 0) {
              // Closing cancel channel
              setTimeout(() => cancelChannel.close());
              resolve(true);
            }
          } else if (type === WORKER_CHANNELS.PROGRESS) {
            // Updating progress
            ref.progress += singleFileProgress;
            if (data.file) {
              // File was updated
              ref.updatedFilesCount++;
              onUpdate &&
                onUpdate({
                  progress: ref.progress,
                  message:
                    (data.isSearchOnly
                      ? MESSAGE_PREFIX.MATCH
                      : MESSAGE_PREFIX.UPDATE) + data.file,
                  mode: MESSAGE_MODES.UPDATE,
                });
            } else {
              // File was not updated, increasing progress
              onUpdate &&
                onUpdate({
                  progress: ref.progress,
                  mode: MESSAGE_MODES.INFO,
                });
            }
          } else if (type === WORKER_CHANNELS.ERROR) {
            // Updating progress
            ref.progress += singleFileProgress;
            onUpdate &&
              onUpdate({
                progress: ref.progress,
                message: data.message,
                mode: MESSAGE_MODES.ERROR,
                error: data.error,
              });
          }
          // broadcasting cancel message to all workers
          if (ref.cancel) {
            cancelChannel.postMessage(WORKER_CHANNELS.CANCEL);
            reject(new Error(searchInterruptedErrorMessage));
          }
        });
        workers.push(worker);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * @param {EchoSearchParam} echoSearchQuery the search query
 * @param {Function} onComplete a function to call when the search is complete
 * @param {Function} onError a function to call when the search fails
 * @param {Function} onUpdate a function to call when there is a progress update (eg. total files, file updated, etc.)
 * @param {*} ref reference values
 */
async function searchFileContent(
  echoSearchQuery,
  onComplete,
  onError,
  onUpdate,
  ref
) {
  const {
    directories,
    fileTypes,
    excludes,
    excludeOptions,
    query,
    isMultiThreaded,
    numOfThreads,
  } = echoSearchQuery;
  try {
    // wait for 100ms to let the UI update
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (ref.cancel) throw new Error(searchInterruptedErrorMessage);
    // Starting the search and replace in the files
    const startTime = Date.now();
    // file paths
    const files = [];
    // Getting all the files by crawling in the directories
    const queue = [...directories];
    while (queue.length > 0) {
      const directory = queue.shift();
      const dirFiles = await crawlDirectory(
        directory,
        fileTypes,
        excludes,
        excludeOptions,
        queue,
        ref
      );
      files.push(...dirFiles);
    }
    onUpdate &&
      onUpdate({
        progress: ref.progress,
        message: `Found ${files.length.toLocaleString()} files.`,
        mode: MESSAGE_MODES.SUCCESS,
      });
    if (isMultiThreaded) {
      // Using multiple threads
      await multiThreadedSearch(files, query, numOfThreads, onUpdate, ref);
    } else {
      // Using a single thread
      await singleThreadedSearch(files, query, onUpdate, ref);
    }
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    const isSearchOnly = query.replaceQuery === false;
    onComplete &&
      onComplete({
        message:
          `Search Completed: ${ref.updatedFilesCount.toLocaleString()} files ` +
          (isSearchOnly ? "matched" : "updated") +
          `. Time taken: ${timeTaken} seconds.`,
        totalCount: files.length,
        updatedCount: ref.updatedFilesCount,
        searchType: isSearchOnly ? SEARCH_TYPES.MATCH : SEARCH_TYPES.REPLACE,
      });
  } catch (error) {
    onError &&
      onError({
        message: error.message,
        mode: MESSAGE_MODES.ERROR,
        error: error,
      });
  }
}

/**
 *
 * @param {EchoSearchParam} echoSearchQuery the search query
 * @param {Function} onComplete a function to call when the search is complete
 * @param {Function} onError a function to call when the search fails
 * @param {Function} onUpdate a function to call when there is a progress update (eg. total files, file updated, etc.)
 * @param {*} ref reference values
 */
async function searchFileName(
  echoSearchQuery,
  onComplete,
  onError,
  onUpdate,
  ref
) {
  const {
    directories,
    fileTypes = [],
    excludes = [],
    excludeOptions = {},
    query: { searchQuery, isRegex, caseInsensitive },
  } = echoSearchQuery;
  try {
    // Starting the file name search
    // wait for 100ms to let the UI update
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (ref.cancel) throw new Error(searchInterruptedErrorMessage);
    const startTime = Date.now();
    let count = 0;
    let matched = 0;
    // exclude options
    const { excludeHiddenDirectories, excludeLibraries } = excludeOptions;
    const filenameValidationFn = getFilenameValidationFunction(
      searchQuery,
      isRegex,
      caseInsensitive,
      fileTypes,
      excludes
    );
    const dirnameValidationFn = getDirnameValidationFunction(
      excludes,
      excludeHiddenDirectories,
      excludeLibraries
    );
    // Getting all the files by crawling in the directories
    const queue = [...directories];
    while (queue.length > 0) {
      const directory = queue.shift();
      try {
        const items = await fs.promises.readdir(directory, {
          withFileTypes: true,
        });
        for (const item of items) {
          if (ref.cancel) throw new Error(searchInterruptedErrorMessage);
          if (item.isDirectory()) {
            if (dirnameValidationFn(item.name)) {
              queue.push(path.join(directory, item.name));
            }
          } else {
            count++;
            if (filenameValidationFn(item.name)) {
              matched++;
              onUpdate &&
                onUpdate({
                  message:
                    MESSAGE_PREFIX.MATCH + path.join(directory, item.name),
                  mode: MESSAGE_MODES.UPDATE,
                });
            }
          }
        }
      } catch (error) {
        if (error.message === searchInterruptedErrorMessage) {
          throw error;
        }
        onUpdate &&
          onUpdate({
            message: error.message,
            mode: MESSAGE_MODES.ERROR,
            error: error,
          });
      }
    }

    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    ref.updatedFilesCount = matched;
    onComplete &&
      onComplete({
        message: `Search Completed: Found ${count.toLocaleString()} files. matched ${matched.toLocaleString()} file(s). Time taken: ${timeTaken} seconds.`,
        totalCount: count,
        updatedCount: ref.updatedFilesCount,
        searchType: SEARCH_TYPES.FILE_NAME,
      });
  } catch (error) {
    onError &&
      onError({
        message: error.message,
        mode: MESSAGE_MODES.ERROR,
        error: error,
      });
  }
}

/**
 *
 * @param {EchoSearchParam} echoSearchQuery the search query
 * @param {Function} onComplete a function to call when the search is complete
 * @param {Function} onError a function to call when the search fails
 * @param {Function} onUpdate a function to call when there is a progress update (eg. total files, file updated, etc.)
 * @return {SearchInstance} Search Instance
 */
export const echoSearch = (echoSearchQuery, onComplete, onError, onUpdate) => {
  const { searchMode = SEARCH_MODES.FILE_CONTENT } = echoSearchQuery;
  // referencing values
  const ref = {
    cancel: false,
    progress: 0,
    updatedFilesCount: 0,
  };

  // Search Instance
  let search;
  if (searchMode === SEARCH_MODES.FILE_CONTENT) {
    search = searchFileContent.bind(
      this,
      echoSearchQuery,
      onComplete,
      onError,
      onUpdate,
      ref
    );
  } else if (searchMode === SEARCH_MODES.FILE_NAME) {
    search = searchFileName.bind(
      this,
      echoSearchQuery,
      onComplete,
      onError,
      onUpdate,
      ref
    );
  }

  return {
    cancel: () => {
      ref.cancel = true;
    },
    search,
  };
};

export default echoSearch;
