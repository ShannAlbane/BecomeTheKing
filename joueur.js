//Création d'une classe Personnage
var Personnage = {
	initPerso : function(nom, hp, img, currArme, idHtml) {
		this.nom = nom;
		this.hp = hp;
		this.img = new Image();
		this.img.src = img + "0.png";
		this.currArme = currArme;
		this.postureDef = false;
		this.precArme = null;
		this.xPos = 0;
		this.yPos = 0;
		this.direction = DIRECTION.BAS;
		this.pointsMouv = 3;
		this.idHtml = idHtml;
	},

	//fonction pour initialiser les stats des joueurs + intégrer dans le DOM
	defStatsJoueurs: function() {
		$(this.idHtml+".hp").text(this.hp);
		$(this.idHtml+".arme").text(this.currArme.nom + " " + this.currArme.degat + " points d'attaque");
		$(this.idHtml+".pointsMouv").text(this.pointsMouv);
		$(this.idHtml+".imgArme").attr("src", this.currArme.img.src);
	},

	changeArme: function(nouvArme) {
		this.precArme = this.currArme;
		this.currArme = nouvArme;
	},

	changeImage: function() {
		this.img.src = this.img.src.substring(0, this.img.src.length - 5) + this.direction + ".png";
	},
	//fonction pour gérer le déplacement
	getCoordonneesAdjacentes : function(direction) {
		xTemp = this.xPos;
		yTemp = this.yPos;
		switch(direction) {
			case DIRECTION.BAS :
				yTemp++;
				break;
			case DIRECTION.GAUCHE :
				xTemp--;
				break;
			case DIRECTION.DROITE :
				xTemp++;
				break;
			case DIRECTION.HAUT :
				yTemp--;
				break;
		} 
		var coord = new Array(2);
		coord[0] = xTemp;
		coord[1] = yTemp
		return coord;
	},

	deplacer: function(direction, plateau) {
		this.direction = direction;
		this.changeImage();
		prochaineCase = this.getCoordonneesAdjacentes(direction);
		collision = tabCases[prochaineCase[0]][prochaineCase[1]];
		//Gestion de la collision avec les obstacles + bords du plateau
		if (collision.contenu == OBSTACLE || collision.isJoueur() == true) {
			return false;
		}
		if (this.precArme != null) {
			tabCases[this.xPos][this.yPos].initCase(this.precArme);
			this.precArme = null;
		} else {
			tabCases[this.xPos][this.yPos].initCase(SOL);
		}
		//Gestion du l'arme actuelle lorsque le joueur passe sur une case contenant une arme
		if (typeof collision.contenu == "object" && collision.isArme() == true) {
			this.changeArme(tabCases[xTemp][yTemp].contenu); 
		}
		this.defStatsJoueurs();
		draw(this.xPos, this.yPos);
		this.xPos = prochaineCase[0];
		this.yPos = prochaineCase[1];
		tabCases[this.xPos][this.yPos].initCase(this);
		draw(this.xPos, this.yPos);
		this.pointsMouv--;
		return true;
	}
}

//Saisie du nom par les utilisateurs + ajout attributs name pour réutilisation
var nomJ1 = prompt("Joueur 1, veuillez saisir votre nom : " );
if (nomJ1 == "") {
	nomJ1 = "Ketchup";
}
$("#abandonJ1 > input").attr("name", nomJ1);
$("#nomJ1").text(nomJ1);

var nomJ2 = prompt("Joueur 2, veuillez saisir votre nom : " );
if (nomJ2 === "") {
	nomJ2 = "Mayo";
}
$("#abandonJ2 > input").attr("name", nomJ2);
$("#nomJ2").text(nomJ2);

//Init des deux joueurs et de leurs paramètres
var joueur1 = Object.create(Personnage);
joueur1.initPerso(nomJ1, 100,"images/joueurs/j1", dague, "#joueur1 ");
var joueur2 = Object.create(Personnage);
joueur2.initPerso(nomJ2, 100, "images/joueurs/j2", dague, "#joueur2 ");

//Intégration du bouclier dans le DOM
$(imgBouclier).clone().insertBefore("#abandonJ1");
$(imgBouclier).clone().insertBefore("#abandonJ2");

//Gère l'abandon des joueurs
$(".abandon").click(function(e) {
	var boolConfirm = confirm("Êtes-vous sûr de vouloir abandonner la partie, " + this.name + " ? ");
	if (boolConfirm == true ) {
		if (this.name == joueur1.nom) {
			alert("Le règne de " + joueur1.nom + " est terminé. Longue vie au roi " + joueur2.nom);
			} else {
			alert("Le règne de " + joueur2.nom + " est terminé. Longue vie au roi " + joueur1.nom);
		} location.reload();
	}
})
