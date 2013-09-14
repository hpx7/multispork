Meteor.Router.add({
  '/' : function () {
    Session.set('currentGameId', null);
    return 'home';
  },
  '/rooms/:id': function (id) {
    Session.set('currentGameId', id);
    Meteor.users.update({_id: Meteor.userId()}, {$set : {
      "profile.gameId": id,
      "profile.score": 0
    }});
    return 'game';
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
  return Meteor.users.find({"profile.gameId": Session.get('currentGameId')});
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
      Meteor.users.update({_id: Meteor.userId()}, {
        $inc: {"profile.score": 1}
      });
    } else {
      console.log('uh-oh');
    }
  }
});
