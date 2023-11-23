import { User } from "../model/User";

(async () => {
  console.log(await User.get_by_id(1));
  process.exit();
})();
