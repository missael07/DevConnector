const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')


const User = require('../../models/User');
const Post = require('../../models/Post');


//@route    POST api/posts
//@desc     Create posts route
//@access   Private
router.post('/', [auth, [
    check('text', 'Text posts is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

//@route    GET api/posts
//@desc     Get all user posts route
//@access   Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        if (!posts) {
            return res.status(400).json({ msg: 'No posts made it from this user' });
        }

        res.json(posts);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

//@route    GET api/posts/:id
//@desc     Get user post by id route
//@access   Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ msg: 'Post not found' });

        res.json(post);

    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') return res.status(404).json({ msg: 'Post not found' });
        res.status(500).send('Server Error');
    }
})

//@route    DELETE api/posts/:id
//@desc     Delete user post by id route
//@access   Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ msg: 'Post not found' });
        if (post.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authirized' });

        await post.remove();
        res.json({ msg: 'Post removed' });

    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') return res.status(404).json({ msg: 'Post not found' });
        res.status(500).send('Server Error');
    }
})

//@route    PUT api/post/like/:id
//@desc     Like Post route
//@access   Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //Check if the post has already been liked by the current user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();

        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    PUT api/post/unlike/:id
//@desc     Like Post route
//@access   Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //Check if the post has already been liked by the current user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked' });
        }

        const removeIdex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIdex, 1);
        await post.save();

        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    POST api/posts/comment/:id
//@desc     Create comments on a post route
//@access   Private
router.post('/comment/:id', [auth, [
    check('text', 'Text comment is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const post = await Post.findById(req.params.id);

        const newComment = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

//@route    DELETE api/posts/comment/:id/:comment_id
//@desc     Delete user comment on a post by id route
//@access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        //Validate that the comment exists
        if (!comment) return res.status(404).json({ msg: 'Comment does not exist' });

        if (comment.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        const removeIdex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
        post.comments.splice(removeIdex, 1);
        await post.save();

        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
module.exports = router;
