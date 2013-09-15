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

// Meteor.publish('players', function (gameId) {
//   return Meteor.users.find({$or: [
//     {'profile.currentGameId': gameId},
//     {_id: this.userId}
//   ]});
// });

Meteor.publish("players", function () {
  return Meteor.users.find({}, {fields: {profile: 1}});
});

Meteor.publish('games', function () {
  return Games.find({});
});

Meteor.publish("scores", function(gameId) {
  return Scores.find({gameId: gameId});
})


Meteor.users.allow({
  update: function(userId, upd) {
    return true;
  }
});

