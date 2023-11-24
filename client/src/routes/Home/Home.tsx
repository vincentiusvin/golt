import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import CodeEditor from "./Editor";
import { addCode, getCodes, putCode } from "../../model";
import {
  CodeResource,
  ResponseBody,
  SessionResource,
} from "../../shared_interfaces";
import "./Home.css";
import CodeList from "./CodeList";

const Home = () => {
  const [codeList, setCodeList] = useState<CodeResource[]>([]);
  const [cookies] = useCookies();
  const session: SessionResource | null = cookies["session"];

  const updateCodeList = () => {
    if (!session) {
      return;
    }
    getCodes(session.user_id).then((x) => {
      if (x.success) {
        setCodeList(x.resources);
      }
    });
  };
  useEffect(updateCodeList, [session]);

  const [selectedCode, setSelectedCode] =
    useState<CodeResource | null>(null);
  const addCodeHandler = (display_name: string) => {
    if (!session) {
      return;
    }
    addCode(session.user_id, "int main(){\n\n}", display_name)
      .then((x: ResponseBody<CodeResource>) => {
        if (!x.success) {
          throw new Error(x.message);
        }
        setSelectedCode(x);
      })
      .then(() => updateCodeList());
  };

  return (
    <div>
      {!session && (
        <div className="flex items-center justify-center font-bold bg-gray w-full h-full z-10 bg-opacity-80 absolute">
          Please login!
        </div>
      )}
      <CodeList
        list={codeList}
        onAddItem={addCodeHandler}
        onItemSelected={(x) => setSelectedCode(x)}
        refresh={updateCodeList}
      />
      <div className="grid grid-cols-2 h-screen p-5 gap-2">
        <CodeEditor
          code={selectedCode?.code || ""}
          onSubmit={(val) => {
            if (!selectedCode || !session) {
              return;
            }
            putCode(
              session.user_id,
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
    </div>
  );
};

export default Home;
