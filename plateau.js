//Création d'une classe Plateau, et de deux constructeurs
var Plateau = {
	initPlateau: function(nRows, nCols, caseWidth, caseHeight, nbObstacles, nbArmes) {
		this.nRows = nRows;
		this.nCols = nCols;
		this.caseWidth = caseWidth;
		this.caseHeight = caseHeight;
		this.nbObstacles = nbObstacles;
		this.nbArmes = nbArmes;
	},
	//constructeur par copie
	valPlateau: function(plateau) {
		this.nRows = plateau.nRows;
		this.nCols = plateau.nCols;
		this.caseWidth = plateau.caseWidth;
		this.caseHeight = plateau.caseHeight;
		this.nbObstacles = plateau.nbObstacles;
		this.nbArmes = plateau.nbArmes;
	}
}

//Création d'une classe Case
var Case = {
	initCase: function(contenu) {
		this.contenu = contenu;
	},
	getImg: function() {
		if (typeof this.contenu === "object"){
			return this.contenu.img;
		}
		else if (this.contenu == SOL)
			//la function dessine une case de SOL
			return sol;
		else
			return obstacleImage;
	},
	//Si la case contient une arme
	isArme: function() {
		if (this.contenu.hp != null) {
			return false;
		} return true;
	},
	//Si la case contient un joueur
	isJoueur: function() {
		if (this.contenu.hp == null) {
			return false;
		} return true;
	}
}

//dessine le contenu de la case x y 
function draw(x, y) {
	context.drawImage(sol, (x*(plateau.caseWidth+caseMargin)), (y*(plateau.caseHeight + caseMargin)), plateau.caseWidth, plateau.caseHeight);
	context.drawImage(tabCases[x][y].getImg(), (x*(plateau.caseWidth+caseMargin)), (y*(plateau.caseHeight + caseMargin)), plateau.caseWidth, plateau.caseHeight);
} 

//Initialisation des 3 objets plateau
var petitPlateau = Object.create(Plateau);
petitPlateau.initPlateau(6, 8, 80, 80, 10, 2);
var moyenPlateau = Object.create(Plateau);
moyenPlateau.initPlateau(8, 12, 75, 75, 12, 3);
var grandPlateau = Object.create(Plateau);
grandPlateau.initPlateau(10, 15, 60, 60, 30, 4);

//Créer un plateau en fonction de taille
//Ajoute les obstacles, les joueurs, et les armes
function creerPlateau(demande) {
	context.clearRect(0,0, $("#plateau")[0].width, $("#plateau")[0].height);
	plateau = Object.create(Plateau);
	//plateau variable en fonction de la taille choisie
	switch(demande) { 
	case "petit" :
		plateau.valPlateau(petitPlateau);
		break;
	case "moyen" :
		plateau.valPlateau(moyenPlateau);
		break;
	case "grand" :
		plateau.valPlateau(grandPlateau);
		break;
	default:
	break;
	}
	//taille des cases du canvas variables
	$("#plateau").attr("height", plateau.nRows * (plateau.caseHeight + caseMargin));
	$("#plateau").attr("width", plateau.nCols * (plateau.caseWidth + caseMargin));	
	//Initialisation des statistiques liées aux joueurs (append)
	joueur1.defStatsJoueurs();
	joueur2.defStatsJoueurs();
	//créer des cases avec le sol directement intégré
	creerCases(context, plateau, caseMargin);
	//ajoute les éléments en fonction du type et du nombre demandé
	ajoutElement(OBSTACLE, plateau.nbObstacles);
	//tant que le while retourne false, la méthode est relancée
	while (!verifCaseIsolee(plateau)) {
	}
	ajoutElement(joueur1, 1);
	ajoutElement(joueur2, 1);
	while(!dfs([joueur1.xPos, joueur1.yPos])){
		tabCases[joueur1.xPos][joueur1.yPos].initCase(SOL);
		tabCases[joueur2.xPos][joueur2.yPos].initCase(SOL);
		ajoutElement(joueur1, 1);
		ajoutElement(joueur2, 1);
	}
	ajoutElement(ARME, plateau.nbArmes);
	dessinerPlateau(plateau);
} 

//Fonction pour créer les cases dans le plateau
function creerCases(context, plateau, caseMargin) {
	tabCases = new Array(plateau.nCols);
	for ( x = 0; x < plateau.nCols; x++) {
		tabCases[x] = new Array(plateau.nRows);
		for (y = 0 ; y < plateau.nRows ; y++) {
			tabCases[x][y] = Object.create(Case);
			tabCases[x][y].initCase(SOL);
		}
	}
}

function ajoutElement(val, nbObjet) {
	var val2;
	var boolTemp;
	for (i = 0 ; i < nbObjet; i++) {
		boolTemp = true;
		if (val == ARME) {
			val2 = tabArmes[Math.floor(Math.random() * tabArmes.length)]; 
		} else 
			val2 = val;
		//Obstacles
		//On applique le math.random -2 pour ne pas créer d'objets sur la première ligne & colonne
		var x = Math.floor(Math.random() * (plateau.nCols-2) )+1;
		var y = Math.floor(Math.random() * (plateau.nRows-2) )+1;
		if (typeof tabCases[x-1][y].contenu === "object" 
			|| typeof tabCases[x][y-1].contenu === "object"
			|| typeof tabCases[x+1][y].contenu === "object"
			|| typeof tabCases[x][y+1].contenu === "object") {
			//si boolTemp est false, l'objet n'est pas créé, la boucle va donc refaire un tour 
			boolTemp = false;
		} 
		if (val == OBSTACLE) {
			boolTemp = true;
		}
		if (val2 == joueur1) {
			joueur1.xPos = x;
			joueur1.yPos = y;
		}
		if (val2 == joueur2) {
			joueur2.xPos = x;
			joueur2.yPos = y;
		}
		if (tabCases[x][y].contenu == SOL
			&& boolTemp) {
			tabCases[x][y].contenu = val2;
		} else {
			i--;
		}
	}
}

//Dessine le plateau 
function dessinerPlateau(plateau) {
	for (x = 0; x < plateau.nCols; x++) {
		for (y = 0 ; y < plateau.nRows ; y++) {
			context.drawImage(sol, (x*(plateau.caseWidth+ caseMargin)), (y*(plateau.caseHeight + caseMargin)), plateau.caseWidth, plateau.caseHeight);
			var tmp = tabCases[x][y].getImg();
			if(tmp !== null)
				context.drawImage(tmp, (x*(plateau.caseWidth+caseMargin)), (y*(plateau.caseHeight + caseMargin)), plateau.caseWidth, plateau.caseHeight);
		}
	} 
}

//va vérifier qu'une case sol n'est entourée de 4 obstacles. Si oui (false), la fonction va 
//choisir aléatoirement une case obstacle et la replacer dans le plateau
function verifCaseIsolee(plateau) {
	var i = 2;
	while ( i < plateau.nCols -2) {
		var j = 2;
		while (j < plateau.nRows-2) {
			if (tabCases[i][j].contenu == SOL) {
				if (tabCases[i-1][j].contenu == OBSTACLE 
					&& tabCases[i][j+1].contenu == OBSTACLE
					&& tabCases[i+1][j].contenu == OBSTACLE 
					&& tabCases[i][j-1].contenu == OBSTACLE) {
					var iTemp;
					var jTemp;
					switch (Math.floor(Math.random() * 4)) {
						case 0 :
							iTemp = i-1;
							jTemp = j;
							break;
						case 1:
							iTemp = i;
							jTemp = j+1;
							break;
						case 2:
							iTemp = i+1;
							jTemp = j;
							break;
						case 3:
						default:
							iTemp = i;
							jTemp = j-1;
						break;
					}
					tabCases[iTemp][jTemp].contenu = SOL;
					ajoutElement(OBSTACLE, 1);
					return false;
				}
			}
			j++;
		} 
		i++;
	} 
	return true;
}

// Fonction DFS principale
function dfs(depart) 
{ 
	var visite = new Array(2); 
	for (i = 0; i < plateau.nCols; i++) {
		visite[i] = new Array(plateau.nRows);
		for (j = 0; j < plateau.nRows; j++)
			visite[i][j] = false; 
	}
	return DFSUtil(depart, visite, false);
	
} 

//fonction récursive qui va explorer toutes les cases adjacentes
function DFSUtil(coord, visite, found) {
	visite[coord[0]][coord[1]] = true;
	//console.log(coord);
	
	if(coord[0] == joueur2.xPos && coord[1] == joueur2.yPos)
		found = true;
	
	var get_neighbours = getCasesAdja(coord); 

	for (var i in get_neighbours) { 
		var get_elem = get_neighbours[i]; 
		if (!visite[get_elem[0]][get_elem[1]]) 
			return DFSUtil(get_elem, visite, found); 
	}
	return found;
} 

// Retourne la liste des cases de sol adjacentes
function getCasesAdja(coord) {
	var caseAdja = [];
	var x = coord[0];
	var y = coord[1];
	var xTmp;
	var yTmp;
	//Haut
	xTmp = x;
	yTmp = y-1;
	if (yTmp >= 0 && yTmp < plateau.nRows && tabCases[xTmp][yTmp].contenu != OBSTACLE) {
		caseAdja.push([xTmp,yTmp]);	
	}
	//Droite
	xTmp = x+1;
	yTmp = y;
	if (xTmp >= 0 && xTmp < plateau.nCols && tabCases[xTmp][yTmp].contenu != OBSTACLE) {
		caseAdja.push([xTmp,yTmp]);	
	}
	//Bas
	xTmp = x;
	yTmp = y+1;
	if (yTmp >= 0 && yTmp < plateau.nRows && tabCases[xTmp][yTmp].contenu != OBSTACLE) {
		caseAdja.push([xTmp,yTmp]);	
	}
	//Gauche
	xTmp = x-1;
	yTmp = y;
	if (xTmp >= 0 && xTmp < plateau.nCols && tabCases[xTmp][yTmp].contenu != OBSTACLE) {
		caseAdja.push([xTmp,yTmp]);	
	}
	return caseAdja
}