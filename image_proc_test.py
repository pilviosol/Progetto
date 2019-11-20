import numpy as np
#import skimage
import PIL
from PIL import Image

rgbCircle = [[255, 255, 0],[255, 132, 0],[255, 0, 0],[247, 0, 64],[239, 2, 126],[131, 1, 126],[19, 0, 123], [10, 82, 165],[0, 159, 197],[0, 147, 126],[0, 140, 57], [130, 198, 28], [255,255,255]]
rgbCircle_palette = [255, 255, 0 ,255, 132, 0 ,255, 0, 0, 247, 0, 64 ,239, 2, 126 ,131, 1, 126 ,19, 0, 123, 10, 82, 165 ,0, 159, 197 ,0, 147, 126 ,0, 140, 57, 130, 198, 28]
newColors = [[0 for x in range(3)] for y in range(12)]

# CREATE NEW PALETTE WITH A FUNCTION

im = Image.open('prova.jpg')
camera = im.quantize(colors=12,method=1)
palette=camera.getpalette()[:36]

def nearest_color (color):
    color = np.array(color)
    new_colors=np.array(rgbCircle)
    new_color=np.array([0,0,0])
    for i in range(12):
        if np.linalg.norm(color-new_colors[i])<np.linalg.norm(color-new_color):
            new_color=new_colors[i]
    return new_color

new_palette = [0 for x in range(36)]

for i in range(12):
    new_palette[i*3] = nearest_color([palette[i*3], palette[(i*3)+1], palette[(i*3)+2]])[0]
    new_palette[(i*3)+1] = nearest_color([palette[i*3], palette[(i*3)+1], palette[(i*3)+2]])[1]
    new_palette[(i*3)+2] = nearest_color([palette[i*3], palette[(i*3)+1], palette[(i*3)+2]])[2]

# QUANTIZATION TO A GIVEN COLOR PALETTE

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
palettedata[:36] = rgbCircle_palette
palimage = Image.new('P', (36, 36))
palimage.putpalette(palettedata)
oldimage = Image.open("prova.jpg")
oldimage.show()
quantized = oldimage.quantize(colors=12,method=1)
quantized= quantized.convert(mode="RGB")
#newimage = oldimage.quantize(colors=12,method=1,palette=palimage) # Quantize to a given palette with dithering
newimage = quantizetopalette(quantized,palimage,dither=False)
newimage.show()

#----------------------------------------------------------

vectorimage = np.asarray(newimage)

mask0 = vectorimage < 50
print(mask0)

mask1 = vectorimage==(palette[0],palette[1],palette[2])
mask2 = vectorimage==(palette[3],palette[4],palette[5])
mask3 = vectorimage==(palette[6],palette[7],palette[8])
mask4 = vectorimage==(palette[9],palette[10],palette[11])
mask5 = vectorimage==(palette[12],palette[13],palette[14])
mask6 = vectorimage==(palette[15],palette[16],palette[17])
mask7 = vectorimage==(palette[18],palette[19],palette[20])
mask8 = vectorimage==(palette[21],palette[22],palette[23])
mask9 = vectorimage==(palette[24],palette[25],palette[26])
mask10 = vectorimage==(palette[27],palette[28],palette[29])
mask11 = vectorimage==(palette[30],palette[31],palette[32])
mask12 = vectorimage==(palette[33],palette[34],palette[35])

print(mask1)

masks=[mask1,mask2,mask3,mask4,mask5,mask6,mask7,mask8,mask9,mask10,mask11,mask12]

old_colors = [[0 for x in range(3)] for y in range(12)]
for i in range(12):
    old_colors[i] = [palette[i*3], palette[(i*3)+1], palette[(i*3)+2]]

for i in range(12):
    vectorimage[masks[i]] = nearest_color(old_colors[i])

masked_image = Image.fromarray(vectorimage)
masked_image.show()