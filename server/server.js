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
  start_game: function (id) {

    var clock = 120;

    Games.update(id, {$set: {state: 2, clock: clock}});
    var interval = Meteor.setInterval(function () {
      clock -= 1;
      Games.update(id, {$set: {clock: clock}})

      if (clock === 0) {
        Meteor.clearInterval(interval);
        Game.update(id, {$set: {state: 3}})
      }
    }, 1000);
    return id;
  }
});