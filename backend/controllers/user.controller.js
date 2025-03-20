import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getSuggestedConnections = async (req, res) => {
	try {
		const currentUser = await User.findById(req.user._id).select("connections");

		const suggestedUsers = await User.find({
			_id: {
				$ne: req.user._id,
				$nin: currentUser.connections,
			},
		})
			.select("username profilePicture headline email")
			.limit(3);

		res.json(suggestedUsers);
	} catch (error) {
		console.error("Error in getSuggestedConnections controller", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getPublicProfile = async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username }).select(
			"-password"
		);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error in getPublicProfile controller", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const allowedFields = [
			"username",
			"headline",
			"about",
			"location",
			"profilePicture",
			"bannerImg",
		];

		const updatedData = {};

		// Filter req.body to only include allowed fields
		for (const field of allowedFields) {
			if (req.body[field] !== undefined) {
				updatedData[field] = req.body[field];
			}
		}

		if (req.body.profilePicture) {
			const result = await cloudinary.uploader.upload(req.body.profilePicture);
			updatedData.profilePicture = result.secure_url;
		}

		if (req.body.bannerImg) {
			const result = await cloudinary.uploader.upload(req.body.bannerImg);
			updatedData.bannerImg = result.secure_url;
		}

		const user = await User.findByIdAndUpdate(
			req.user._id,
			{ $set: updatedData },
			{
				new: true,
				runValidators: true,
			}
		).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error in updateProfile controller", error);
		res.status(500).json({ message: "Server error" });
	}
};
