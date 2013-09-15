Meteor.Router.add({
  '/' : function () {
    return 'home';
  },
  '/rooms/:id': function (id) {
    // Session.set('currentGameId', id);
    // console.log("id: "+Meteor.user());

    // Meteor.users.update(Meteor.userId(), {$set: { 'profile.currentGameId': Session.get('currentGameId')}});

    // if (Meteor.user() && Session.get('currentGameId') != Meteor.user().profile.currentGameId) {
    //   console.log("Setting current game ");
    //   Meteor.users.update(Meteor.userId(), {$set: {
    //     'profile.score': 0
    //   }});
    // }

    Session.set('currentGameId', id);
    return 'game';
  }
});

Meteor.subscribe('games');
Meteor.subscribe('players');
Deps.autorun(function () {
  Meteor.subscribe('scores', Session.get('currentGameId'), function() {
    Session.set('scores_ready', true);
  });
  Meteor.subscribe('answers', Session.get('currentGameId'));
  var id = Session.get('currentGameId');
  var score = Scores.findOne({userId: Meteor.userId(), gameId: id});
  console.log("Score: " + score);
  if (!score && Session.get('scores_ready')) 
    Scores.insert({userId: Meteor.userId(), gameId: id, value: 0});
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
  return Scores.find({gameId: Session.get('currentGameId')})
  //return Meteor.users.find({'profile.currentGameId': Session.get('currentGameId')}, {sort: {score: 1}});
}

Template.game_link.num_players = function (gameId) {
  return Scores.find({gameId: gameId}).count();
  //return Meteor.users.find({'profile.currentGameId': gameId}).count();
}

Template.home.games = function() {
  return Games.find({});
}

Template.user.get_profile = function(userId) {
  console.log("ID: " + userId);
  console.log("USER: " + Meteor.users.findOne(userId));
  return Meteor.users.findOne(userId).profile;
}

Template.home.events({
  'click button#make_room': function() {
    var owner = Meteor.user().profile.name;
    var room_name = $("#room_name").val();
    var id = Games.insert({owner: owner, name: room_name});
    Meteor.Router.to('/rooms/'+ id);
  },

  'click tr.game_row': function(evt) {
    Meteor.Router.to('/rooms/'+$(evt.currentTarget).attr('id'));
  }
})



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
      var score = Scores.findOne({gameId: Session.get('currentGameId'), userId: Meteor.userId()});
      Scores.update(score._id, {$inc: {value: 1}});
      //Meteor.users.update(Meteor.userId(), {$inc: {'profile.score': 1}});
    } else {
      console.log('uh-oh');
    }
  }
});

Meteor.startup(function() {
  Session.set('scores_ready', false);
})