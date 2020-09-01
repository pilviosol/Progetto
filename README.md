# ACTaM and CM-RM project
## REVERSE CHROMESTESIA
Let's first define what is a "chromestesia": a Chromesthesia (or sound-to-color synesthesia) is a type of synesthesia in which sound involuntarily evokes an experience of color, shape, and movement. For some, everyday sounds such as doors opening, cars honking, or people talking can trigger seeing colors. For others, colors are triggered when musical notes or keys are being pulayed. The colors triggered by certain sounds, and any other synesthetic visual experiences, are referred to as *photisms*.

With our project, we want to invert this concept: our application will extract music from images' colors.

### MOTIVATIONS:
There are plenty motivations behind our project but the main one was defitevily a speech from bassist, composer and music educator Adam Neely in an episode of Ableton's series **New Horizons in Music** filmed live at Ableton Loop 2017 in which he demonstrates that literally everything is rhythm as he investigates the connections between synesthesia, the Harmony of the Spheres, Isaac Newton, pitch and polyrhythms (https://www.youtube.com/watch?v=JiNKlhspdKg&t=1629s).
![v_spectrum](/images/v_spectrum.png)
Obviously, our focus is in the connection between colors and sound: and the common ground between these two apparently independent fields is the **frequency domain**. We all know that the frequency of the A note is 440Hz. But if we double this frequency, we still obtain an A note, one octave above the first one. Repeating this process, we'll continue to find A notes, with higher and higher frequencies until we pass the max audible frequency of the human hearing system. The last audible A will be at 14.080Hz since the max audible frequency is around 20.000Hz. Beyond this threshold, we'll talk about **ultrasounds**. But what if we continue doubling and doubling until we reach the spectrum of visible light? Doing that we can create a connection between colors and sound, finding out that the color of A is orange. A is orange. We can apply this concept to all notes, discovering the connection between colors and sound.
![color_of_sounds](/images/color_of_sounds.jpg)
We applied this concept to create a unique tool: a web application that permits the user to upload images and, based on the colors of them, determines automatically the harmonicity primarily computing the "mode of the image" (lydian, ionian, mixolydian, dorian, aeolian, phrygian or locrian) and then literally allowing to **play the image**, or better, a quantized version of it. Every color will be assigned to a chord (triads or quadriads) automatically constructed depending on the mode of the image.

In the study of the project, we found other great sources of information at:
* https://www.youtube.com/watch?v=FTKP0Y9MVus&list=LLvAwsBbM0nrN58-C77ytKgg&index=5&t=0s ,
* https://www.vice.com/en_uk/article/rjqwzg/youneedtohearthis-chromesthesia-feeling-music-in-colours ,
* http://linesandcolors.com/2008/05/12/history-of-the-color-wheel/.

### GRAPHICAL USER INTERFACE
![inital](/images/initial.png)
As you can see from the picture, the GUI is minimal. The only thing that the user has to do in order to apply the reverse chromestesia is to upload an image from his/her device and let the tool do the job for him.
![fina](/images/fina.png)
After that, a quantized version of the image is shown on the page and the user can start to play it with his/her mouse by clicking on its colors. But there is more! Let's analyse from top to bottom the components of the gui:
* **reverse chromestesia** text field: simply the title;
* **select tonic**: drop down menu that let the user change tonic of the scale you want to play between the 12 diatonic notes
* **color wheel**: represent the 12 notes, rounds depending on the most prominent color. Inside it there's the name of the chord that the user is actually playing on the image. Between brackets there's the grade of the chord with respect to the tonic;
* **resulting mode**: mode of the image;
* **use quadriads**: switch between triads and quadriads modality;
* **playable image**: quantized image that can be played by clicking on its different colors. If the user goes outside the image with the mouse, the sound will smoothly stop.
* **change image**: button that let the uploading of another image to be played

### HOW DOES IT WORKS?
Here's the block diagram of the principle of operation of the application: IMMAGINE DEL BLOCK DIAGRAM
The first block is pretty self explaining: the application starts with the user uploading an image. The uploaded image is the **quantized**. What does it mean? A jpg image can have more than 16 millions of colors. But we have only 12 notes. So for every pixel the application will compute the *nearest color* between the 12 present into the color wheel palette and, by doing so, transforms the image in a 12-color playable version of itself. Then the application will perform the **color to sound mapping** in three phases:
1. computation of the mode: the uploaded image will have some of the 12 palette colors that represent the 12 notes and other not. Depending also on the quantity of colors present in the image, a scoring system is then cycled for every mode picking up the most similar;
2. computation of intervals: once established the mode of the image, a function computes the intervals (2 intervals if triad modality, 3 otherwise) and triggers the oscillators starting the following routin IMMAGINE DEL ROUTING;
3. construction of triads and quadriads: depending on the mode and on the root note that is played, the names of the triads and quadriads are shown in the center of the root note.
Everything is ready, the image can be played doing fancy chord progressions.

### FUTURE DEVELOPMENTS

### YOUTUBE LINK
