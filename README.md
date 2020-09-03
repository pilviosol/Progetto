# ACTaM and CM-RM project
## REVERSE CHROMESTHESIA
Let's first define what **chromesthesia** is: chromesthesia (or sound-to-color synesthesia) is a type of synesthesia in which sound involuntarily evokes an experience of color, shape, and movement in someone's mind. For some people, everyday sounds such as doors opening, cars honking, or people talking can trigger seeing colors. For others, colors are triggered when musical notes or keys are being pulayed. Colors triggered by certain sounds, as well as other synesthetic visual experiences, are referred to as *photisms*.

With our project, we want to invert this concept: our application will extract music from images.

### MOTIVATIONS:
There are plenty motivations behind our project but the main one was defitevily a speech from bassist, composer and music educator Adam Neely in an episode of Ableton's series **New Horizons in Music** filmed live at Ableton Loop 2017. In such video Adam demonstrates that rhythm can be found everywhere as he investigates the connections between synesthesia, the Harmony of the Spheres, Isaac Newton, pitch, and polyrhythms (https://www.youtube.com/watch?v=JiNKlhspdKg&t=1629s).

![v_spectrum](/images/v_spectrum.png)

Obviously, our focus is in the connection between colors and sound: and the common ground between these two apparently independent fields is the **frequency domain**. We all know that the frequency of the "A" note is 440Hz. If we double this frequency, we still obtain an "A", one octave above the first one. Repeating this process, we'll continue to find "A" notes, with higher and higher frequencies until we pass the maximum audible frequency of the human hearing system. The last audible A will be at 14.080Hz since the max audible frequency is around 20.000Hz. Beyond this threshold, we talk about **ultrasounds**. But what if we continue doubling and doubling until we reach the frequency spectrum of visible light? Doing that we can create a connection between colors and sound, finding out that the frequency of orange light is an "A" note, hence we could say that "A" is orange! We can apply this concept to all notes, discovering a connection between colors and sound.

![color_of_sounds](/images/color_of_sounds.jpg)

As anyone that knows the basics of physics, we are well aware that sound and light exist in two completely different physical domains (pressure waves vs electromagnetic waves) and we obviously don't expect to see orange light by playing a (very) high pitched "A", nevertheless, we found this dualism extremely interesting for another reason. Isaac Newton, in his work *Opticks*, speculated that some color "look good" together for the same reason two musical notes "sound good" together: the ratio between their frequencies can be approximated by a "simple" ratio between two integer numbers. In an earlier draft for *Opticks*, orange and indigo, red and sky-blue, and yellow and violet, were considered harmonious pairs "for they are fifts", while adjacent colours were discordant, as being "but a note or tone above and below". It was in the speculative realms of an hypothesized aether and proportionate harmonies that Newton framed his analogy between colour and musical sound, **not in the field of science**, and this is remarked by the fact that in order to determine the boundaries between the hues on the spectrum, Newton asked "an Assistant, whose Eyes for distinguishing Colours were more critical than mine" to draw his own colour partitions.
![newtons_wheel](/images/newtons_wheel.jpg)

Despite the fact that the parallelism between sound and color lacks scientific rigor, we found this concept extremely fascinating and we applied it to create a unique tool: a web application that allows the user to upload an images and, based on its colors, automatically determines the **harmonicity of the image** by computing the "mode of the image" (lydian, ionian, mixolydian, dorian, aeolian, phrygian or locrian) and then literally allowing the user to **play the image**, or better, a quantized version of it. Every color will be assigned to a chord (triads or quadriads) automatically constructed depending on the mode of the image. 

In the study of the project, we found other great sources of information at:
* https://www.youtube.com/watch?v=FTKP0Y9MVus&list=LLvAwsBbM0nrN58-C77ytKgg&index=5&t=0s ,
* https://www.vice.com/en_uk/article/rjqwzg/youneedtohearthis-chromesthesia-feeling-music-in-colours ,
* http://linesandcolors.com/2008/05/12/history-of-the-color-wheel/.
* http://www.colourmusic.info/opticks1.htm

### GRAPHICAL USER INTERFACE
![inital2](/images/initial2.png)

As you can see from the picture, the GUI is minimal. The only thing that the user has to do in order to apply the reverse chromestesia is to upload an image from his/her device and let the tool do the job for him.

![fina2](/images/fina2.png)

After that, a quantized version of the image is shown on the page and the user can start to play it with his/her mouse by clicking on its colors. But there is more! Let's analyse from top to bottom the components of the gui:
* **Reverse Chromesthesia** text field: simply the title;
* **Select tonic**: drop-down menu that lets the user choose the tonic of the scale between the 12 notes of the chromatic scale;
* **the Color Wheel** represent the 12 notes. The wheel turns so thet the most prominent color is at the top, and the colors/notes are highlited when the corresponding chord is played. Inside the wheel there's the name of the chord that the user is currently playing and the degree of the chord with respect to the tonic is between brackets;
* **Resulting mode**: mode of the image;
* **Use quadriads**: toggles between the use of triads and quadriads;
* **Playable Image**: quantized image that can be played by clicking on its colors. If the user leaves the image with the mouse, the sound will smoothly stop.
* **Change image**: button that allows the upload of another image.

### HOW DOES IT WORK?
Here's the block diagram of the principle of operation of the app: 
![block_diagram](/images/block_diagram.png)
The first block is pretty self explaining: the application starts with the user uploading an image. The uploaded image is then **quantized**. What does it mean? An image can have more than 16 millions of colors, but we only have 12 notes. The application will apply to the image a custom-built palette that contains a limited quantity of colors, limiting the posible **hues** to 12 (which are the ones that are present in our Color Wheel, more info on the *hue circle* on the links above). Then the application will perform the **color to sound mapping** in three phases:
1. Computation of the mode: the uploaded image will have some of the 12 colors that are present in th Color Wheel, if not all of them. Depending on the quantity of each color/note, our algorithm finds the most present note intervals in the image, hence determining the mode that represents the image in the best way. It is important to notice that the resulting mode is meaningful only if the image contains multiple colors, and that we abandoned the one-to-one mapping of notes to colors based on frequency we talked about before. What is important in this app is not what the most present is, but the relationship between the most present color (which represent the tonic, *whatever it is*) and the other colors.
2. Computation of chord intervals: once the mode of the image is established, every time a color is clicked a function computes the intervals of the corresponding chords (2 intervals if triad modality, 3 otherwise) and outputs the sound, built with the following routing using the Web Audio API:
![routing](/images/routing.png)
3. Construction of triads and quadriads: depending on the mode and on the root note that is played, the names of the triads and quadriads are picked by a "dictionary" and shown in the center of the wheel.
Everything is ready, the image can be played doing fancy chord progressions.

### VIDEO PRESENTATION (YOUTUBE)
https://youtu.be/avKKM5vgr0M

### WORKING VERSION OF THE APPLICATION (HOSTED BY GITHUB PAGES)
http://pilviosol.github.io
