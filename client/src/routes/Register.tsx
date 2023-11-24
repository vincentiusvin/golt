import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../model";

const Register = () => {
  const navigate = useNavigate();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const registerHandler = () => {
    getSession(
      usernameRef.current?.value || "",
      passwordRef.current?.value || ""
    ).then((x) => {
      if (x.success) {
        setMsg([
          "good",
          "Registration sucessful! Redirecting to Login in 3 seconds...",
        ]);
        setTimeout(() => navigate("/login"), 3 * 1000);
      } else {
        setMsg(["bad", x.message]);
      }
    });
  };

  const [msg, setMsg] = useState<["good" | "bad", string]>([
    "good",
    "",
  ]);

  return (
    <>
      <div className="flex-grow flex flex-col justify-center gap-5">
        <div className="text-center text-lg font-bold">Register</div>
        <div className="grid w-1/4 mx-auto gridForm gap-x-5 gap-y-2">
          Username:
          <input ref={usernameRef} name="display_name" />
          Password:
          <input ref={passwordRef} name="password" />
          <button
            onClick={registerHandler}
            className="col-span-2 bg-bg"
          >
            Register
          </button>
        </div>
        <div
          className={
            "text-center" +
            (msg[0] == "good" ? " text-green" : " text-red")
          }
        >
          {msg[1]}
        </div>
      </div>
    </>
  );
};

export default Register;
