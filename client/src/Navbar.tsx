import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { IUserResourceGetResponse } from "./shared_interfaces";

const Navbar = () => {
  const [name, setName] = useState<string>("Guest");
  const [cookie] = useCookies();
  useEffect(() => {
    cookie["user_id"] &&
      fetch(`/api/users/${cookie["user_id"]}`, {
        method: "GET",
      })
        .then((x) => x.json())
        .then((x: IUserResourceGetResponse) =>
          setName(x.display_name)
        );
  }, [cookie]);
  return (
    <div className="grid grid-flow-col gap-10 items-center mx-5 my-2">
      <span className="font-bold text-2xl">Golt</span>
      <a className="text-white" href="/">
        Home
      </a>
      <a className="text-white" href="/login">
        Login
      </a>
      <a className="text-white" href="/register">
        Register
      </a>
      <span className="col-span-3 text-end">
        {name && "Hello, " + name}
      </span>
    </div>
  );
};

export default Navbar;
