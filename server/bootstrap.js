var countries = ["United States","Mexico","Canada","Guatemala","Cuba","Haiti","Honduras","El Salvador","Nicaragua","Costa Rica","Puerto Rico"];
addToCountriesGame = function (gameId) {
  Games.update(gameId, {$set: {description:"Name all the North American countries you can"}});
  countries.forEach(function (country) {
    Answers.insert({gameId: gameId, value: country, lower: country.toLowerCase()});
  });
}

var characters = ["Meta Knight","Diddy Kong","Snake","Falco","Marth","Wario","Ice Climbers","Olimar","Pikachu","Lucario","King Dedede","Zero Suit Samus","Mr. Game & Watch","Toon Link","Fox","Wolf","Peach","Donkey Kong","Kirby","R.O.B.","Pit","Sonic","Ike","Zelda","Luigi","Sheik","Ness","Yoshi","Pokemon Trainer","Lucas","Mario","Bowser","Samus","Captain Falcon","Link","Jigglypuff","Zelda","Ganondorf"];
addToSmashBrosGame = function (gameId) {
  Games.update(gameId, {$set: {description:"Name all the Super Smash Bros Brawl characters you can"}});
  characters.forEach(function (character) {
    Answers.insert({gameId: gameId, value: character, lower: character.toLowerCase()});
  });
}

var teams = ["49ers","Bears","Bengals","Bills","Broncos","Browns","Bucaneers","Cardinals","Chargers","Cheifs","Colts","Cowboys","Dolphins","Eagles","Falcons","Giants","Jaguars","Jets","Lions","Packers","Panthers","Patriots","Raiders","Rams","Ravens","Redskins","Saints","Seahawks","Steelers","Texans","Titans","Vikings"];
addToSportsGame = function (gameId) {
  Games.update(gameId, {$set: {description:"Name all the NFL teams you can"}});
  teams.forEach(function (team) {
    Answers.insert({gameId: gameId, value: team, lower: team.toLowerCase()});
  });
}

var movies = ["1941","A.I. Artificial Intelligence","The Adventures of Tintin","Always","Amblin'","Amistad","Catch Me If You Can","Close Encounters of the Third Kind","The Color Purple","Duel","E.T.","Empire of the Sun","Firelight","Hook","Indiana Jones","Jaws","Jurassic Park","Lincoln","The Lost World","Minority Report","Munich","Raiders of the Lost Ark","Saving Private Ryan","Schindler's List","Slipstream","Something Evil","The Sugarland Express","The Terminal","Twilight Zone","War Horse","War of the Worlds"];
addToMoviesGame = function (gameId) {
  Games.update(gameId, {$set: {description:"Name all movies directed by Steven Spielberg you can"}});
  movies.forEach(function (movie) {
    Answers.insert({gameId: gameId, value: movie, lower: movie.toLowerCase()});
  });
}