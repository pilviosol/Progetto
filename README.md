# Progetto ACTaM e CM-RM
## SONIFICAZIONE DI IMMAGINI
L'immagine caricata viene "suonata" passando il mouse sopra i vari colori. Tonalità e modo sono determinati come spiegato più in basso. Ogni colore dell'immagine suona un accordo con una root note diversa. La tonalità può essere arbitraria. Il modo è determinato dalle percentuali di colori. Il colore più presente rappresenta la tonica, gli altri colori rappresentano altre note che avranno una distanza in semitoni dalla tonica determinata dalla ruota dei colori (Hue circle di 12 colori). Dopo aver ottenuto un'immagine in cui le hues sono quantizzate (limitate alle 12 disponibili nella ruota) si ottiene un istogramma delle hues sulla base del quale il modo della scala viene determinato. Il modo scelto è quello che massimizza un punteggio determinato dalle note (colori) in comune con quelli dell'immagine caricata, pesati in base a quanto sono presenti nell'immagine.

PROBLEMA: decidere che tipo di accordi sono suonati da colori la cui nota corrispondente non fa parte del modo scelto.

## TO DO:
- creare visualizzatore del modo scelto
- creare visualizzatore dell'accordo suonato
- visualizzare istogramma delle hues (?)
- evidenziare i colori della ruota mentre vengono suonati
- migliorare envelope e sound design
- inserire controlli utente per cambiare suoni (?)
- inserire controlli utente per complessità accordi (?)
- risolvere problema note non presenti nel modo scelto