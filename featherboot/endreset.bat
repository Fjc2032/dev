@echo off
java -Xmx1G -Xms1G -jar paper-1.20.4.jar --nogui
@rem Low mem cap used since you will be stopping the server immediately after anyways...
::When running this script, stop the server immediately after starting to reset the files.
::The following commands will run after the server is stopped.
echo Hello. This script resets the main End island. Probably.
timeout /t 5 /nobreak
echo Written by Fjc

timeout /t 3
@rem Root directories left blank until local directory is available for use (i don't know the file path yet)
del C:\\\\\world_the_end\DIM1\region\r.0.0.mca
del C:\\\\\world_the_end\DIM1\region\r.0.1.mca
del C:\\\\\world_the_end\DIM1\region\r.1.0.mca
del C:\\\\\world_the_end\DIM1\region\r.0.-1.mca
del C:\\\\\world_the_end\DIM1\region\r.-1.0.mca
del C:\\\\\world_the_end\DIM1\region\r.-1.-1.mca
del C:\\\\\world_the_end\DIM1\region\r.1.-1.mca
del C:\\\\\world_the_end\DIM1\region\r.1.1.mca
echo Reset complete. Server restarting...
timeout /t 5 /nobreak

::Invoke restart with main script; uses higher memory cap
cd C:\\\\someDirectory\server
start start.bat
exit

