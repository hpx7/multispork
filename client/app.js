Meteor.Router.add({
  '/' : function () {
    Session.set('currentGameId', null);
    return 'home';
  },
  '/rooms/:id': function (id) {
    Session.set('currentGameId', id);
    return 'game';
  }
});

Meteor.subscribe('games');
Deps.autorun(function () {
  var id = Session.get('currentGameId');
  Meteor.subscribe('answers', id);
  Meteor.subscribe('players', id);

  if (Meteor.user() && Meteor.user().profile.currentGameId != id) {
    Meteor.users.update(Meteor.userId(), {$set: {
      'profile.score': 0,
      'profile.currentGameId': id
    }});
  }
});

Template.game.answers = function () {
  return Answers.find({
    gameId: Session.get('currentGameId')
  });
}

Template.game.guessed = function () {
  return this.addedBy != null;
}

Template.game.usersInGame = function () {
  return Meteor.users.find({'profile.currentGameId': Session.get('currentGameId')}, {sort: {score: 1}});
}

Template.game.events({
  'click input#guessbutton': function() {
    var guess = $('#guessinput').val();
    console.log('you guessed: ' + guess);

    var ans = Answers.findOne({gameId: Session.get('currentGameId'), value: guess});
    console.log(ans);
    if (ans && !ans.addedBy) {
      Answers.update({_id: ans._id}, {
        $set: {addedBy: Meteor.user().profile}
      });

      Meteor.users.update(Meteor.userId(), {$inc: {'profile.score': 1}});
    } else {
      console.log('uh-oh');
    }
  }
});
