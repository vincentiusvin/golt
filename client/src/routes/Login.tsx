import { useCookies } from "react-cookie";
import { Session } from "../shared_interfaces";

const Login = () => {
  const [, setCookies] = useCookies();

  const loginRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    if (!form || !(form instanceof HTMLFormElement)) {
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify(data),
    }).then((response) => {
      response.json().then((val: Session) =>
        setCookies("session_token", val.token, {
          expires: new Date(val.expires),
        })
      );
    });
  };

  return (
    <form
      onSubmit={loginRequest}
      className="grid w-1/2 mx-auto gridForm gap-x-5 gap-y-2"
    >
      Username:
      <input name="username" />
      Password:
      <input name="password" />
      <button type="submit" className="col-span-2">
        Submit
      </button>
    </form>
  );
};

export default Login;
