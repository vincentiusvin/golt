import { useCookies } from "react-cookie";
import {
  ISessionCollectionPostRequest,
  ISessionCollectionPostResponse,
} from "../shared_interfaces";

const Login = () => {
  const [, setCookies] = useCookies();

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
    })
      .then((x) => x.json())
      .then((x: ISessionCollectionPostResponse) => {
        setCookies("session_token", x.token);
        setCookies("user_id", x.user_id);
      });
  };

  return (
    <div className="flex-grow flex items-center">
      <form
        onSubmit={loginRequest}
        className="grid w-1/4 mx-auto gridForm gap-x-5 gap-y-2"
      >
        Username:
        <input name="display_name" />
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
