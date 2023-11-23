import { User } from "../model/User";

async function make() {
  // await User.add_to_db("ucok", "123");
  const user = await User.get_by_name("ucok");
  console.log(user);

  // await user.add_code("test");
  const codes = await user.get_codes();
  console.log(codes);

  const code = codes[0];
  code.post_code(`\
 #include <stdio.h>

 int main(){
  printf("hi");
 }
`);

  process.exit();
}

make();
