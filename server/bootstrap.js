var countries = ["United States","Mexico","Canada","Guatemala","Cuba","Haiti","Honduras","El Salvador","Nicaragua","Costa Rica","Puerto Rico"]
addToCountriesGame = function (gameId) {
  Games.update(gameId, {$set: {description:"Name all the North American countries you can"}});
  countries.forEach(function (country) {
    Answers.insert({gameId: gameId, value: country, lower: country.toLowerCase()});
  });
}

var characters = ["Bowser","Captain Falcon","Donkey Kong","Falco","Fox","Ganondorf","Ice Climbers","Jigglypuff","Kirby","Link","Luigi","Mario","Marth","Mr. Game & Watch","Ness","Pikachu","Peach","Zelda","Samus","Yoshi"]
addToSmashBrosGame = function (gameId) {
  Games.update(gameId, {$set: {description:"Name all the Super Smash Bros Melee characters you can"}});
  characters.forEach(function (character) {
    Answers.insert({gameId: gameId, value: character, lower: character.toLowerCase()});
  });
}
