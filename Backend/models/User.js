// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const UserSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         minlength: 3
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         lowercase: true
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6
//     }
// }, { timestamps: true });

// // ─── Hash password before saving ─────────────────────────────────────────────
// UserSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next(); // ← only hash if changed
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

// // ─── Compare plain password to hashed ────────────────────────────────────────
// UserSchema.methods.comparePassword = async function (plainPassword) {
//     return bcrypt.compare(plainPassword, this.password);
// };

// export default mongoose.model("User", UserSchema);
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, { timestamps: true });

// ← Remove the `next` parameter entirely for async hooks in Mongoose 7+
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model("User", UserSchema);