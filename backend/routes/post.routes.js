import express from "express";
import {
	createPost,
	deletePost,
	// getPostById,
	createComment,
	getFeedPosts,
	search,
} from "../controllers/post.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
// router.get("/:id", protectRoute, getPostById);
router.post("/:id/comment", protectRoute, createComment);
router.get("/search/:q", search);

export default router;
