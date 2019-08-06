//Classe Arme
var Arme = {
	initArme: function(nom, degat, img, valeur) {
		this.nom = nom;
		this.degat = degat;
		this.img = new Image();
		this.img.src = img;
		this.img.alt = nom;
		this.img.title = nom + " : "+ degat + " points d'attaque"; 
		this.valeur = valeur;
	}
};

//Initialisation de chaque arme avec ses paramètres
var dague = Object.create(Arme);
dague.initArme("Dague", 10, "images/dagger.png", 10);
var lance = Object.create(Arme);
lance.initArme("Lance", 12, "images/spear.png", 11);
var epee = Object.create(Arme);
epee.initArme("Epée", 15, "images/sword.png", 12);
var hache = Object.create(Arme);
hache.initArme("Hache", 20, "images/axe.png", 13);
var marteau = Object.create(Arme);
marteau.initArme("Marteau", 25, "images/hammer.png", 14);

//Création d'un tableau qui stocke pour simplifier la réutilisation 
var tabArmes = [lance, epee, hache, marteau];

//Bouclier initié individuellement
var nomBouclier = "Bouclier";
var imgBouclier = new Image();
imgBouclier.src = "images/shield.png";

//insert classement des armes dans le DOM
$("#rules").append("Classement des armes : " , $(dague.img).clone());
for (i=0; i<tabArmes.length; i++) {
	if(i != tabArmes.length)	$("#rules").append(inf);
	$("#rules").append($(tabArmes[i].img).clone());
}