import { useCookies } from "react-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponseBody,
  SessionResource,
  SessionResourceInput,
} from "../shared_interfaces";

const Login = () => {
  const [, setCookies] = useCookies();
  const navigate = useNavigate();
  const [msg, setMsg] = useState<["good" | "bad", string]>([
    "good",
    "",
  ]);

  const loginRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    if (!form || !(form instanceof HTMLFormElement)) {
      return;
    }

    const data = Object.fromEntries(
      new FormData(form)
    ) as SessionResourceInput;

    fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((x) => x.json())
      .then((x: ResponseBody<SessionResource>) => {
        if (x.success) {
          setCookies("session_token", x.token, {
            expires: new Date(x.expires),
          });
          setCookies("user_id", x.user_id, {
            expires: new Date(x.expires),
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
      <form
        onSubmit={loginRequest}
        className="grid w-1/4 mx-auto gridForm gap-x-5 gap-y-2"
      >
        Username:
        <input name="display_name" />
        Password:
        <input name="password" />
        <button type="submit" className="col-span-2 bg-bg">
          Login
        </button>
      </form>
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
