#!/bin/sh
# Quick script to reset the region files for the End Island
# Note: I don't know if this is the right directory.


SERVERDIR=/home/minecraft/multicraft/servers
SURVIVAL=/home/minecraft/multicraft/servers/world
THEEND=/home/minecraft/multicraft/servers/world_the_end/DIM1

echo "Hello. This script resets the End Island. Probably. Hopefully this doesn't nuke the server."
echo "Written by Fjc"

echo "Removing End region files..."
rm $THEEND/r.0.0.mca $THEEND/r.0.1.mca $THEEND/r.1.0.mca $THEEND/r.0.-1.mca $THEEND/r.-1.0.mca $THEEND/r.-1.-1.mca $THEEND/r.1.-1.mca $THEEND/r.1.1.mca
echo "End reset complete! Please restart the server."

# This line invokes a restart after the script is complete.
echo 'true' > /home/minecraft/multicraft/servers/server649567/.reboot
