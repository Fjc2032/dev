#!/bin/sh
#End reset script
SERVERDIR=/home/minecraft/multicraft/servers
SURVIVAL=/home/minecraft/multicraft/servers/world
THEEND=/home/minecraft/multicraft/servers/world_the_end/DIM1

echo "Custom start script that wipes Main End Island. Hopefully the server doesn't get destroyed by this."
echo "Script made by Fjc"
echo "Starting removal process.."
rm $THEEND/r.0.0.mca $THEEND/r.0.1.mca $THEEND/r.1.0.mca $THEEND/r.0.-1.mca $THEEND/r.-1.0.mca $THEEND/r.-1.-1.mca $THEEND/r.1.-1.mca $THEEND/r.1.1.mca
echo "Reset complete. Stopping in 10 seconds."
echo "10"
sleep 1
echo "9"
sleep 1
echo "1"

#Stops the server. Set spigot.yml back to original start script.
command say Stopping server
echo "Stopping server"
command stop

#For Imperium Developers: This script can be used for other actions along with the removal of end island files. The directories are declared at the top of the second comment.
