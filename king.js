//Génère le plateau en fonction de la taille choisie par l'utilisateur par l'intermédiaire des
//boutons html
$(document).ready(function() {
	$("#taillePlateau > input").click(function() {
		preload();
		creerPlateau(this.className);
		$("#taillePlateau > input").hide();
		tour = joueur1;
		tour.pointsMouv = 3;
		checkTour();
	});
});

//Déplacement des joueurs au clavier
$(window).keydown(function(event){
	var key = event.keyCode;
	switch(key) {
		case Z :
			tour.deplacer(DIRECTION.HAUT, plateau);
			break;
		case Q :
			tour.deplacer(DIRECTION.GAUCHE, plateau);
			break;
		case D :
			tour.deplacer(DIRECTION.DROITE, plateau);
			break;
		case S :
			tour.deplacer(DIRECTION.BAS, plateau);
			break;
		case ESPACE :
			tour.pointsMouv = 0;
			break;
		case A :
			attaquer();
			break;
		case E :
			tour.postureDef = true;
			tour.pointsMouv = 0;
	}	
	checkTour();
})

//Définit à qui est le tour
function checkTour() {
	tour.defStatsJoueurs();
	if (tour.pointsMouv <= 0) {
		tour = (tour == joueur1) ? joueur2 : joueur1;
		tour.postureDef = false;
		tour.pointsMouv = 3;
		tour.defStatsJoueurs();
		alert("C'est au tour de " + tour.nom + " de jouer.")
	}
	$("#tour").html("<p>C'est au tour de <b class=\""
		+ tour.idHtml.substring(1, tour.idHtml.length-1)
		+ "\">" + tour.nom + "</b> de jouer ! A l'assaut !</p>");
}


function attaquer() {
	if ((Math.abs(joueur1.xPos - joueur2.xPos) == 1 && joueur1.yPos == joueur2.yPos) 
		|| (Math.abs(joueur1.yPos - joueur2.yPos) == 1 && joueur1.xPos == joueur2.xPos)) {
		var cible = (tour == joueur1) ? joueur2 : joueur1;
		if(cible.postureDef == true) {
			cible.hp -= tour.currArme.degat / 2;
		} else {
			cible.hp -= tour.currArme.degat
		}
		cible.defStatsJoueurs();
		if (cible.hp <= 0) {
			cible.hp = 0;
			alert(cible.nom + " a été battu par " + tour.nom + ". Longue vie au Roi " + tour.nom +" !");
			location.reload();
		} 
	} tour.pointsMouv = 0;
}

