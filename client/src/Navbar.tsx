import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ResponseBody, UserResource } from "./shared_interfaces";

const Navbar = () => {
  const [name, setName] = useState<string>("Guest");
  const [cookie] = useCookies();
  useEffect(() => {
    cookie["user_id"] &&
      fetch(`/api/users/${cookie["user_id"]}`, {
        method: "GET",
      })
        .then((x) => x.json())
        .then(
          (x: ResponseBody<UserResource>) =>
            x.success && setName(x.display_name)
        );
  }, [cookie]);
  return (
    <div className="grid grid-flow-col gap-10 items-center mx-5 my-2">
      <div className="grid grid-flow-col gap-10 items-start">
        <div className="font-bold text-2xl">Golt</div>
        <a className="text-white" href="/">
          Home
        </a>
        {!cookie["user_id"] && (
          <>
            <a className="text-white" href="/login">
              Login
            </a>
            <a className="text-white" href="/register">
              Register
            </a>
          </>
        )}
      </div>
      <div className="grid grid-flow-col gap-10 items-center">
        <div className="col-span-3 text-end">
          {name && "Hello, " + name}
        </div>
        <button>Log Out</button>
      </div>
    </div>
  );
};

export default Navbar;
