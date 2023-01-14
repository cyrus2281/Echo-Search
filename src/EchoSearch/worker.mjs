import {
  parentPort,
  BroadcastChannel,
  workerData,
  isMainThread,
} from "worker_threads";
import { replaceStringInFile } from "./search-utils.mjs";

if (isMainThread) {
  throw new Error("This file should not be run in the main thread");
}

const { files = [], query } = workerData;
const ref = { cancel: false };

// listen for cancel message on broadcast channel
const cancelChannel = new BroadcastChannel("cancel");
cancelChannel.onmessage = () => {
  ref.cancel = true;
};

/**
 * Send a message to the main thread
 * @param {*} data date to send
 */
const postMessage = (data) => {
  parentPort.postMessage(data);
};

/**
 * Search for the query in the files
 */
const search = async () => {
  // going through all files
  for (const file of files) {
    // process was cancelled
    if (ref.cancel) {
      // request termination
      postMessage({
        type: "terminate",
      });
      return;
    }
    try {
      // search and replacing the file
      const updatedFile = await replaceStringInFile(file, query);
      if (updatedFile !== false) {
        // file was updated
        postMessage({
          file,
          type: "progress",
        });
      } else {
        // file was not updated, just updating progress
        postMessage({
          type: "progress",
        });
      }
    } catch (error) {
      postMessage({
        type: "error",
        message: `Couldn't read file ${file}`,
        error,
      });
    }
  }
  // search is done, request termination
  postMessage({
    type: "terminate",
  });
};

// Starting search
search();
