Comments = new Mongo.Collection('comments');

Meteor.methods({
    commentInsert: function(commentAttributes){
        check(this.userId, String);
        check(commentAttributes, {
            postId: String,
            body: String
        });
        var user = Meteor.user();
        var post = Posts.findOne(commentAttributes.postId);
        if(!post)
            throw new Meteor.error('invalid comment','you must comment on a post');
        comment = _.extend(commentAttributes,{
            userId : user._id,
            author: user.username,
            submitted: new Date()
        });
            //update the post with number of counts
        Posts.update(comment.postId, {$inc: {commentsCount:1}});
        // return Comments.insert(comment);
        
        //create the comment and save its id
        comment._id = Comments.insert(comment);
        
        //now create a notification, informing the user that ther's been a comment
        createCommentNotification(comment)
        return comment._id
        
    }
})