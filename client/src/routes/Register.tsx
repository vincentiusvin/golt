import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponseBody,
  SessionResource,
  UserResourceInput,
} from "../shared_interfaces";

const Register = () => {
  const navigate = useNavigate();

  const loginRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    if (!form || !(form instanceof HTMLFormElement)) {
      return;
    }

    const data = Object.fromEntries(
      new FormData(form)
    ) as UserResourceInput;

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((x) => x.json())
      .then((x: ResponseBody<SessionResource>) => {
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
        <form
          onSubmit={loginRequest}
          className="grid w-1/4 mx-auto gridForm gap-x-5 gap-y-2"
        >
          Username:
          <input name="display_name" />
          Password:
          <input name="password" />
          <button type="submit" className="col-span-2 bg-bg">
            Register
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
    </>
  );
};

export default Register;
