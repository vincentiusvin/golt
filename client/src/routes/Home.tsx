import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  ICodeCollectionGetResponse,
  ICodeCollectionPostRequest,
  ICodeResourceGetResponse,
  ICodeResourcePutRequest,
} from "../shared_interfaces";
import "./Home.css";

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

  const [addCodeBox, setAddCodeBox] = useState(false);

  const fetchCodeList = () => {
    fetch(`/api/users/${cookies["user_id"]}/codes`)
      .then((x) => x.json())
      .then((x: ICodeCollectionGetResponse) => setCodeList(x));
  };

  useEffect(fetchCodeList, [cookies]);

  const codeAddRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    if (!form || !(form instanceof HTMLFormElement)) {
      return;
    }

    const data = {
      code: "int main(){\n\n}",
      ...Object.fromEntries(new FormData(form)),
    } as ICodeCollectionPostRequest;

    fetch(`/api/users/${cookies["user_id"]}/codes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((x) => x.json())
      .then((x: ICodeResourceGetResponse) => {
        fetchCodeList();
        setSelectedCode(x);
        setAddCodeBox(false);
      });
  };

  return (
    <>
      <div className="flex gap-2">
        {codeList.map(({ display_name, id }, i) => (
          <button
            key={id}
            className={
              "p-2 rounded" + (i % 2 === 0 ? " bg-bg" : " bg-gray")
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
        <div className="bg-gray">
          {addCodeBox ? (
            <>
              <form className="inline" onSubmit={codeAddRequest}>
                <span className="mr-5">Name:</span>
                <input
                  className="rounded mr-5"
                  name="display_name"
                ></input>
                <button className="mr-5 bg-green">✓</button>
              </form>
              <button
                className="bg-red"
                onClick={() => setAddCodeBox(false)}
              >
                ✕
              </button>
            </>
          ) : (
            <button
              className="font-bold"
              onClick={() => setAddCodeBox(true)}
            >
              +
            </button>
          )}
        </div>
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
