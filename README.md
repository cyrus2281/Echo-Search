# Eco-Search

[![release](https://img.shields.io/github/v/release/cyrus2281/Echo-Search?color=00ff00)](https://github.com/cyrus2281/Echo-Search/releases)
[![version](https://img.shields.io/github/package-json/v/cyrus2281/Echo-Search)](https://github.com/cyrus2281/Echo-Search)
[![License](https://img.shields.io/github/license/cyrus2281/echo-search)](https://github.com/cyrus2281/Echo-Search/blob/main/LICENSE)
[![react](https://img.shields.io/github/package-json/dependency-version/cyrus2281/Echo-Search/react?logo=react&color=lightblue)](https://reactjs.org/)
[![electron](https://img.shields.io/github/package-json/dependency-version/cyrus2281/Echo-Search/dev/electron?logo=electron&color=lightblue&logoColor=lightblue)](https://www.electronjs.org/)
[![buyMeACoffee](https://img.shields.io/badge/BuyMeACoffee-cyrus2281-yellow?logo=buymeacoffee)](https://www.buymeacoffee.com/cyrus2281)
<br>

Echo Search is a feature-rich and powerful application that allows you to search for a specific text or regular expression query in the content of files within a directory and its subdirectories. It also offers the ability to replace the found text with another string of your choice. With its wide range of options and capabilities, it is an ideal solution for software developers, data analysts, and anyone looking for an efficient way to search and replace text in files.

## Key Features

- Search for text or regular expressions: Echo Search supports both simple text queries and complex regular expression queries.

- Multi-line queries: You can search for text across multiple lines in a single file.

- Search only mode: If you just want to search for files that contain a specific query, Echo Search has a search only mode that allows you to do just that, without making any replacements.

- Case sensitivity: You can choose whether the search should be case sensitive or not.

- Whole word match or partial match: You can choose to search for the entire word only, or allow for partial matches.

- Multiple parent directories: You can select multiple parent directories to search in, making it easy to search across a wide range of files.

- File extension options: You can choose to search in all file types, or select specific file extensions to focus on. You can also exclude specific file extensions if desired.

- Concurrent processing: Echo Search supports concurrent processing, allowing you to run the application in multiple threads for faster results. You can select up to 80% of the available cores.

- Regular expression flags: Echo Search supports a range of regular expression flags, allowing you to customize the search even further.

- Live feedback console: Echo Search provides a console with live feedback on the progress of the search, making it easy to monitor its progress. You can also clear the console at any time.

- Direct file and directory access: You can open the updated files or their directories with the file pre-selected directly from the console.

***Note:** This app is only for text based files and can NOT be used with files such as pdf, doc, excel, etc.*

<hr>

## Installation

### Windows

1. Open the `latest` release from [Releases](https://github.com/cyrus2281/Echo-Search/releases).
2. From `Assets` download the `exe` version.
   `echo-search-X.X.X.WIN.Setup.exe`
3. Install the app by running (double clicking) the file.

### MacOS

1. Open the `latest` release from [Releases](https://github.com/cyrus2281/Echo-Search/releases).
2. From `Assets` download the `zip` version.
   `echo-search-darwin-x64-X.X.X.zip`
3. After downloading the zip, double click on it to extract the file.
4. Right click on the file and select open. You might see a warning that the developer is unknown, accept and open the app (this is because the app is not registered under the apple's paid subscription).
5. Drag and move the app to the application folder.

### Linux

1. Open the `latest` release from [Releases](https://github.com/cyrus2281/Echo-Search/releases).
2. From `Assets` download the `source code`
3. unzip the code
4. from within the repository run: `npm i && npm run make:linux`
5. the app will be built in the `out` directory (exact path will be visible in the terminal)

That's it. Enjoy the app.

<hr>

Echo Search is a versatile and efficient tool for searching and replacing text in files. With its extensive range of options and capabilities, it is suitable for a wide range of use cases, whether you are a software developer looking for a quick way to update code, or a data analyst searching for specific information in large datasets. Try Echo Search today and see how it can make your life easier.

## Application Screenshots

<div style="display:flex; gap:2%;">
  <img src="./images/baseapp.png" width="49%" />
  <img src="./images/options.png" width="49%" />
</div>
<br>
<div style="display:flex; gap:2%;">
  <img src="./images/filled.png" width="49%" />
  <img src="./images/running.png"  width="49%" />
</div>

## License

The app is written using Electron (NodeJS) and React.

Echo Search is licensed under the [BSD 3-Clause](./LICENSE).

## Java

This app was originally written in Java. the source code for the legacy version is still available in the `Java` directory.

NOTICE: this version is no longer supported the the latest release is the recommend version to use.

<br>

<hr>

Copyright(c) Cyrus Mobini 2023
