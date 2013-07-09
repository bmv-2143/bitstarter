#!/bin/bash
echo -e "\nTEST 1.1\n"
./grader.js -c checks-test-1.json -f test1.html 

echo -e "\nTEST 1.2\n"
./grader.js -c checks-test-1.json -f test2.html 

echo -e "\nTEST 2.1\n"
./grader.js -c checks-test-2.json -f test1.html 

echo -e "\nTEST 2.2\n"
./grader.js -c checks-test-2.json -f test2.html 
