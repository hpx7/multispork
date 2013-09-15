Meteor.Router.add({
  '/' : function () {
    return 'home';
  },
  '/rooms/:id': function (id) {
    Session.set('currentGameId', id);
    if (Meteor.userId() && Session.equals('scores_ready', true)) {
      var id = Session.get('currentGameId');
      var score = Scores.findOne({userId: Meteor.userId(), gameId: id});
      console.log("Score: " + JSON.stringify(score));
      if (!score) {
        var color = colors[Template.game_link.num_players(id) % colors.length];
        Scores.insert({userId: Meteor.userId(), gameId: id, value: 0, color: color});
      }
    }

    return 'game';
  }
});

Meteor.subscribe('games');
Meteor.subscribe('players');
Meteor.subscribe('scores', function() {
  Session.set('scores_ready', true);
});
Deps.autorun(function () {
  Meteor.subscribe('answers', Session.get('currentGameId'));
});

Template.game.preGame = function () {
  return Games.findOne(Session.get('currentGameId')).state == 1;
}

Template.game.postGame = function () {
  return Games.findOne(Session.get('currentGameId')).state == 3;
}

Template.game.isOwner = function () {
  return Meteor.user() && Meteor.userId() == Games.findOne(Session.get('currentGameId')).owner._id;
}

Template.game.game = function () {
  return Games.findOne(Session.get('currentGameId'));
}

Template.game.answers = function () {
  return Answers.find({
    gameId: Session.get('currentGameId')
  });
}

Template.answer.guessed = function () {
  return this.addedBy != null;
}

Template.answer.blanks = function (answer) {
  var s = "";
  var space = "&nbsp;";
  for (var i = 0; i < answer.length; i++) {
    if (answer.charAt(i) == " ") {
      s += space + space;
    } else {
      s += "_ ";
    }
  }
  return s;
}

Template.answer.color_for = function (user) {
  console.log(user);
  return Scores.findOne({gameId: Session.get('currentGameId'), userId: user._id}).color;
}

Template.leaderboard.usersInGame = function () {
  return Scores.find({gameId: Session.get('currentGameId')}, {sort: {value: -1}})
}

Template.game_link.num_players = function (gameId) {
  console.log("Calling num_players with " + gameId);
  return Scores.find({gameId: gameId}).count();
  //return Meteor.users.find({'profile.currentGameId': gameId}).count();
}

Template.home.games = function() {
  return Games.find({});
}

Template.user.get_profile = function(userId) {
  return Meteor.users.findOne(userId).profile;
}

Template.home.events({
  'click button#make_room': function() {
    var owner = Meteor.user();
    var room_name = $("#room_name").val();
    var id = Games.insert({owner: owner, name: room_name, state: 1});
    Meteor.Router.to('/rooms/'+ id);
  },

  'click tr.game_row': function(evt) {
    Meteor.Router.to('/rooms/'+$(evt.currentTarget).attr('id'));
  }
});

Template.game.events({
  'submit form#guess': function(evt) {
    var guess = $('#guessinput').val();
    console.log('you guessed: ' + guess);

    var ans = Answers.findOne({gameId: Session.get('currentGameId'), value: guess});
    console.log(ans);
    if (ans && !ans.addedBy) {
      Answers.update({_id: ans._id}, {
        $set: {addedBy: Meteor.user()}
      });
      var score = Scores.findOne({gameId: Session.get('currentGameId'), userId: Meteor.userId()});
      Scores.update(score._id, {$inc: {value: 1}});
    } else {
      if (!ans) {
        $('#message_box').html(guess + " is incorrect!");
      } else {
        $('#message_box').html(guess + " has already been guessed!");
      }
    }
    $('#guessinput').val('');
    $('#guessinput').focus();
    evt.preventDefault();
  },

  'click button#start_game': function(evt) {
    Meteor.call('start_game', Session.get('currengGameId'));
  }
});

Meteor.startup(function() {
  Session.set('scores_ready', false);
});
