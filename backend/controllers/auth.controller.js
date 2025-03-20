import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		if (!username || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}

		const existingUsername = await User.findOne({ username });
		if (existingUsername) {
			return res.status(400).json({ message: "Username already exists" });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User({
			username,
			email,
			password: hashedPassword,
		});

		await user.save();

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "3d",
		});

		res.cookie("jwt-twitter", token, {
			httpOnly: true, // prevent XSS attack
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict", // prevent CSRF attacks,
			secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle attacks
		});

		res.status(201).json({ message: "User registered successfully" });

		// const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

		// try {
		// 	await sendWelcomeEmail(user.email, user.name, profileUrl);
		// } catch (emailError) {
		// 	console.error("Error sending welcome Email", emailError);
		// }
	} catch (error) {
		console.log("Error in signup: ", error.message);
		res.status(500).json({ message: "Server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Check if user exists
		const user = await User.findOne({ username });
		if (!user) {
			return res
				.status(400)
				.json({ message: "Incorrect username or password" });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(400)
				.json({ message: "Incorrect username or password" });
		}

		// Create and send token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "3d",
		});
		await res.cookie("jwt-twitter", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
		});

		res.json({ message: "Logged in successfully" });
	} catch (error) {
		console.error("Error in login controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const logout = (req, res) => {
	res.clearCookie("jwt-twitter");
	res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		console.error("Error in getCurrentUser controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};
