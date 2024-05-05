@echo off
:: Potential start script for local hosting
:: Imperium developers do not run this on a Linux build it will NOT work
:: Adjust memory as needed
java -Xmx40G -Xms32G -XX:+AlwaysPreTouch -XX:+ParallelRefProcEnabled -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1HeapRegionSize=8M -XX:G1HeapWastePercent=5 -jar paper-1.20.4.jar --nogui

@rem Restart
echo Restart in 5 4 3 2 1 boom
goto :start
