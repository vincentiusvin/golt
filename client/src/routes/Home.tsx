import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import "./Home.css";
import {
  ICodeCollectionGetResponse,
  ICodeResourceGetResponse,
  ICodeResourcePutRequest,
} from "../shared_interfaces";
import { useCookies } from "react-cookie";

function Home() {
  const [codeList, setCodeList] = useState<
    { display_name: string; id: number }[]
  >([]);
  const [selectedCode, setSelectedCode] =
    useState<ICodeResourceGetResponse | null>(null);
  const [cookies] = useCookies();

  const [lastTimeout, setLastTimeout] = useState<
    number | undefined
  >();

  useEffect(() => {
    fetch(`/api/users/${cookies["user_id"]}/codes`)
      .then((x) => x.json())
      .then((x: ICodeCollectionGetResponse) => setCodeList(x));
  }, [cookies]);

  return (
    <>
      <div className="flex gap-2">
        {codeList.map(({ display_name, id }, i) => (
          <button
            key={id}
            className={
              "p-2 rounded" + (i % 2 === 0 ? " bg-bg" : " bg-white")
            }
            onClick={() => {
              fetch(`/api/users/${cookies["user_id"]}/codes/${id}`)
                .then((x) => x.json())
                .then((x: ICodeResourceGetResponse) =>
                  setSelectedCode(x)
                );
            }}
          >
            {display_name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 h-screen p-5 gap-2">
        <Editor
          theme="vs-dark"
          defaultLanguage="c"
          value={selectedCode?.code}
          onChange={(val) => {
            clearTimeout(lastTimeout);
            const body: ICodeResourcePutRequest = {
              code: val || "",
            };
            const newTimeout = setTimeout(() => {
              fetch(
                `/api/users/${cookies["user_id"]}/codes/${selectedCode?.id}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                }
              )
                .then((x) => x.json())
                .then((x: ICodeResourceGetResponse) =>
                  setSelectedCode(x)
                );
            }, 500);
            setLastTimeout(Number(newTimeout));
          }}
        />
        <div className="overflow-scroll bg-bg">
          <pre>{selectedCode?.result}</pre>
        </div>
      </div>
    </>
  );
}

export default Home;
