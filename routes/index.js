const express = require("express");
const router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");
const post_controller = require("../controllers/postController");


router.get("/api", user_controller.verifyToken, user_controller.index);
router.post("/api/post", user_controller.verifyToken, post_controller.create_post);

router.post("/api/login", user_controller.login);
router.post("/api/sign-up", user_controller.signup);

router.put('/api/post/update', user_controller.verifyToken, post_controller.update_post);

router.delete('/api/post/delete', user_controller.verifyToken, post_controller.delete_post);


module.exports = router;
