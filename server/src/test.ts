import { UserManager } from "./model/User";

const user = new UserManager().login("abc", "123");
const code = user.code_list[0];
code.post_code(`
#include <stdio.h>

int main(){
    printf("Hi");
}
`);
