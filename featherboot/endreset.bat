@echo off
java -Xmx1G -Xms1G -jar paper-1.20.4.jar --nogui

::When running this script, stop the server immediately after starting to reset the files.
echo Hello. This script resets the main End island. Probably.
timeout /t 5 /nobreak
echo Written by Fjc

timeout /t 3 ::Directories left blank until local directory is available
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

::Invoke restart
cd ::someDirectory
start start.bat
exit

