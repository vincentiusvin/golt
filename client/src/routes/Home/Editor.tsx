import { Editor } from "@monaco-editor/react";
import { useState } from "react";

type CodeEditorProps = {
  code: string;
  onSubmit: (val: string) => void;
};

const CodeEditor = (props: CodeEditorProps) => {
  const { code, onSubmit } = props;
  const [lastTimeout, setLastTimeout] = useState<
    number | undefined
  >();
  return (
    <Editor
      theme="vs-dark"
      defaultLanguage="c"
      value={code}
      onChange={(val) => {
        clearTimeout(lastTimeout);
        const newTimeout = setTimeout(() => {
          onSubmit(val || "");
        }, 500);
        setLastTimeout(Number(newTimeout));
      }}
    />
  );
};

export default CodeEditor;
