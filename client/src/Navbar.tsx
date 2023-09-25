const Navbar = () => {
  return (
    <div className="flex gap-10 items-center mx-5 my-2">
      <span className="font-bold text-2xl">Golt</span>
      <a className="text-white" href="/">Home</a>
      <a className="text-white" href="/login">Login</a>
      <a className="text-white" href="/register">Register</a>
    </div>
  );
};

export default Navbar;
