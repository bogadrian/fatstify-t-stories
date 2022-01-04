import { Schema } from 'mongoose';
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

interface User {
  userName: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  active: boolean;
  emailConfirmed: boolean;
  exPasswords: string[];
}
const userSchema = new Schema<User>({
  userName: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'editor', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el: string) {
        return el === (this as typeof User).password;
      },
      message: 'Passwords are not the same!'
    }
  },
  emailConfirmed: {
    type: Boolean,
    default: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  __v: { type: Number, select: false }
});

userSchema.pre('save', async function (next: () => void) {
  // Only run this function if password was actually modified

  if (!(this as typeof User).isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 14);

  // set the array of ex passwords
  (this as typeof User).exPasswords.push(this.password);

  //keep only 3 of them in the array
  if (this.exPasswords.length > 3)
    (this as typeof User).exPasswords.shift()(
      // Delete passwordConfirm field
      this as typeof User
    ).passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  (this as typeof User).passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  (this as typeof User).find({ active: { $ne: false } });
  next();
});

userSchema.methods.hashPasswordReset = async function (newPassword) {
  return await bcrypt.hash(newPassword, 14);
};

// Add a static method to shift one password from the begginig of the array whenever a new one is pushed to the array.
// userSchema.statics.popPasswords = async function (user) {
//   const doc = await this.findById({ _id: user });
//   if (doc.exPasswords.length > 3) {
//     await doc.update(
//       { $pop: { exPasswords: -1 } },
//       { upsert: true, new: true }
//     );
//   }
// };

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  const change = this.passwordChangedAt;

  if (change) {
    return change.getTime() > JWTTimestamp;
  }

  // False means NOT changed
  return false;
};

// userSchema.methods.createPasswordResetToken = function () {
//   // create a token.
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   // encrypt it.
//   this.passwordResetToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   // set the password expires filed to 10 minutes
//   (this as typeof User).passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   return resetToken;
// };

const User = mongoose.model('User', userSchema);

export default User;
