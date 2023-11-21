import { User } from "./model/User";

const user = new User("abcd");
const code = user.code_list[0];
code.post_code(`
#include <stdio.h>

int main(){
    printf("Hi");
}
`);
