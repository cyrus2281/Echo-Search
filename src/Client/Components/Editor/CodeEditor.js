import React from "react";
import Editor from "@monaco-editor/react";

import useEditor from "../../store/useEditor";

function CodeEditor() {
  const initialFileContent = useEditor((state) => state.initialFileContent);
  const setFileContent = useEditor((state) => state.setFileContent);
  const saveFile = useEditor((state) => state.saveFile);
  const filePath = useEditor((state) => state.filePath);
  const language = useEditor((state) => state.language);
  const setLanguage = useEditor((state) => state.setLanguage);

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
    />
  );
}

export default CodeEditor;
