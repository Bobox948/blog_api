const User = require("../models/user");
const Post = require("../models/post");

const jwt = require('jsonwebtoken')

exports.create_post = async (req, res) => {
    const token = req.token;
    
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        const user = await User.findById(decodedToken.user);

        if (!user || !user.admin) {
            return res.status(403).json({ message: 'Only admins can create posts' });
        }

        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
        });

        try {
          await newPost.save();
          res.json({ message: 'Post created successfully' });
      } catch (err) {
          res.status(500).json({ message: 'Could not create post' });
      }
    });
};

exports.update_post = async (req, res) => {
  const token = req.token;
  
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
          return res.status(403).json({ message: 'Invalid token' });
      }

      const user = await User.findById(decodedToken.user);

      if (!user || !user.admin) {
          return res.status(403).json({ message: 'Only admins can update posts' });
      }

      const postToUpdate = await Post.findById(req.body._id);

      if (!postToUpdate) {
          return res.status(404).json({ message: 'Post not found' });
      }

      postToUpdate.title = req.body.title;
      postToUpdate.content = req.body.content;

      try {
        await postToUpdate.save();
        res.json({ message: 'Post updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Could not update post' });
    }
    
  });
};

exports.delete_post = async (req, res) => {
  const token = req.token;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
          return res.status(403).json({ message: 'Invalid token' });
      }

      const user = await User.findById(decodedToken.user);

      if (!user || !user.admin) {
          return res.status(403).json({ message: 'Only admins can delete posts' });
      }

      const postToDelete = await Post.findById(req.body._id);

      if (!postToDelete) {
          return res.status(404).json({ message: 'Post not found' });
      }

      try {
        await postToDelete.deleteOne();
        res.json({ message: 'Post deleted successfully' });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Could not delete post' });
    }
  });
};
