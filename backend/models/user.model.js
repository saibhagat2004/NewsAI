import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
            
    },
    password: {
      type: String,
      minLength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    preferredTone: {
      type: String,
      default: "original", // Setting English as the default, but they can change it!
      // The language they feel most comfortable using.
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows users to sign up with Google without conflicts
    },
  
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
