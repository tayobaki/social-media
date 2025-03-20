import cloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";

export const getFeedPosts = async (req, res) => {
	try {
		const posts = await Post.find({
			// author: { $in: [...req.user.connections, req.user._id] },
		})
			.populate("author", "username profilePicture headline")
			.populate("comments.user", "username profilePicture")
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		console.error("Error in getFeedPosts controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const createPost = async (req, res) => {
	try {
		const { content, image } = req.body;
		let newPost;
		if (image) {
			const imgResult = await cloudinary.uploader.upload(image);
			newPost = new Post({
				author: req.user._id,
				content,
				image: imgResult.secure_url,
			});
		} else {
			newPost = new Post({
				author: req.user._id,
				content,
			});
		}

		await newPost.save();

		res.status(201).json(newPost);
	} catch (error) {
		console.error("Error in createPost controller", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const deletePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		if (post.author.toString() !== userId.toString()) {
			return res
				.status(403)
				.json({ message: "You are not authorized to delete this post" });
		}

		await Post.findByIdAndDelete(postId);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error("Error in deletePost controller", error.message);
		res.status(500).json({ message: "Server error" });
	}
};

// export const getPostById = async (req, res) => {
// 	try {
// 		const postId = req.params.id;
// 		const post = await Post.findById(postId)
// 			.populate("author", "username profilePicture headline")
// 			.populate("comments.user", "username profilePicture headline");

// 		res.status(200).json(post);
// 	} catch (error) {
// 		console.error("Error in getPostById controller", error.message);
// 		res.status(500).json({ message: "Server error" });
// 	}
// };

export const createComment = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;
		const { content } = req.body;

		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$push: { comments: { user: userId, content } },
			},
			{ new: true }
		).populate("author", "username email headline profilePicture");

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in createComment controller", error.message);
		res.status(500).json({ message: "Server error" });
	}
};

export const search = async (req, res) => {
	try {
		const { q } = req.params;
		if (!q) return res.status(400).json({ message: "Search term is required" });

		// Perform a case-insensitive search on 'content'
		const posts = await Post.find({
			content: { $regex: q, $options: "i" },
		})
			.populate("author", "username profilePicture headline")
			.select("author content image createdAt")
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		console.error("Error in searchResults:", error.message);
		res.status(500).json({ message: "Server error" });
	}
};
