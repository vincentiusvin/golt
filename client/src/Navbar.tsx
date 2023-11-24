import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { deleteSession, getUser } from "./model";
import { SessionResource } from "./shared_interfaces";

const Navbar = () => {
  const [name, setName] = useState<string>("Guest");
  const [cookies, , removeCookie] = useCookies();
  const session: SessionResource | null = cookies["session"];

  useEffect(() => {
    session &&
      getUser(session.user_id).then((x) => {
        if (x.success) {
          setName(x.display_name);
        } else {
          removeCookie("session");
        }
      });
  }, [removeCookie, session]);

  return (
    <div className="grid grid-flow-col gap-10 items-center mx-5 my-2">
      <div className="grid grid-flow-col gap-10 items-start">
        <div className="font-bold text-2xl">Golt</div>
        <a className="text-white" href="/">
          Home
        </a>
        {!session && (
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
        {session && (
          <button
            onClick={() => {
              deleteSession().then((x) => {
                if (x.success === true) {
                  removeCookie("session");
                }
              });
            }}
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
