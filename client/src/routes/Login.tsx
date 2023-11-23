import { useCookies } from "react-cookie";
import {
  ISessionCollectionPostRequest,
  ISessionCollectionPostResponse,
} from "../shared_interfaces";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    ) as ISessionCollectionPostRequest;

    fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((x) =>
      x.status == 200
        ? x.json().then((x: ISessionCollectionPostResponse) => {
            setCookies("session_token", x.token);
            setCookies("user_id", x.user_id);
            setMsg([
              "good",
              "Login sucessfull! Redirecting to home in 3 seconds...",
            ]);
            setTimeout(() => navigate("/"), 3 * 1000);
          })
        : x.text().then((x) => setMsg(["bad", x]))
    );
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
