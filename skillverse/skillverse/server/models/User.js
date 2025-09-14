    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');

    const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
        unique: true,
        match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit phone number']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    isEmailVerified: {
        type: Boolean,
        default: true
    },
    isPhoneVerified: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student'
    },
    avatar: {
        type: String,
        default: ''
    },
    enrolledCourses: [{
        course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
        },
        enrolledAt: {
        type: Date,
        default: Date.now
        },
        progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
        },
        completedLessons: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Lesson'
        }]
    }],
    paymentHistory: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Payment'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
    });
    // Encrypt password before saving
    userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
    });

    // Compare password method
    userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
    };

    module.exports = mongoose.model('User', userSchema);