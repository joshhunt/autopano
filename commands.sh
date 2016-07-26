mkdir -p work

# Generate the project file. Note -f, the hFOV of 81.27 degrees
pto_gen *.jpg -o work/project.pto -f 81.27

# Align first row
pto_var --set=y0=0,p0=0 --output=work/aligned.pto work/project.pto
pto_var --set=y1=45,p1=0 --output=work/aligned.pto work/aligned.pto
pto_var --set=y2=90,p2=0 --output=work/aligned.pto work/aligned.pto
pto_var --set=y3=135,p3=0 --output=work/aligned.pto work/aligned.pto
pto_var --set=y4=180,p4=0 --output=work/aligned.pto work/aligned.pto
pto_var --set=y5=225,p5=0 --output=work/aligned.pto work/aligned.pto
pto_var --set=y6=270,p6=0 --output=work/aligned.pto work/aligned.pto
pto_var --set=y7=315,p7=0 --output=work/aligned.pto work/aligned.pto

# Align second row
pto_var --set=y8=0,p8=-30 --output=work/aligned.pto work/aligned.pto
pto_var --set=y9=45,p9=-30 --output=work/aligned.pto work/aligned.pto
pto_var --set=y10=90,p10=-30 --output=work/aligned.pto work/aligned.pto
pto_var --set=y11=135,p11=-30 --output=work/aligned.pto work/aligned.pto
pto_var --set=y12=180,p12=-30 --output=work/aligned.pto work/aligned.pto
pto_var --set=y13=225,p13=-30 --output=work/aligned.pto work/aligned.pto
pto_var --set=y14=270,p14=-30 --output=work/aligned.pto work/aligned.pto
pto_var --set=y15=315,p15=-30 --output=work/aligned.pto work/aligned.pto

# Align third row
pto_var --set=y16=0,p16=-60 --output=work/aligned.pto work/aligned.pto
pto_var --set=y17=45,p17=-60 --output=work/aligned.pto work/aligned.pto
pto_var --set=y18=90,p18=-60 --output=work/aligned.pto work/aligned.pto
pto_var --set=y19=135,p19=-60 --output=work/aligned.pto work/aligned.pto
pto_var --set=y20=180,p20=-60 --output=work/aligned.pto work/aligned.pto
pto_var --set=y21=225,p21=-60 --output=work/aligned.pto work/aligned.pto
pto_var --set=y22=270,p22=-60 --output=work/aligned.pto work/aligned.pto
pto_var --set=y23=315,p23=-60 --output=work/aligned.pto work/aligned.pto

# Align the two naidar images
pto_var --set=y24=0,p24=-90 --output=work/aligned.pto work/aligned.pto
pto_var --set=y25=90,p25=-90 --output=work/aligned.pto work/aligned.pto

# Find the control points between the images - what to align with
cpfind --prealigned --fullscale --output=work/cpPoints.pto work/aligned.pto

# # Remove junk control points from the sky
celeste_standalone -i work/cpPoints.pto -o work/cpPointsCleaned.pto -d ~/Dropbox/DRONE/data/celeste.model

# # Remove control points with large error distances
cpclean --output=work/cpPointsCleaned.pto work/cpPointsCleaned.pto

# # Optimise images for position, geometry and exposure
autooptimiser -a -l -s -m -o work/optimised.pto work/cpPointsCleaned.pto

# # ???
pano_modify -o work/final_cropped.pto --center --straighten --canvas=AUTO --crop=AUTO work/optimised.pto
# # pano_modify -o work/final_uncropped.pto --center --straighten --canvas=AUTO work/optimised.pto

# # Render individual images
nona -m TIFF_m -o work/cropped work/final_cropped.pto
# # nona -m TIFF_m -o work/uncropped work/final_uncropped.pto

# # render final
enblend -o work/cropped.tif work/cropped*.tif
# enblend -o work/uncropped.tif work/uncropped*.tif

