import { useState } from "react";
import "./App.css";
import { UserCode, DisasmResult } from "./shared_interfaces";
import { Editor } from "@monaco-editor/react";

type CodeProps = {
  setDisasm: (msg: string) => void;
};

const Code = (props: CodeProps) => {
  const { setDisasm } = props;
  const [lastTimeout, setLastTimeout] = useState<
    number | undefined
  >();
  const makeRequest = (userCode: string) => {
    const request: UserCode = { code: userCode };
    fetch("/api/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(request),
    }).then((response) => {
      response
        .json()
        .then((disasm: DisasmResult) =>
          setDisasm(
            disasm.status
              ? disasm.code
              : "Compilation Failed\n\n\n" + disasm.reason
          )
        );
    });
  };
  return (
    <Editor
      theme="vs-dark"
      defaultLanguage="c"
      defaultValue={"int main(){\n\tint a = 5;\n}"}
      onMount={() => makeRequest("int main(){\n\tint a = 5;\n}")}
      onChange={(value) => {
        if (!value) {
          return;
        }
        clearTimeout(lastTimeout);
        setLastTimeout(setTimeout(() => makeRequest(value), 500));
      }}
    />
  );
};

function App() {
  const [disasm, setDisasm] = useState("");
  return (
    <div className="grid grid-cols-2 h-screen p-5 gap-2">
      <Code setDisasm={setDisasm} />
      <div className="overflow-scroll bg-bg">
        <pre>{disasm}</pre>
      </div>
    </div>
  );
}

export default App;
