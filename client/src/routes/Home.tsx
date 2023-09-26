import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { DisasmResult, UserCode } from "../shared_interfaces";
import "./Home.css";

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
    fetch("/api/code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    }).then((response) => {
      if (response.status == 201) {
        fetch("/api/compile", {
          method: "GET",
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
      }
    });
  };
  const [oldCode, setOldCode] = useState(undefined);
  useEffect(() => {});
  const useOnce = () => {
    if (oldCode) {
      const temp = oldCode;
      setOldCode(undefined);
      return temp;
    }
  };
  return (
    <Editor
      theme="vs-dark"
      defaultLanguage="c"
      value={useOnce()}
      onMount={(editor) => {
        fetch("/api/code", {
          method: "GET",
        })
          .then((response) => {
            response
              .json()
              .then((val: UserCode) => {
                editor.setValue(
                  val?.code || "int main(){\n\tint a = 5;\n}"
                );
              })
              .catch(() =>
                editor.setValue("int main(){\n\tint a = 5;\n}")
              );
          })
          .catch(() =>
            editor.setValue("int main(){\n\tint a = 5;\n}")
          );
      }}
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

type DisasmProps = {
  disasm: string;
};

const Disasm = (props: DisasmProps) => {
  const { disasm } = props;
  return (
    <div className="overflow-scroll bg-bg">
      <pre>{disasm}</pre>
    </div>
  );
};

function Home() {
  const [disasmCode, setDisasmCode] = useState("");
  return (
    <div className="grid grid-cols-2 h-screen p-5 gap-2">
      <Code setDisasm={setDisasmCode} />
      <Disasm disasm={disasmCode} />
    </div>
  );
}

export default Home;
