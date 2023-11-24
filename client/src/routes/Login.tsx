import { useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { getSession } from "../model";

const Login = () => {
  const [, setCookies] = useCookies();
  const navigate = useNavigate();
  const [msg, setMsg] = useState<["good" | "bad", string]>([
    "good",
    "",
  ]);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const loginHandler = () => {
    getSession(
      usernameRef.current?.value || "",
      passwordRef.current?.value || ""
    ).then((x) => {
      if (x.success) {
        setCookies("session", JSON.stringify(x), {
          expires: new Date(x.expires),
          sameSite: "lax",
        });
        setMsg([
          "good",
          "Login sucessfull! Redirecting to home in 3 seconds...",
        ]);
        setTimeout(() => navigate("/"), 3 * 1000);
      } else {
        setMsg(["bad", x.message]);
      }
    });
  };

  return (
    <div className="flex-grow flex flex-col justify-center gap-5">
      <div className="text-center text-lg font-bold">Login</div>
      <div className="grid w-1/4 mx-auto gridForm gap-x-5 gap-y-2">
        Username:
        <input ref={usernameRef} />
        Password:
        <input ref={passwordRef} />
        <button className="col-span-2 bg-bg" onClick={loginHandler}>
          Login
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
  );
};

export default Login;
