// if (Posts.find().count() === 0) {
//   Posts.insert({
//     title: 'Introducing Telescope',
//     url: 'http://sachagreif.com/introducing-telescope/'
//   });

//   Posts.insert({
//     title: 'Meteor',
//     url: 'http://meteor.com'
//   });

//   Posts.insert({
//     title: 'The Meteor Book',
//     url: 'http://themeteorbook.com'
//   });
// }

if(Posts.find().count() === 0){
  var now = new Date().getTime();
  
  //create two users
  var tomId = Meteor.users.insert({
    profile: {name: 'vini'}
  });
  var tom = Meteor.users.findOne(tomId);
  
  var sachaId = Meteor.users.insert({
    profile:{name: 'sacha'}
  });
  var sacha = Meteor.users.findOne(sachaId);
  
  var telescopeId = Posts.insert({
    title:'introducing telescope 2',
    userId: sacha._id,
    author:sacha.profile.name,
    url:'http://sachagreif.com/introducing-telescope/',
    submitted: new Date(now-7 * 3600 * 1000),
    commentsCount : 2
  });
  
  Comments.insert({
    postId:telescopeId,
    userId:tom._id,
    author:tom.profile.name,
    submitted:new Date(now - 5 *3600 *1000),
    body:' interesting project sacha, can i get involved2?'
  });
    Comments.insert({
    postId: telescopeId,
    userId: sacha._id,
    author: sacha.profile.name,
    submitted: new Date(now - 3 * 3600 * 1000),
    body: 'You sure can Tom2!'
  });

    Posts.insert({
    title: 'Meteor 2',
    userId: tom._id,
    author: tom.profile.name,
    url: 'http://meteor.com',
    submitted: new Date(now - 10 * 3600 * 1000),
    commentsCount:0
  });

  Posts.insert({
    title: 'The Meteor Book 2',
    userId: tom._id,
    author: tom.profile.name,
    url: 'http://themeteorbook.com',
    submitted: new Date(now - 12 * 3600 * 1000),
    commentsCount:0
  });
  
  for(var i =0; i< 10; i++){
    Posts.insert({
      title:'test post #'+i,
      author:tom.profile.name,
      userId:tom._id,
      url:'http://google.com/?q=test-'+i,
      submitted:new Date(now-i*3600*1000),
      commentsCount:0
    });
  }
  
}