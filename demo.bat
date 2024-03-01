chcp 65001
set HTTPS_PROXY=http://192.168.100.253:8080/
set HTTP_PROXY=http://192.168.100.253:8080/
set Path=C:\PHP82_64;%Path%
C:\PHP82_64\php.exe -S localhost:8890 -t C:\git\cardscan\docs
