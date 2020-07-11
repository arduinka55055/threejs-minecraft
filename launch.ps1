$arguments = "local"
& Start-Process -NoNewWindow "python" "Flastornado.py $arguments"
& Start-Process -NoNewWindow "python" "onlineserver.py $arguments"
Start-Sleep -s 5
explorer "http://127.0.0.1"
pause
