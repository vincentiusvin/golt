import { FormEventHandler, useState } from "react";
import "./App.css";
import { UserCode, DisasmResult, Session } from "./shared_interfaces";
import { Editor } from "@monaco-editor/react";
import { CookiesProvider, useCookies } from "react-cookie";

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
  const [cookies, setCookies] = useCookies();

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
      response
        .json()
        .then((val: Session) =>
          setCookies("session_token", val.token, {
            expires: new Date(val.expires),
          })
        );
    });
  };

  return (
    <form
      onSubmit={loginRequest}
      className="grid w-1/2 mx-auto gridForm gap-x-5 gap-y-2"
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
    <CookiesProvider>
      <Login />
      {
        // <div className="grid grid-cols-2 h-screen p-5 gap-2">
        //   <Code setDisasm={setDisasm} />
        //   <div className="overflow-scroll bg-bg">
        //     <pre>{disasm}</pre>
        //   </div>
        // </div>
      }
    </CookiesProvider>
  );
}

export default App;
