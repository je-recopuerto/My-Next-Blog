import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false // Şifre opsiyonel - GitHub kullanıcıları için
    },
    avatar: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["Owner", "Writer", "Member"],
        default: "Member"
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true // GitHub ile giriş yapmayanlar için
    },
    isActive: {
        type: Boolean,
        default: true
    },
    permissions: [{
        type: String,
        enum: [
            "blog:create",
            "blog:edit", 
            "blog:delete",
            "blog:publish",
            "category:create",
            "category:edit",
            "category:delete",
            "user:manage",
            "admin:access"
        ]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

// Rol bazlı izinleri otomatik ayarla
UserSchema.pre('save', function(next) {
    if (this.isModified('role')) {
        switch (this.role) {
            case 'Owner':
                this.permissions = [
                    "blog:create", "blog:edit", "blog:delete", "blog:publish",
                    "category:create", "category:edit", "category:delete",
                    "user:manage", "admin:access"
                ];
                break;
            case 'Writer':
                this.permissions = [
                    "blog:create", "blog:edit", "blog:publish",
                    "admin:access"
                ];
                break;
            case 'Member':
                this.permissions = [];
                break;
        }
    }
    next();
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
