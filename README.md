# Auto pano 

I have a DJI Phantom drone that I use to take panoramas. Turning all the individual images into one final panorama can be a time consuming process, so I'm writing a script to handle that for me.

## How it works

This requires the command line panotools, which are included in Hugin. It expects these to be on the PATH.

There's a lot of hard coding going on at the moment. It also assumes you're taking 3 rows of 8 photos, plus 2 directly down for the panorama, with bracked into 3 exposures.

## Work in progress

At the moment, all it does is combine the brackets to do  the HDR.

Slowly but surely I'll wrap the rest of panotools to stich the images together into the one panorama.

See `commands.sh` for what will be used