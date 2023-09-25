#!
#curl -X POST localhost:3000/api/compile \
#-H 'Content-Type: application/json' \
#-d '{"code":"#include <stdio.h>\n int main(){printf(\"hi\");}"}'

curl -X POST localhost:3000/session \
-H 'Content-Type: application/json' \
-d '{"username":"udin", "password":"1234"}'
