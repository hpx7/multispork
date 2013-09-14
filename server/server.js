Meteor.users.allow({
  update : function(userId, upd) {
    return true;
  }
});
