import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import CodeEditor from "../components/Editor";
import { addCode, getCode, getCodes, putCode } from "../model";
import { CodeResource, ResponseBody } from "../shared_interfaces";
import "./Home.css";

function Home() {
  const [codeList, setCodeList] = useState<
    { display_name: string; id: number }[]
  >([]);
  const [selectedCode, setSelectedCode] =
    useState<CodeResource | null>(null);
  const [addCodeBox, setAddCodeBox] = useState(false);

  const [cookies] = useCookies();
  const fetchCodeList = () => {
    if (!cookies["user_id"]) {
      return;
    }
    getCodes(cookies["user_id"]).then((x) => {
      if (x.success) {
        setCodeList(x.resources);
      }
    });
  };

  useEffect(fetchCodeList, [cookies]);
  const codeNameRef = useRef<HTMLInputElement>(null);

  const addCodeHandler = () => {
    addCode(
      cookies["user_id"],
      "int main(){\n\n}",
      codeNameRef.current?.value || ""
    ).then((x: ResponseBody<CodeResource>) => {
      if (!x.success) {
        return;
      }
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
              getCode(cookies["user_id"], id).then(
                (x: ResponseBody<CodeResource>) =>
                  x.success && setSelectedCode(x)
              );
            }}
          >
            {display_name}
            <button className="bg-red">✕</button>
          </button>
        ))}
        {cookies["session_token"] && (
          <div className="bg-gray">
            {addCodeBox ? (
              <>
                <span className="mr-5">Name:</span>
                <input
                  ref={codeNameRef}
                  className="rounded mr-5"
                ></input>
                <button
                  onClick={addCodeHandler}
                  className="mr-5 bg-green"
                >
                  ✓
                </button>
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
        )}
      </div>
      <div className="grid grid-cols-2 h-screen p-5 gap-2">
        <CodeEditor
          code={selectedCode?.code || ""}
          onSubmit={(val) => {
            if (!selectedCode) {
              return;
            }
            putCode(
              cookies["user_id"],
              selectedCode.id,
              val,
              selectedCode.display_name
            ).then(
              (x: ResponseBody<CodeResource>) =>
                x.success && setSelectedCode(x)
            );
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
