

import numpy as np
from skimage import data
import matplotlib.pyplot as plt
import skimage
import PIL
from PIL import Image

#import os
#filename = os.path.join('prova.jpg')
from skimage import io
camera = io.imread('prova.jpg')
print(camera.size)
print(camera.shape)

shape = camera.shape

def nearest_color (color):
    color = np.array(color)
    new_colors=np.array([[255, 255, 0],[255, 132, 0],[255, 0, 0],[247, 0, 64],[239, 2, 126],[131, 1, 126],[19, 0, 123], [10, 82, 165],[0, 159, 197],[0, 147, 126],[0, 140, 57], [130, 198, 28]])
    new_color=np.array([0,0,0])
    for i in range(12):
        if np.linalg.norm(color-new_colors[i])<np.linalg.norm(color-new_color):
            new_color=new_colors[i]
    return new_color
        

im = Image.open('prova.jpg')
camera = im.quantize(colors=12,method=1)
palette=camera.getpalette()[:36]
old_colors = [[0 for x in range(3)] for y in range(12)]
for i in range(12):
    old_colors[i] = [palette[i*3], palette[(i*3)+1], palette[(i*3)+2]]

print(old_colors)
print(palette)

v=[palette[0],palette[1],palette[2]]
print(nearest_color(v))

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
palettedata[:36] = [255, 255, 0 ,255, 132, 0 ,255, 0, 0, 247, 0, 64 ,239, 2, 126 ,131, 1, 126 ,19, 0, 123, 10, 82, 165 ,0, 159, 197 ,0, 147, 126 ,0, 140, 57, 130, 198, 28]
palimage = Image.new('P', (36, 36))
palimage.putpalette(palettedata)
oldimage = Image.open("prova.jpg")
oldimage.show()
quantized = oldimage.quantize(colors=12,method=1)
quantized= quantized.convert(mode="RGB")
#newimage = oldimage.quantize(colors=12,method=1,palette=palimage)
newimage = quantizetopalette(quantized,palimage,dither=True)

newimage.show()


mask1 = camera==(palette[0],palette[1],palette[2])
mask2 = camera==(palette[3],palette[4],palette[5])
mask3 = camera==(palette[6],palette[7],palette[8])
mask4 = camera==(palette[9],palette[10],palette[11])
mask5 = camera==(palette[12],palette[13],palette[14])
mask6 = camera==(palette[15],palette[16],palette[17])
mask7 = camera==(palette[18],palette[19],palette[20])
mask8 = camera==(palette[21],palette[22],palette[23])
mask9 = camera==(palette[24],palette[25],palette[26])
mask10 = camera==(palette[27],palette[28],palette[29])
mask11 = camera==(palette[30],palette[31],palette[32])
mask12 = camera==(palette[33],palette[34],palette[35])

print(mask1)

masks=[mask1,mask2,mask3,mask4,mask5,mask6,mask7,mask8,mask9,mask10,mask11,mask12]

for i in range(12):
    camera[masks[i]] = nearest_color(old_colors[i])



#print(palette)

plt.figure(figsize=(4, 4))
plt.imshow(camera, cmap='gray')
plt.axis('off')
plt.show()
# for i in range(shape[0]):
#     for j in range(shape[1]):
#         camera[i,j]=nearest_color(camera[i,j])  
#         print("fuck",i,j)          

 





#camera = prova()
# camera[:10] = 0
# mask = camera < 50
# camera[mask] = 255
# inds_x = np.arange(len(camera))
# inds_y = (4 * inds_x) % len(camera)
#camera[inds_x, inds_y] = 0

# l_x, l_y = camera.shape[0], camera.shape[1]
# X, Y = np.ogrid[:l_x, :l_y]
# outer_disk_mask = (X - l_x / 2)**2 + (Y - l_y / 2)**2 > (l_x / 2)**2
# camera[outer_disk_mask] = 150,10,200

# plt.figure(figsize=(4, 4))
# plt.imshow(camera, cmap='gray')
# plt.axis('off')
# plt.show()

#---------------------------------------

