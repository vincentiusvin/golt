import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { User } from "./shared_interfaces";

const Navbar = () => {
  const [name, setName] = useState<string | null>(null);
  const [cookie] = useCookies();
  useEffect(() => {
    fetch("/api/user", {
      method: "GET",
    })
      .then((response) =>
        response
          .json()
          .then((val: User) => {
            setName(val.username);
          })
          .catch(() => undefined)
      )
      .catch(() => undefined);
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
