close all
clear all
clc

IMG = imread('starrynight.jpg');
[IMG_ind, map_old] = rgb2ind(IMG, 65536);

map = zeros(length(map_old(:,1)), 3);

for i = 1:length(map_old(:,1))
    map(i,:) = nearestColor(map_old(i,:));
end

IMG_down = ind2rgb(IMG_ind, map);
figure
imagesc(IMG);
figure
imagesc(IMG_down);

