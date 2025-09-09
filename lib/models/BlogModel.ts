import mongoose from "mongoose";
import './CategoryModel'; // Category model'ini yükle
import './UserModel'; // User model'ini yükle

const Schema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
    },
    summary:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image:{
        type:String,
        required:true,
    },
    authorImg:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    },
    visible: {
        type: Boolean,
        default: false
    }
})

const BlogModel = mongoose.models.Blog || mongoose.model('Blog', Schema);

export default BlogModel;