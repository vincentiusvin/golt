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
      body: JSON.stringify(data),
    }).then((response) => {
      response.json().then((val: Session) => {
        setCookies("session_token", val.token, {
          expires: new Date(val.expires),
        });
      });
    });
  };

  return (
    <div className="flex-grow flex items-center">
      <form
        onSubmit={loginRequest}
        className="grid w-1/4 mx-auto gridForm gap-x-5 gap-y-2"
      >
        Username:
        <input name="username" />
        Password:
        <input name="password" />
        <button type="submit" className="col-span-2 bg-bg">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
