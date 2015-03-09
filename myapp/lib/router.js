Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn:function() {
        return [Meteor.subscribe('notifications')];
    }
});

Router.route('/posts/:_id', {
    name:'postPage',
    waitOn:function(){
      return Meteor.subscribe('comments', this.params._id);  
    },
    data: function(){
        return Posts.findOne(this.params._id);
    }
});
Router.route('/submit', {name: 'postSubmit'});

Router.route('posts/:_id/edit', {
    name:'postEdit',
    data:function(){
        return Posts.findOne(this.params._id);
    }
})

PostsListController = RouteController.extend({
    template:'postsList',
    increment: 5,
    postsLimit:function(){
        return parseInt(this.params.postsLimit) || this.increment;
    },
    findOptions: function(){
        return {sort:{submitted:-1}, limit: this.postsLimit()};
    },
    waitOn:function(){
        return Meteor.subscribe('posts', this.findOptions());
    },
    posts:function(){
        return Posts.find({}, this.findOptions());
    },
    data:function(){
        var hasMore = this.posts().count() === this.postsLimit();
        var nextPath=this.route.path({postsLimit:this.postsLimit()+this.increment});
        return {
            // posts: Posts.find({}, this.findOptions())
            posts:this.posts(),
            nextPath:hasMore ? nextPath:null
        };
    }
});

Router.route('/:postsLimit?', {
    name: 'postsList',
    // waitOn:function(){
    //     var limit= parseInt(this.params.postsLimit) || 5;
    //     return Meteor.subscribe('posts', {sort: {submitted:-1}, limit: limit});
    // },
    // data:function(){
    //     var limit = parseInt(this.params.postsLimit) || 5;
    //     return{
    //         posts: Posts.find({}, {sort:{submitted: -1}, limit: limit})
    //     };
    // }
});

var requirelogin =function(){
    if(!Meteor.user()){
        if(Meteor.loggingIn()){
            this.render(this.loadingTemplate)
        }
        else{
        this.render('accessDenied');
        }
    }
    else{
        this.next();
    }
}

Router.onBeforeAction('dataNotFound', {only:'postPage'});
Router.onBeforeAction(requirelogin,{only:'postSubmit'});