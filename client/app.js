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

Template.game.winner = function () {
  var winningScore = Template.leaderboard.usersInGame().fetch()[0];
  return winningScore ? Meteor.users.findOne(winningScore.userId) : "";
}

Template.game.getMsg = function () {
  return Scores.findOne({gameId: Session.get('currentGameId'), userId: Meteor.userId()}).msg;
}

Template.game.formattedTime = function (secs) {
  if (secs == null) {
    secs = 120;
  }

  var min = Math.floor(secs / 60);
  var sec = secs % 60;
  return min + ':' + (sec < 10 ? ('0' + sec) : sec);
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
  return Scores.findOne({gameId: Session.get('currentGameId'), userId: user._id}).color;
}

Template.leaderboard.usersInGame = function () {
  return Scores.find({gameId: Session.get('currentGameId')}, {sort: {value: -1}})
}

Template.game_link.num_players = function (gameId) {
  return Scores.find({gameId: gameId}).count();
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

    var ans = Answers.findOne({gameId: Session.get('currentGameId'), lower: guess.toLowerCase()});
    var score = Scores.findOne({gameId: Session.get('currentGameId'), userId: Meteor.userId()});
    if (ans && !ans.addedBy) {
      Answers.update({_id: ans._id}, {
        $set: {addedBy: Meteor.user()}
      });
      Scores.update(score._id, {$inc: {value: 1}});
    } else {
      var msg;
      if (!ans) {
        msg = guess + " is incorrect!";
      } else {
        msg = guess + " has already been guessed!";
      }
      Scores.update(score._id, {$set: {msg: msg}});
    }
    $('#guessinput').val('');
    $('#guessinput').focus();
    evt.preventDefault();
  },

  'click button#start_game': function(evt) {
    console.log('starting game...');
    Meteor.call('start_game', Session.get('currentGameId'));
  }
});

Meteor.startup(function() {
  Session.set('scores_ready', false);
});
