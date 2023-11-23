import { Code } from "../model/Code";
import { User } from "../model/User";

async function make() {
  // await User.add_to_db("ucok", "123");
  const user = await User.get_by_name("ucok");
  console.log(user);

  // await user.add_code("modeltest");
  const code = await Code.get_by_user_id_and_name(user!.id, "modeltest");
  console.log(code);

  code!.post_code(`\
 #include <stdio.h>

 int main(){
  printf("hi");
 }
`);

  process.exit();
}

make();
