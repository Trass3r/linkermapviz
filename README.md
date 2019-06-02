linkermapviz
============

Interactive tree map visualization of ld.bfd linker maps generated via `-Wl,-Map,output.map`.
```sh
g++ -c -ffunction-sections -fdata-sections main.cpp
gcc -Wl,-Map,output.map -o output main.o
```
