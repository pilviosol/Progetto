import numpy as np
#import skimage
#from skimage import io
import PIL
from PIL import Image, ImageEnhance 

# Color sets:
rgbCircle = [[255, 255, 0],[255, 132, 0],[255, 0, 0],[247, 0, 64],[239, 2, 126],[131, 1, 126],[19, 0, 123], [10, 82, 165],[0, 159, 197],[0, 147, 126],[0, 140, 57], [130, 198, 28], [255,255,255]]
rgbCircle_palette = [255, 255, 0 ,255, 132, 0 ,255, 0, 0, 247, 0, 64 ,239, 2, 126 ,131, 1, 126 ,19, 0, 123, 10, 82, 165 ,0, 159, 197 ,0, 147, 126 ,0, 140, 57, 130, 198, 28]

newColors = rgbCircle

# CREATE NEW PALETTE WITH A FUNCTION: (DOESN'T WORK WELL))
# Maps the old color palette into a new given

#im = Image.open('prova.jpg')
#quantized_prova = im.quantize(colors=12,method=1)
#palette=quantized_prova.getpalette()[:36]
#
#def nearest_color (color):
#    color = np.array(color)
#    new_colors=np.array(rgbCircle)
#    new_color=np.array([0,0,0])
#    for i in range(12):
#        if np.linalg.norm(color-new_colors[i])<np.linalg.norm(color-new_color):
#            new_color=new_colors[i]
#    return np.ndarray.tolist(new_color)
#
#new_palette = [0 for x in range(36)]
#
#for i in range(12):
#    new_palette[i*3] = nearest_color([palette[i*3], palette[(i*3)+1], palette[(i*3)+2]])[0]
#    new_palette[(i*3)+1] = nearest_color([palette[i*3], palette[(i*3)+1], palette[(i*3)+2]])[1]
#    new_palette[(i*3)+2] = nearest_color([palette[i*3], palette[(i*3)+1], palette[(i*3)+2]])[2]

#--------------------------------------
# QUANTIZATION TO A GIVEN COLOR PALETTE
#--------------------------------------

# Kmeans quantization: this function needs skimage and io from skimage
#def quantizeKmeans(original): 
#    arr = original.reshape((-1, 3))
#    kmeans = KMeans(n_clusters=n_colors, random_state=42).fit(arr)
#    labels = kmeans.labels_
#    centers = kmeans.cluster_centers_
#    less_colors = centers[labels].reshape(original.shape).astype('uint8')
#    return less_colors

def quantizetopalette(silf, palette, dither=False):
    """Convert an RGB or L mode image to use a given P image's palette."""

    silf.load()

    # use palette from reference image
    palette.load()
    if palette.mode != "P":
        raise ValueError("bad mode for palette image")
    if silf.mode != "RGB" and silf.mode != "L":
        raise ValueError(
            "only RGB or L mode images can be quantized to a palette"
            )
    im = silf.im.convert("P", 1 if dither else 0, palette.im)
    # the 0 above means turn OFF dithering

    # Later versions of Pillow (4.x) rename _makeself to _new
    try:
        return silf._new(im)
    except AttributeError:
        return silf._makeself(im)

palettedata = [0 for x in range(256)]
palettedata[:36] = rgbCircle_palette # Insert desired color palette
palimage = Image.new('P', (36, 36))
palimage.putpalette(palettedata)
oldimage = Image.open("flowers.jpg")
oldimage = oldimage.copy()
oldimage.show()

#colorEnhancer = ImageEnhance.Color(oldimage) # Increase saturation by 10%, MAYBE it brings out "weak" colors
#oldimage = colorEnhancer.enhance(1.1)

oldimage = oldimage.quantize(colors=12,method=1) # Probably not necessary
oldimage = oldimage.convert(mode="RGB")
#newimage = oldimage.quantize(colors=12,method=0, palette=palimage) # Quantize to a given palette WITH DITHERING
newimage = quantizetopalette(oldimage,palimage,dither=False)
newimage = newimage.convert(mode="RGB")
newimage.show() 

#----------------------------
# CALCULATE COLOR PERCENTAGES 
#----------------------------

vectorimage = np.asarray(newimage)
vectorimage = vectorimage.copy() # Avoid unwritability

mask1  = vectorimage==(newColors[1])
mask2  = vectorimage==(newColors[2])
mask3  = vectorimage==(newColors[3])
mask4  = vectorimage==(newColors[4])
mask5  = vectorimage==(newColors[5])
mask6  = vectorimage==(newColors[6])
mask7  = vectorimage==(newColors[7])
mask8  = vectorimage==(newColors[8])
mask9  = vectorimage==(newColors[9])
mask10 = vectorimage==(newColors[10])
mask11 = vectorimage==(newColors[11])
mask12 = vectorimage==(newColors[12])

masks=[mask1,mask2,mask3,mask4,mask5,mask6,mask7,mask8,mask9,mask10,mask11,mask12]
masks = np.array(masks)

totalColorAmount = np.sum(masks) # Total number of colored pixels 

color_percentages = [0 for x in range(12)]

for i in range(12):
    color_percentages[i] = (np.sum(masks[i])/totalColorAmount)*100

print(color_percentages)

# MODES:
ionian = [0,2,4,5,7,9,11]
dorian = [0,2,3,5,7,9,10]
phrygian = [0,1,3,5,7,8,10]
lydian = [0,2,4,6,7,9,11]
mixolydian = [0,2,4,5,7,9,10]
eolian = [0,2,3,5,7,8,10]
locrian = [0,1,3,5,6,8,10]

order_check = color_percentages
color_podium = [0 for i in range(12)]

for i in range(12):
    max_index = np.argmax(order_check, axis=0)
    order_check[max_index] = -1
    color_podium[max_index] = i

print(color_podium)