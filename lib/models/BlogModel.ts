import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
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
    }
})

const BlogModel = mongoose.models.Blog || mongoose.model('Blog', Schema);

export default BlogModel;