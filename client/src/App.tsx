import { FormEventHandler, useState } from "react";
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

const Login = () => {
  const loginRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    if (!form || !(form instanceof HTMLFormElement)) {
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(data),
    }).then((response) => {
      response.json().then(response);
    });
  };

  return (
    <form
      onSubmit={loginRequest}
      className="grid grid-cols-2 w-4/5 mx-auto"
    >
      Username:
      <input name="username" />
      Password:
      <input name="password" />
      <button type="submit" className="col-span-2">
        Submit
      </button>
    </form>
  );
};

function App() {
  const [disasm, setDisasm] = useState("");
  return (
    <Login />
    // <div className="grid grid-cols-2 h-screen p-5 gap-2">
    //   <Code setDisasm={setDisasm} />
    //   <div className="overflow-scroll bg-bg">
    //     <pre>{disasm}</pre>
    //   </div>
    // </div>
  );
}

export default App;
