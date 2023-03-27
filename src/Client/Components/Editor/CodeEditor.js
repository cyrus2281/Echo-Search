import React from "react";
import Editor from "@monaco-editor/react";

import useEditor from "../../store/useEditor";

function CodeEditor() {
  const requestCloseFile = useEditor((state) => state.requestCloseFile);
  const initialFileContent = useEditor((state) => state.initialFileContent);
  const setFileContent = useEditor((state) => state.setFileContent);
  const saveFile = useEditor((state) => state.saveFile);
  const filePath = useEditor((state) => state.filePath);
  const language = useEditor((state) => state.language);
  const setLanguage = useEditor((state) => state.setLanguage);
  const fontSize = useEditor((state) => state.fontSize);
  const wordWrap = useEditor((state) => state.wordWrap);
  const toggleWordWrap = useEditor((state) => state.toggleWordWrap);
  const changeFontSize = useEditor((state) => state.changeFontSize);

  function handleEditorChange(value) {
    setFileContent(value);
  }

  function handleEditorDidMount(editor, monaco) {
    const availableLanguages = monaco.languages.getLanguages();
    const extension = filePath.slice(filePath.lastIndexOf("."));
    const lang =
      availableLanguages.find((lang) => {
        if (lang.extensions) {
          return lang.extensions.includes(extension);
        }
        return lang.id === extension;
      })?.id || "plaintext";
    setLanguage(lang, availableLanguages);
    editor.addAction({
      id: "save",
      label: "Save File",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      contextMenuGroupId: "file",
      run: function () {
        saveFile();
      },
    });
    editor.addAction({
      id: "word-wrap",
      label: "Word Wrap",
      keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
      run: function () {
        toggleWordWrap();
      },
    });
    editor.addAction({
      id: "close-page",
      label: "Close File",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyW],
      run: function () {
        requestCloseFile();
      },
    });
    editor.addAction({
      id: "increase-font-size",
      label: "Increase Font Size",
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal,
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.NumpadAdd,
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal | monaco.KeyMod.Shift,
      ],
      run: function () {
        changeFontSize(true);
      },
    });
    editor.addAction({
      id: "decrease-font-size",
      label: "Decrease Font Size",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus],
      run: function () {
        changeFontSize(false);
      },
    });
  }

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      path={filePath}
      language={language}
      defaultValue={initialFileContent}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        fontSize,
        wordWrap: wordWrap ? "on" : "off",
      }}
    />
  );
}

export default CodeEditor;
