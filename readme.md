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
Ajout d'un bouton modifier le profil
Ajout d'un bouton déconnexion au profil
Ajout d'un bouton supprimer le profil
Ajout la position en temps réel du joueur
Affichage du rayon de 10km,100km et toutes les cachettes
Créer une cachette
Modifier la cachette : Tous les champs de créer la cachette MAIS on peut pas modifier le nom de la cachette
Supprimer la cachette avec le nom de la cachette qu'on veut supprimer
Lire la cachette : Sous forme de map avec l'API Leaflet

description de mes collections

# // USERS

login
password
Nom
Prénom
email

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# // CACHETTES

Créer des cachettes avec les paramètres :
Nom de la cachette,
la description,
la longitude,
la latitude,
le niveau de difficulté et
le mot de passe de la cachette

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Fonctionnalité à implementer

Regler le problème de connexions alors qu'on a dejà un compte pas toujours devoir créer un compte
Ajoutez le périmètre des cachettes, les caches si on selectionne un rayon
Ajoutez une validation de cachette quand l'utilisateur à trouvez une cachette et à taper le bon mot de passe,
Ajoutez un classement des joueurs qui a trouvez le plus de cachette,
Ajoutez plus de token pour avoir plus de sécuriser sur les pages notamment au supprimer
Ajoutez des commentaires sous chaque cachette,
Ajoutez la fonctionnalité des photos

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
