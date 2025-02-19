///////////////////////////////////////README APPLICATION GEOCACHE ///////////////////////////////////////////////////////////

# // TECHNOLOGIE UTILISES

typesscript : verifier les types
Javascript : Traductions du typescript
jest : vérifier les résultats des fonctions.
supertest : vérifier les résultats des endpoints.
lint : verifier la syntaxe, les variables déclarées mais non utilisées...
endpoint : url incluant des parametres et qui retroune un résultat.
mongodb : serveur de données

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Une application de géocache qui permet au utilisateur de joue à trouver des cachettes sous forme de map avec des points de cordonnées.
Le joueur pourra chercher des cachettes autour de sa position, ajoutez des cachettes, les modifiers et les supprimer.

# // Fonctionnalite implementer

Création de route sécurisée avec un token enregistrer avec un cookies pour la route /read-cachette
Ajout d'une vue de profil ou on retrouve les informations de l'utilisateur :
nom d'utilisateur,
Nom,
Prenom,
Email

description de mes collections

# // USERS

login
pass
Nom
Prénom
mail

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# // CACHETTES

Créer des cachettes avec les paramètres :
Nom de la cachette,
la description,
la longitude,
la latitude,
le niveau de difficulté et
le mot de passe de la cachette

Modifier la cachette : Tous les champs de créer la cachette MAIS on peut pas modifier le nom de la cachette

Supprimer la cachette

Lire la cachette : Sous forme de map avec l'API Leaflet

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Fonctionnalité à implementer

Ajoutez un bouton déconnexion au profil
Ajoutez un bouton modifier le profil
Ajoutez le périmètre des cachettes, les caches si on selectionne un rayon
Ajoutez une validation de cachette quand l'utilisateur à trouvez une cachette et à taper le bon mot de passe,
Ajoutez un classement des joueurs qui a trouvez le plus de cachette,
Ajoutez plus de token pour avoir plus de sécuriser sur les pages notamment au supprimer
Ajoutez des commentaires sous chaque cachette,
Ajoutez la fonctionnalité des photos

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
