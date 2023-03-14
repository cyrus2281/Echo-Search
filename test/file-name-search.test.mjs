/**
 * Folder Structure
 * test
 *  - testDir
 *   - A
 *     - C
 *       - file4.js
 *     - file2.md
 *     - .D
 *       - file5.js
 *   - B
 *      - file3.txt
 *      - packages
 *       - file6.ts
 *   - file1.txt
 */

import assert from "assert";
import path from "path";
import * as url from "url";
import fs from "fs-extra";
import testUtils from "./test.utils.js";
import { echoSearch } from "../src/EchoSearch/echo-search.mjs";
import { SEARCH_MODES } from "../src/constants.mjs";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const testDir = path.join(__dirname, "testDir");

describe("Echo-Search: File Name", function () {
  // make test environment
  beforeEach(function () {
    // create directory testDir
    fs.mkdirSync(testDir);
    // create directory A
    fs.mkdirSync(path.join(testDir, "A"));
    // create directory B
    fs.mkdirSync(path.join(testDir, "B"));
    // create directory C
    fs.mkdirSync(path.join(testDir, "A", "C"));
    // create directory .D (hidden directory)
    fs.mkdirSync(path.join(testDir, "A", ".D"));
    // create directory packages
    fs.mkdirSync(path.join(testDir, "B", "packages"));

    // create file1.txt
    fs.writeFileSync(path.join(testDir, "file1.txt"), testUtils.originalText);
    // create file2.js
    fs.writeFileSync(
      path.join(testDir, "A", "file2.md"),
      testUtils.originalText
    );
    // create file3.js
    fs.writeFileSync(
      path.join(testDir, "B", "file3.txt"),
      testUtils.originalText
    );
    // create file4.js
    fs.writeFileSync(
      path.join(testDir, "A", "C", "file4.js"),
      testUtils.originalText
    );
    // create file5.js
    fs.writeFileSync(
      path.join(testDir, "A", ".D", "file5.js"),
      testUtils.originalText
    );
    // create file6.ts
    fs.writeFileSync(
      path.join(testDir, "B", "packages", "file6.ts"),
      testUtils.originalText
    );
  });
  // cleaning test environment
  afterEach(function (done) {
    const testDir = path.join(__dirname, "testDir");
    // force remove directory testDir
    fs.remove(testDir)
      .catch(() => fs.remove(testDir)) // try again on first fail
      .then(() => done())
      .catch((err) => done(err));
  });

  describe("# File Count", function () {
    it("Single Directory Count", function (done) {
      const completionMessage = /Search Completed: Found 6 files/;

      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Multi Directory Count", function (done) {
      const completionMessage = /Search Completed: Found 5 files/;

      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [path.join(testDir, "A"), path.join(testDir, "B")],
        fileTypes: [],
        excludes: [],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
  });

  describe("# File Name Search", function () {
    it("Match complete name", function (done) {
      const completionMessage = /Found 6 files. matched 1 file/;
      const searchParam = {
        query: {
          searchQuery: testUtils.fileNameComplete,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Match partial name", function (done) {
      const completionMessage = /Found 6 files. matched 6 file/;
      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Match case insensitive", function (done) {
      const completionMessage = /Found 6 files. matched 1 file/;
      const searchParam = {
        query: {
          searchQuery: testUtils.fileNameCompleteCIS,
          caseInsensitive: true,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Match RegEx", function (done) {
      const completionMessage = /Found 6 files. matched 4 file/;
      const searchParam = {
        query: {
          searchQuery: testUtils.filenameRegex,
          isRegex: true,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Match RegEx Case Sensitive", function (done) {
      const completionMessage = /Found 6 files. matched 0 file/;
      const searchParam = {
        query: {
          searchQuery: testUtils.filenameRegexCS,
          isRegex: true,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Match RegEx Case Insensitive", function (done) {
      const completionMessage = /Found 6 files. matched 4 file/;
      const searchParam = {
        query: {
          searchQuery: testUtils.filenameRegexCIS,
          isRegex: true,
          caseInsensitive: true,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Canceling Request", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const expectedErrorMessage = "Search Interrupted: User Cancelled";
      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [testDir],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      const { search, cancel } = echoSearch(
        searchParam,
        () => {
          done(new Error("Search was not canceled"));
        },
        ({ message }) => {
          try {
            assert.strictEqual(message, expectedErrorMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      );
      search();
      cancel();
    });
  });

  describe("# Directory Inclusion/Exclusion", function () {
    it("Single Directory - with inclusion", function (done) {
      const completionMessage = /Found 6 files. matched 4 file/;
      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [testDir],
        fileTypes: ["txt", "js"],
        excludes: [],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Single Directory - with exclusion", function (done) {
      const completionMessage = /Found 3 files. matched 3 file/;

      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: ["C", "B"],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Single Directory - with filename exclusion", function (done) {
      const completionMessage = /Found 6 files. matched 2 file/;

      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: ["txt", "js"],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Single Directory - with hidden directories exclusion", function (done) {
      const completionMessage = /Found 5 files. matched 5 file/;

      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        excludeOptions: {
          excludeHiddenDirectories: true,
        },
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Single Directory - with common libraries exclusion", function (done) {
      const completionMessage = /Found 5 files. matched 5 file/;

      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        excludeOptions: {
          excludeLibraries: true,
        },
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Multi Directory - with inclusion", function (done) {
      const completionMessage = /Found 5 files. matched 3 file/;

      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [path.join(testDir, "A"), path.join(testDir, "B")],
        fileTypes: ["txt", "js"],
        excludes: [],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Multi Directory - with exclusion", function (done) {
      const completionMessage = /Found 4 files. matched 4 file/;

      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [path.join(testDir, "A"), path.join(testDir, "B")],
        fileTypes: [],
        excludes: ["C"],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Multi Directory - with filename exclusion", function (done) {
      const completionMessage = /Found 5 files. matched 2 file/;

      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [path.join(testDir, "A"), path.join(testDir, "B")],
        fileTypes: [],
        excludes: ["txt", "js"],
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Multi Directory - with hidden directories exclusion", function (done) {
      const completionMessage = /Found 4 files. matched 4 file/;

      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [path.join(testDir, "A"), path.join(testDir, "B")],
        fileTypes: [],
        excludes: [],
        excludeOptions: {
          excludeHiddenDirectories: true,
        },
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
    it("Multi Directory - with common libraries exclusion", function (done) {
      const completionMessage = /Found 4 files. matched 4 file/;

      const searchParam = {
        query: {
          searchQuery: testUtils.fileNamePartial,
        },
        directories: [path.join(testDir, "A"), path.join(testDir, "B")],
        fileTypes: [],
        excludes: [],
        excludeOptions: {
          excludeLibraries: true,
        },
        searchMode: SEARCH_MODES.FILE_NAME,
      };
      echoSearch(searchParam, ({ message }) => {
        if (message && message.includes("Found")) {
          try {
            assert.match(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        }
      }).search();
    });
  });
});
