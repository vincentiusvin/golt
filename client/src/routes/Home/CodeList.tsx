import { useRef, useState } from "react";
import "./Home.css";
import { CodeResource } from "../../shared_interfaces";
import CodeSelector from "./CodeSelector";
import { deleteCode, putCode } from "../../model";
import { useCookies } from "react-cookie";

type CodeListProps = {
  list: CodeResource[];
  onItemSelected: (item: CodeResource) => void;
  onAddItem: (display_name: string) => void;
  refresh: () => void;
};

const CodeList = (props: CodeListProps) => {
  const { list, onItemSelected, onAddItem, refresh } = props;
  const [addCodeBox, setAddCodeBox] = useState(false);
  const codeNameRef = useRef<HTMLInputElement>(null);
  const [cookies] = useCookies();
  const user_id = cookies["user_id"];

  return (
    <div className="flex gap-2">
      {list.map((x, i) => (
        <CodeSelector
          key={x.id}
          text={x.display_name}
          color={i % 2 === 0}
          onClick={() => onItemSelected(x)}
          onRename={(val) => {
            putCode(user_id, x.id, x.code, val);
            refresh();
          }}
          onDelete={() => {
            deleteCode(user_id, x.id);
            refresh();
          }}
        />
      ))}
      <div className="bg-gray">
        {addCodeBox ? (
          <>
            <span className="mr-5">Name:</span>
            <input ref={codeNameRef} className="rounded mr-5"></input>
            <button
              onClick={() => {
                codeNameRef.current?.value &&
                  onAddItem(codeNameRef.current.value);
                setAddCodeBox(false);
              }}
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
    </div>
  );
};

export default CodeList;
