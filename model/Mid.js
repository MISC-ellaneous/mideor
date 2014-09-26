Mid = new Meteor.Collection('Mid', {
  schema: new SimpleSchema({
    notes: {
      type: Object
    },
    //uid: {
    //  type: Number
    //},
    createdAt: {
      type: Date,
      denyUpdate: true
    }
  })
});

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Mid.allow({
    insert : function () {
      return true;
    },
    update : function () {
      return true;
    },
    remove : function () {
      return true;
    }
  });
}
