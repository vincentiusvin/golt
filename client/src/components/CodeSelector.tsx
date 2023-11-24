import { useRef, useState } from "react";

type CodeSelectorProps = {
  text: string;
  onRename?: (newName: string) => void;
  onDelete?: () => void;
  onClick?: () => void;
  color?: string;
};

const CodeSelector = (props: CodeSelectorProps) => {
  const { text, color, onClick, onRename, onDelete } = props;
  const renameRef = useRef<HTMLInputElement | null>(null);
  const [renameActive, setRenameActive] = useState(false);
  return (
    <div
      className={
        "flex gap-1 items-center p-2 rounded" + color
          ? "bg-bg"
          : "bg-gray"
      }
      onClick={onClick}
    >
      {renameActive ? (
        <>
          <input ref={renameRef}></input>
          <button
            onClick={() => setRenameActive(false)}
            className="bg-red px-2 py-1"
          >
            ✕
          </button>
          <button
            className="bg-green px-2 py-1"
            onClick={
              onRename &&
              (() => {
                onRename(renameRef.current!.value);
              })
            }
          >
            ✓
          </button>
        </>
      ) : (
        <>
          <span>{text}</span>
          <button
            onClick={() => {
              setRenameActive(true);
              renameRef.current?.focus();
            }}
            className="bg-bg px-2 py-1"
          >
            ✎
          </button>
          <button onClick={onDelete} className="bg-red px-2 py-1">
            ✕
          </button>
        </>
      )}
    </div>
  );
};

export default CodeSelector;
