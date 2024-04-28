#Original start script
java -jar paper-1.20.4.jar nogui
sleep 1
echo 'true' > /home/minecraft/multicraft/servers/server649567/.reboot

sleep 45
#End reset script
SERVERDIR=/home/minecraft/multicraft/servers
SURVIVAL=/home/minecraft/multicraft/servers/world
THEEND=/home/minecraft/multicraft/servers/world_the_end/DIM1

echo "Custom start script that wipes Main End Island. Hopefully the server doesn't get destroyed by this."
echo "Script made by Fjc"
sleep 5
echo "Starting removal process.."
rm $THEEND/r.0.0.mca $THEEND/r.0.1.mca $THEEND/r.1.0.mca $THEEND/r.0.-1.mca $THEEND/r.-1.0.mca $THEEND/r.-1.-1.mca $THEEND/r.1.-1.mca $THEEND/r.1.1.mca
echo "Reset complete. Stopping in 10 seconds."

sleep 10
#Stops the server. Set spigot.yml back to original start script.
command say Stopping server
command stop
