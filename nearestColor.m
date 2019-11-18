function newColors = nearestColor(oldColors)
    
    colors_freq = [ 82,   0,   0;
           116,   0,   0;
           179,   0,   0;
           238,   0,   0;
           255,  99,   0;
           153, 255,   0;
            40, 255,   0;
             0, 255, 232;
             0, 124, 255;
             5,   0, 255;
            69,   0, 234;
            87,   0, 158;
            85,   0,  79;]; 
     
        colors_rgb = [255, 255, 0;
                    255, 132, 0;
                    255, 0, 0;
                    247, 0, 64;
                    239, 2, 126;
                    131, 1, 126;
                    19, 0, 123; 
                    10, 82, 165;
                    0, 159, 197;
                    0, 147, 126;
                    0, 140, 57; 
                    130, 198, 28];
    
    colors = colors_rgb./255;
    
    newColors = [1, 1, 1];
    
    if oldColors(1)==oldColors(2) && oldColors(1)==oldColors(3)
        if oldColors(1)<0.5
            newColors = [0, 0, 0];
        end
        
        return
    end
    
    for i=1:12
        if norm(oldColors - colors(i,:)) < norm(oldColors - newColors)
            newColors = colors(i,:);
        end
    end
    
end