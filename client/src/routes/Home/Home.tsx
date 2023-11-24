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

  const [selectedCode, setSelectedCode] = useState<number | null>(
    null
  );
  const selectedCodeObj = codeList.find((x) => x.id === selectedCode);
  const addCodeHandler = (display_name: string) => {
    if (!session) {
      return;
    }
    addCode(session.user_id, "int main(){\n\n}", display_name)
      .then((x: ResponseBody<CodeResource>) => {
        if (!x.success) {
          throw new Error(x.message);
        }
        setSelectedCode(x.id);
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
        onItemSelected={(x) => setSelectedCode(x.id)}
        refresh={updateCodeList}
      />
      <div className="grid grid-cols-2 h-screen p-5 gap-2">
        <CodeEditor
          code={selectedCodeObj?.code || ""}
          onSubmit={(val) => {
            if (!selectedCodeObj || !session) {
              return;
            }
            putCode(
              session.user_id,
              selectedCodeObj.id,
              val,
              selectedCodeObj.display_name
            ).then(
              (x: ResponseBody<CodeResource>) =>
                x.success && updateCodeList()
            );
          }}
        />
        <div className="overflow-scroll bg-bg">
          <pre>{selectedCodeObj?.result}</pre>
        </div>
      </div>
    </div>
  );
};

export default Home;
