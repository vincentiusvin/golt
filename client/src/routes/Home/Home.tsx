import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import CodeEditor from "./Editor";
import { addCode, getCodes, putCode } from "../../model";
import { CodeResource, ResponseBody } from "../../shared_interfaces";
import "./Home.css";
import CodeList from "./CodeList";

const Home = () => {
  const [codeList, setCodeList] = useState<CodeResource[]>([]);
  const [cookies] = useCookies();
  const user_id = cookies["user_id"];

  const updateCodeList = () => {
    if (!user_id) {
      return;
    }
    getCodes(user_id).then((x) => {
      if (x.success) {
        setCodeList(x.resources);
      }
    });
  };
  useEffect(updateCodeList, [user_id]);

  const [selectedCode, setSelectedCode] =
    useState<CodeResource | null>(null);
  const addCodeHandler = (display_name: string) => {
    addCode(user_id, "int main(){\n\n}", display_name)
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
      {!user_id && (
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
            if (!selectedCode) {
              return;
            }
            putCode(
              user_id,
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
