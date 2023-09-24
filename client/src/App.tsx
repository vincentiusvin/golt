import { useState } from "react";
import "./App.css";
import {
  incoming_request,
  outgoing_request,
} from "./shared_interfaces";

type CodeProps = {
  setDisasm: (msg: string) => void;
};

const Code = (props: CodeProps) => {
  const { setDisasm } = props;
  const [lastTimeout, setLastTimeout] = useState<
    number | undefined
  >();
  const makeRequest = (userCode: string) => {
    const request: incoming_request = { code: userCode };
    fetch("/api/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(request),
    }).then((response) => {
      response
        .json()
        .then((disasm: outgoing_request) =>
          setDisasm(
            disasm.status
              ? disasm.code
              : "Compilation Failed\n\n\n" + disasm.reason
          )
        );
    });
  };
  return (
    <textarea
      className="h-full overflow-scroll bg-bg outline-none"
      onKeyUp={(event) => {
        clearTimeout(lastTimeout);
        setLastTimeout(
          setTimeout(
            () =>
              event.target instanceof HTMLTextAreaElement &&
              makeRequest(event.target.value),
            500
          )
        );
      }}
      onKeyDown={(event) => {
        if (
          event.key == "Tab" &&
          event.target instanceof HTMLTextAreaElement
        ) {
          const el = event.target;
          const start = el.selectionStart;
          const end = el.selectionEnd;
          event.preventDefault();
          el.value = el.value.substring(0, start) + "\t" + el.value.substring(start);
          el.setSelectionRange(start + 1, end + 1);
        }
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
