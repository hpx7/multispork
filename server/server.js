Meteor.users.allow({
  update : function(userId, upd) {
    return true;
  }
});

Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
        options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?width=100&height=100";
        user.profile = options.profile;
    }
    return user;
});