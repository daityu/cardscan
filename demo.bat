chcp 65001
set HTTPS_PROXY=http://192.168.100.253:8080/
set HTTP_PROXY=http://192.168.100.253:8080/
set Path=C:\PHP82_64;%Path%
C:\PHP82_64\php.exe -S localhost:8890 -t C:\git\card_photo\public
rem C:\PHP74_64\php.exe -S 192.168.10.105:8889 -t C:\git\kaifcloud_dev\public
