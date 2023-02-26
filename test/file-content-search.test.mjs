/**
 * Folder Structure
 * test
 *  - testDir
 *   - A
 *     - C
 *       - file4.js
 *       - .file5
 *     - file2.md
 *     - .D
 *       - file6.js
 *   - B
 *      - file3.txt
 *      - packages
 *       - file7.ts
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

describe("Echo-Search: File Content", function () {
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
    // create .file5 (hidden file)
    fs.writeFileSync(
      path.join(testDir, "A", "C", ".file5"),
      testUtils.originalText
    );
    // create file6.js
    fs.writeFileSync(
      path.join(testDir, "A", ".D", "file6.js"),
      testUtils.originalText
    );
    // create file7.ts
    fs.writeFileSync(
      path.join(testDir, "B", "packages", "file7.ts"),
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
    .catch((err) => done(err))
  });

  describe("# File Count", function () {
    it("Search Content Mode", function (done) {
      const fileCountText = "Found 7 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        searchMode: SEARCH_MODES.FILE_CONTENT,
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
    it("Single Directory - No Customization", function (done) {
      const fileCountText = "Found 7 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
    it("Single Directory - with inclusion", function (done) {
      const fileCountText = "Found 4 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
        fileTypes: ["txt", "js"],
        excludes: [],
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
    it("Single Directory - with exclusion", function (done) {
      const fileCountText = "Found 5 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: ["C"],
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
    it("Single Directory - with hidden file exclusion", function (done) {
      const fileCountText = "Found 6 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        excludeOptions: {
          excludeHiddenFiles: true,
        }
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
    it("Single Directory - with hidden directories exclusion", function (done) {
      const fileCountText = "Found 6 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        excludeOptions: {
          excludeHiddenDirectories: true,
        }
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
    it("Single Directory - with common libraries exclusion", function (done) {
      const fileCountText = "Found 6 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
        fileTypes: [],
        excludes: [],
        excludeOptions: {
          excludeLibraries: true,
        }
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
    it("Multi Directory - No Customization", function (done) {
      const fileCountText = "Found 6 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [path.join(testDir, "A"), path.join(testDir, "B")],
        fileTypes: [],
        excludes: [],
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
    it("Multi Directory - with inclusion", function (done) {
      const fileCountText = "Found 3 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [path.join(testDir, "A"), path.join(testDir, "B")],
        fileTypes: ["txt", "js"],
        excludes: [],
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
    it("Multi Directory - with exclusion", function (done) {
      const fileCountText = "Found 4 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [path.join(testDir, "A"), path.join(testDir, "B")],
        fileTypes: [],
        excludes: ["C"],
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
    it("Multi Directory - with hidden file exclusion", function (done) {
      const fileCountText = "Found 5 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [path.join(testDir, "A"), path.join(testDir, "B")],
        fileTypes: [],
        excludes: [],
        excludeOptions: {
          excludeHiddenFiles: true,
        }
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
    it("Multi Directory - with hidden directories exclusion", function (done) {
      const fileCountText = "Found 5 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [path.join(testDir, "A"), path.join(testDir, "B")],
        fileTypes: [],
        excludes: [],
        excludeOptions: {
          excludeHiddenDirectories: true,
        }
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
    it("Multi Directory - with common libraries exclusion", function (done) {
      const fileCountText = "Found 5 files.";

      const searchParam = {
        query: {
          searchQuery: "HelloWorld",
          replaceQuery: "HelloWorld",
          regexFlags: [],
          isRegex: false,
          matchWhole: false,
        },
        directories: [path.join(testDir, "A"), path.join(testDir, "B")],
        fileTypes: [],
        excludes: [],
        excludeOptions: {
          excludeLibraries: true,
        }
      };
      echoSearch(
        searchParam,
        () => {},
        () => {},
        ({ message, progress }) => {
          if (message && message.includes("Found")) {
            try {
              assert.strictEqual(message, fileCountText);
              done();
            } catch (err) {
              done(err);
            }
          }
        }
      ).search();
    });
  });

  describe("# Search And Replace", function () {
    it("Simple - no flags", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 7 files updated/;
      const searchParam = {
        query: {
          searchQuery: testUtils.searchQuery,
          replaceQuery: testUtils.replacementText,
          regexFlags: ["g"],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.simpleReplaceText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
    it("partial query - matchWhole off", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 7 files updated/;
      const searchParam = {
        query: {
          searchQuery: testUtils.partialQuery,
          replaceQuery: testUtils.replacementText,
          regexFlags: ["g"],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.partialReplacedText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
    it("partial query - matchWhole on", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 0 files updated/;
      const searchParam = {
        query: {
          searchQuery: testUtils.partialQuery,
          replaceQuery: testUtils.replacementText,
          regexFlags: ["g"],
          isRegex: false,
          matchWhole: true,
        },
        directories: [testDir],
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.originalText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
    it("Multi-line Query", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 7 files updated/;
      const searchParam = {
        query: {
          searchQuery: testUtils.multiLineSearchQuery,
          replaceQuery: testUtils.replacementText,
          regexFlags: ["g"],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.multiLineReplacedText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
    it("Canceling Request", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const expectedErrorMessage = "Search Interrupted: User Cancelled";
      const searchParam = {
        query: {
          searchQuery: testUtils.searchQuery,
          replaceQuery: testUtils.replacementText,
          regexFlags: ["g"],
          isRegex: false,
          matchWhole: true,
        },
        directories: [testDir],
      };
      const { search, cancel } = echoSearch(
        searchParam,
        () => {
          done(new Error("Search was not canceled"));
        },
        ({ message }) => {
          try {
            // read file and check if the content is replaced
            const fileContent = fs.readFileSync(testDirFile1, "utf8");
            assert.strictEqual(fileContent, testUtils.originalText);
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
    it("With Concurrency", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 7 files updated/;
      const searchParam = {
        query: {
          searchQuery: testUtils.searchQuery,
          replaceQuery: testUtils.replacementText,
          regexFlags: ["g"],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
        isMultiThreaded: true,
        numOfThreads: 2,
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.simpleReplaceText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
  });

  describe("# Search Only", function () {
    it("Simple - no flags", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 7 files matched/;
      const searchParam = {
        query: {
          searchQuery: testUtils.searchQuery,
          replaceQuery: false,
          regexFlags: ["g"],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.originalText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
    it("Multi-line Query", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 7 files matched/;
      const searchParam = {
        query: {
          searchQuery: testUtils.multiLineSearchQuery,
          replaceQuery: false,
          regexFlags: ["g"],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.originalText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
    it("With Concurrency", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 7 files matched/;
      const searchParam = {
        query: {
          searchQuery: testUtils.searchQuery,
          replaceQuery: false,
          regexFlags: ["g"],
          isRegex: false,
          matchWhole: false,
        },
        directories: [testDir],
        isMultiThreaded: true,
        numOfThreads: 2,
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.originalText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
  });

  describe("# Regex Query", function () {
    it("Simple Query", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 7 files updated/;
      const searchParam = {
        query: {
          searchQuery: testUtils.searchQuery,
          replaceQuery: testUtils.replacementText,
          regexFlags: ["g"],
          isRegex: true,
          matchWhole: true,
        },
        directories: [testDir],
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.simpleReplaceText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
    it("Complex Query", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 7 files updated/;
      const searchParam = {
        query: {
          searchQuery: testUtils.regexQuery,
          replaceQuery: testUtils.replacementText,
          regexFlags: ["g"],
          isRegex: true,
          matchWhole: true,
        },
        directories: [testDir],
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.regexReplaceText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
    it("Regex with isRegex off", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 0 files updated/;
      const searchParam = {
        query: {
          searchQuery: testUtils.regexQuery,
          replaceQuery: testUtils.replacementText,
          regexFlags: ["g"],
          isRegex: false,
          matchWhole: true,
        },
        directories: [testDir],
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.originalText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
  });

  describe("# Regex Modifier Flags", function () {
    it("Non Global - without 'g' flag", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 7 files updated/;
      const searchParam = {
        query: {
          searchQuery: testUtils.searchQuery,
          replaceQuery: testUtils.replacementText,
          regexFlags: [],
          isRegex: true,
          matchWhole: true,
        },
        directories: [testDir],
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.nonGlobalReplaceText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
    it("Case Sensitive - without 'i' flag", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 7 files updated/;
      const searchParam = {
        query: {
          searchQuery: testUtils.caseSensitiveQuery,
          replaceQuery: testUtils.replacementText,
          regexFlags: ["g"],
          isRegex: false,
          matchWhole: true,
        },
        directories: [testDir],
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.caseSensitiveText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
    it("Case InSensitive - with 'i' flag", function (done) {
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = /Search Completed: 7 files updated/;
      const searchParam = {
        query: {
          searchQuery: testUtils.caseSensitiveQuery,
          replaceQuery: testUtils.replacementText,
          regexFlags: ["g", "i"],
          isRegex: false,
          matchWhole: true,
        },
        directories: [testDir],
      };
      echoSearch(searchParam, ({ message }) => {
        try {
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          assert.strictEqual(fileContent, testUtils.caseInsensitiveText);
          assert.match(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      }).search();
    });
  });
});
