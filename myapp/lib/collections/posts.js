Posts = new Mongo.Collection('posts');

// Posts.allow({
//     insert: function(userId, doc){
//         //allow only registered users to post content
//         return !! userId;
//     }
// })

Posts.allow({
    update: function(userId, post) {return ownsDocument(userId,post);},
    remove: function(userId, post) {return ownsDocument(userId,post);},
});

Posts.deny({
    update:function(userId, post, fieldNames){
        //may only edit following two fields
        return (_.without(fieldNames, 'url', 'title').length > 0);
    }
}),
Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

Meteor.methods({
    postInsert:function(postattributes){
        check(Meteor.userId(), String);
        check(postattributes, {
            title:String,
            url: String
        });
        
    var errors = validatePost(postattributes);
    if(errors.title || errors.url)
    throw new Meteor.error('Invalid Post', ' You must set a title and url for your post')
        
    var postWithSameLink = Posts.findOne({url:postattributes.url});
        if(postWithSameLink){
            return {
                postExists: true,
                _id:postWithSameLink._id
            }
        }
    
        
    var user = Meteor.user();
    
    var post = _.extend(postattributes,{
        userId:user._id,
        author:user.username,
        submitted:new Date()
    });
    
    var postId = Posts.insert(post);
    return {
        _id:postId
    };
    }    
});

validatePost = function(post){
    var errors = {};
    if(!post.title)
    errors.title='Please fill in the headline'
    if(!post.url)
    errors.url='Please enter a url'
    return errors;
}
