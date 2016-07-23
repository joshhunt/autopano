mkdir work

# Generate the project file. Note -f, the hFOV of 81.27 degrees
pto_gen *.JPG -o work/project.pto -f 81.27

# Find the control points between the images - what to align with
cpfind --fullscale --multirow -o work/cpPoints.pto work/project.pto

# Remove junk control points from the sky
celeste_standalone -i work/cpPoints.pto -o work/cpPointsCleaned.pto -d ~/Dropbox/DRONE/data/celeste.model

# Remove control points with large error distances
ptoclean -v --output work/cpPointsCleaned.pto work/cpPointsCleaned.pto

# Optimise images for position, geometry and exposure
autooptimiser -a -l -s -m -o work/optimised.pto work/cpPointsCleaned.pto

# ???
pano_modify -o work/final_cropped.pto --center --straighten --canvas=AUTO --crop=AUTO work/optimised.pto
# pano_modify -o work/final_uncropped.pto --center --straighten --canvas=AUTO work/optimised.pto

# Render individual images
nona -m TIFF_m -o work/cropped work/final_cropped.pto
# nona -m TIFF_m -o work/uncropped work/final_uncropped.pto

# render final
enblend -o work/cropped.tif work/cropped*.tif
# enblend -o work/uncropped.tif work/uncropped*.tif

