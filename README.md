# Progetto ACTaM e CM-RM
## GENERAZIONE DI UNA CHORD PROGRESSION E DI UN POLIRITMO A PARTIRE DA UN IMMAGINE

TONALITÀ: può essere arbitraria

MODO: determinato dalle percentuali di colori. PROBLEMA: non è detto che ci siano abbastanza colori da poter determinare un modo in maniera univoca, quindi direi di usare il colore più presente come parametro di riserva per determinare il modo in caso non sia possibile.
Possibile implementazione iterativa:
Ogni colore corrisponde a una nota e il più presente rappresenta la tonica. Da i=2: si controlla la distanza in semitoni tra l'i-esimo colore (nota) più presente e l'(i-1)-esimo colore più presente. Si tengono tutte le scale che contengono quella nota e si scartano le altre, se ne rimane più di una possibile si passa all'(i+1)-esimo colore più presente.
Esempio: se il secondo colore più presente sta a un semitono dal primo, gli unici due modi possibili sono frigio e locrio perchè sono gli unici il cui primo intervallo è di un semitono.

CHORD PROGRESSION: determinata dal colore più presente. Se i colori che rappresentano intervalli di 2a, 4a e 6a sono abbastanza presenti (superano una certa percentuale) possiamo aggiungere etensioni agli accordi. 

POLIRITMO: determinato dalle percentuali dei colori, dobbiamo decidere un set di poliritmi che non siano eccessivamente complessi. 
