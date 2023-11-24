import { useRef, useState } from "react";
import "./Home.css";
import {
  CodeResource,
  SessionResource,
} from "../../shared_interfaces";
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
  const session: SessionResource | null = cookies["session"];

  return (
    <div className="flex gap-2">
      {list.map((x, i) => (
        <CodeSelector
          key={x.id}
          text={x.display_name}
          color={i % 2 === 0}
          onClick={() => onItemSelected(x)}
          onRename={(val) => {
            if (!session) {
              return;
            }
            putCode(session.user_id, x.id, x.code, val).then(() =>
              refresh()
            );
          }}
          onDelete={() => {
            if (!session) {
              return;
            }
            deleteCode(session.user_id, x.id).then(() => refresh());
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
