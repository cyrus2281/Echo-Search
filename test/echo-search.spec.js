/**
 * Folder Structure
 * test
 *  - testDir
 *   - A
 *     - C
 *       - file4.js
 *     - file2.md
 *   - B
 *      - file3.txt
 *   - file1.txt
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const testUtils = require("./test.utils.js");
const echoSearch = require("../src/EchoSearch/echo-search.js");

describe("Echo-Search.js", function () {
  beforeEach(function () {
    const dirPath = path.join(__dirname, "testDir");
    // make test environment
    const makeTextEnv = () => {
      // create directory testDir
      fs.mkdirSync(dirPath);
      // create directory A
      fs.mkdirSync(path.join(dirPath, "A"));
      // create directory B
      fs.mkdirSync(path.join(dirPath, "B"));
      // create directory C
      fs.mkdirSync(path.join(dirPath, "A", "C"));
      // create file1.txt
      fs.writeFileSync(path.join(dirPath, "file1.txt"), testUtils.originalText);
      // create file2.js
      fs.writeFileSync(
        path.join(dirPath, "A", "file2.md"),
        testUtils.originalText
      );
      // create file3.js
      fs.writeFileSync(
        path.join(dirPath, "B", "file3.txt"),
        testUtils.originalText
      );
      // create file4.js
      fs.writeFileSync(
        path.join(dirPath, "A", "C", "file4.js"),
        testUtils.originalText
      );
    };

    // force remove directory testDir and recreate it
    if (fs.existsSync(dirPath))
      fs.rm(dirPath, { recursive: true, force: true }, makeTextEnv);
    else makeTextEnv();
  });

  after(function (done) {
    const dirPath = path.join(__dirname, "testDir");
    // force remove directory testDir
    if (fs.existsSync(dirPath)) {
      fs.rm(dirPath, { recursive: true, force: true }, done);
    }
  });

  describe("# File Count", function () {
    it("Single Directory - No Customization", function (done) {
      const fileCountText = "Found 4 files.";
      const testDir = path.join(__dirname, "testDir");
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
      );
    });
    it("Single Directory - with inclusion", function (done) {
      const fileCountText = "Found 3 files.";
      const testDir = path.join(__dirname, "testDir");
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
      );
    });
    it("Single Directory - with exclusion", function (done) {
      const fileCountText = "Found 3 files.";
      const testDir = path.join(__dirname, "testDir");
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
      );
    });
    it("Multi Directory - No Customization", function (done) {
      const fileCountText = "Found 3 files.";
      const testDir = path.join(__dirname, "testDir");
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
      );
    });
    it("Multi Directory - with inclusion", function (done) {
      const fileCountText = "Found 2 files.";
      const testDir = path.join(__dirname, "testDir");
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
      );
    });
    it("Multi Directory - with exclusion", function (done) {
      const fileCountText = "Found 2 files.";
      const testDir = path.join(__dirname, "testDir");
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
      );
    });
  });

  describe("# Search And Replace", function () {
    it("Simple - no flags", function (done) {
      const testDir = path.join(__dirname, "testDir");
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = "Search Completed: 4 files updated.";
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
        // read file and check if the content is replaced
        const fileContent = fs.readFileSync(testDirFile1, "utf8");
        try {
          assert.strictEqual(fileContent, testUtils.simpleReplaceText);
          assert.strictEqual(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
    it("partial query - matchWhole off", function (done) {
      const testDir = path.join(__dirname, "testDir");
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = "Search Completed: 4 files updated.";
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
        // read file and check if the content is replaced
        const fileContent = fs.readFileSync(testDirFile1, "utf8");
        try {
          assert.strictEqual(fileContent, testUtils.partialReplacedText);
          assert.strictEqual(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
    it("partial query - matchWhole on", function (done) {
      const testDir = path.join(__dirname, "testDir");
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = "Search Completed: 0 files updated.";
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
        // read file and check if the content is replaced
        const fileContent = fs.readFileSync(testDirFile1, "utf8");
        try {
          assert.strictEqual(fileContent, testUtils.originalText);
          assert.strictEqual(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe("# Regex Query", function () {
    it("Simple Query", function (done) {
      const testDir = path.join(__dirname, "testDir");
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = "Search Completed: 4 files updated.";
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
        // read file and check if the content is replaced
        const fileContent = fs.readFileSync(testDirFile1, "utf8");
        try {
          assert.strictEqual(fileContent, testUtils.simpleReplaceText);
          assert.strictEqual(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
    it("Complex Query", function (done) {
      const testDir = path.join(__dirname, "testDir");
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = "Search Completed: 4 files updated.";
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
        // read file and check if the content is replaced
        const fileContent = fs.readFileSync(testDirFile1, "utf8");
        try {
          assert.strictEqual(fileContent, testUtils.regexReplaceText);
          assert.strictEqual(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
    it("Regex with isRegex off", function (done) {
        const testDir = path.join(__dirname, "testDir");
        const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
        const completionMessage = "Search Completed: 0 files updated.";
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
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          try {
            assert.strictEqual(fileContent, testUtils.originalText);
            assert.strictEqual(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        });
      });
  });

  describe("# Regex Modifier Flags", function () {
    it("Non Global - without 'g' flag", function (done) {
        const testDir = path.join(__dirname, "testDir");
        const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
        const completionMessage = "Search Completed: 4 files updated.";
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
          // read file and check if the content is replaced
          const fileContent = fs.readFileSync(testDirFile1, "utf8");
          try {
            assert.strictEqual(fileContent, testUtils.nonGlobalReplaceText);
            assert.strictEqual(message, completionMessage);
            done();
          } catch (err) {
            done(err);
          }
        });
      });
    it("Case Sensitive - without 'i' flag", function (done) {
      const testDir = path.join(__dirname, "testDir");
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = "Search Completed: 4 files updated.";
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
        // read file and check if the content is replaced
        const fileContent = fs.readFileSync(testDirFile1, "utf8");
        try {
          assert.strictEqual(fileContent, testUtils.caseSensitiveText);
          assert.strictEqual(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
    it("Case InSensitive - with 'i' flag", function (done) {
      const testDir = path.join(__dirname, "testDir");
      const testDirFile1 = path.join(__dirname, "testDir", "file1.txt");
      const completionMessage = "Search Completed: 4 files updated.";
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
        // read file and check if the content is replaced
        const fileContent = fs.readFileSync(testDirFile1, "utf8");
        try {
          assert.strictEqual(fileContent, testUtils.caseInsensitiveText);
          assert.strictEqual(message, completionMessage);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
