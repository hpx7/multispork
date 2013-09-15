Accounts.onCreateUser(function(options, user) {
  if (options.profile) {
    options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?width=100&height=100";
    user.profile = options.profile;
  }
  return user;
});

Meteor.publish('answers', function (gameId) {
  return Answers.find({gameId: gameId});
});

Meteor.publish("players", function () {
  return Meteor.users.find({}, {fields: {profile: 1}});
});

Meteor.publish('games', function () {
  return Games.find({});
});

Meteor.publish("scores", function() {
  this.ready();
  return Scores.find({});
})


Meteor.users.allow({
  update: function(userId, upd) {
    return true;
  }
});

Meteor.methods({
  start_game: function (id, vote) {
    var clock = 120;
    var hintclock = 15;

    var hintsEnabled = true;

    if (vote == 1) {
      addToCountriesGame(id);
    } else if (vote == 2) {
      addToSmashBrosGame(id);
    } else if (vote == 3) {
      addToSportsGame(id);
    } else if (vote == 4) {
      addToMoviesGame(id);
    }

    Games.update(id, {$set: {state: 2, clock: clock, hintclock: hintclock}});
    var interval = Meteor.setInterval(function () {
      clock -= 1;
      if (hintclock != 0) hintclock -= 1;
      console.log("Hint clock is " + hintclock);
      Games.update(id, {$set: {clock: clock, hintclock: hintclock}});

      var remainingAns = Answers.find({gameId: id, addedBy: null}).count();
      if (clock == 0 || remainingAns == 0) {
        Games.update(id, {$set: {clock: 0, hintclock: 0}});
        Meteor.clearInterval(interval);
        Games.update(id, {$set: {state: 3}})
      }

      if (hintclock == 0 && hintsEnabled) {
        //give a hint
        var toHint = Answers.findOne({gameId: id, addedBy: null, hint: null});
        if (toHint) {
          console.log("hint found: " + toHint.value)
        } else {
          console.log("no hint found");
        }
        if (toHint) {
          var nonSpaceCt = toHint.value.length - (toHint.value.split(" ").length - 1);
          var hint="";

          if (nonSpaceCt >= 1 && nonSpaceCt <= 5) {
            //1 character hint
            var hint1 = -1;
            while (hint1 == -1 || toHint.value.charAt(hint1) == " ") {
              hint1 = Math.floor(Math.random()*toHint.value.length);
            }
            for (var i = 0; i < toHint.value.length; i++) {
              if (i == hint1) {
                hint += toHint.value.charAt(i);
              } else if (toHint.value.charAt(i) == " ") {
                hint += "&nbsp;&nbsp;"
              } else {
                hint += "_ ";
              }
            }
            Answers.update(toHint._id, {$set: {hint: hint}})            
          } else if (nonSpaceCt >= 6 && nonSpaceCt <= 10) {
            //2 character hint
            var hint1 = -1;
            while (hint1 == -1 || toHint.value.charAt(hint1) == " ") {
              hint1 = Math.floor(Math.random()*toHint.value.length);
            }
            var hint2 = -1;
            while (hint2 == -1 || hint2 == hint1 || toHint.value.charAt(hint2) == " ") {
              hint2 = Math.floor(Math.random()*toHint.value.length);
            }    
            for (var i = 0; i < toHint.value.length; i++) {
              if (i == hint1 || i == hint2) {
                hint += toHint.value.charAt(i);
              } else if (toHint.value.charAt(i) == " ") {
                hint += "&nbsp;&nbsp;"
              } else {
                hint += "_ ";
              }
            }
            Answers.update(toHint._id, {$set: {hint: hint}})        
          } else if (nonSpaceCt > 10) {
            var hint1 = -1;
            while (hint1 == -1 || toHint.value.charAt(hint1) == " ") {
              hint1 = Math.floor(Math.random()*toHint.value.length);
            }
            var hint2 = -1;
            while (hint2 == -1 || hint2 == hint1 || toHint.value.charAt(hint2) == " ") {
              hint2 = Math.floor(Math.random()*toHint.value.length);
            }
            var hint3 = -1;
            while (hint3 == -1 || hint3 == hint2 || hint3 == hint1 || toHint.value.charAt(hint3) == " ") {
              hint3 = Math.floor(Math.random()*toHint.value.length);
            }
            for (var i = 0; i < toHint.value.length; i++) {
              if (i == hint1 || i == hint2 || i == hint3) {
                hint += toHint.value.charAt(i);
              } else if (toHint.value.charAt(i) == " ") {
                hint += "&nbsp;&nbsp;"
              } else {
                hint += "_ ";
              }
            }
            Answers.update(toHint._id, {$set: {hint: hint}})   
          }
        }
        toHint = Answers.findOne({gameId: id, addedBy: null, hint: null});
        if (clock > 15 && toHint != null) {
          hintclock = 15;
        } else {
          hintsEnabled = false;
        }
      }

    }, 1000);
    return id;
  }
});
