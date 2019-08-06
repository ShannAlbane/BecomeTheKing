//Récupération du contexte du canvas
var context = $("#plateau")[0].getContext("2d");

//init pour le plateau
var tabCases = new Array;
var context;

const SOL = 0;
const OBSTACLE = 1;
const ARME = 2;

var plateau;
var caseMargin = 2
var sol = new Image();
sol.src = "images/SolTapis.png";

//init liées aux obstacles
var nbObstacles;
var obstacleImage = new Image();
obstacleImage.src = "images/StoneFloorTexture.png";
 
//init pour les armes
var nbArmes;

var inf = " est inférieur à ";

//init pour les joueurs
const Z = 90;
const Q = 81;
const D = 68;
const S = 83;
const ESPACE = 32;
const A = 65;
const E = 69;

const DIRECTION = {
	"BAS" : 0,
	"GAUCHE" : 1,
	"DROITE" : 2,
	"HAUT" : 3
}

var prochaineCase;
var xTemp;
var yTemp;
var collision;
var tour;

//Pré-chargement des images pour plus de fludité
function preload() {
var preLoadImg = [];
	for (i = 0; i < 4; i++) {
		preLoadImg[i] = new Image();
		preLoadImg[i].src = "images/joueurs/j1" + i + ".png";
	}
}

