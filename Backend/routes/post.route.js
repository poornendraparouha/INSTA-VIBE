import express from 'express';
import { addNewPost, getAllPost, getUserPost, likePost, dislikePost, addComments, getCommentsOfPost, deletePost, bookmarkPost } from '../controllers/post.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// Add New Post (with image)
router.route('/newpost').post(isAuthenticated, upload.single('image'), addNewPost);

// Get All Posts (Public)
router.route('/allpost').get(getAllPost);

// Get Posts by Logged-In User
router.route('/userpost').get(isAuthenticated, getUserPost);

// Like & Dislike a Post
router.route('/:id/like').post(isAuthenticated, likePost);
router.route('/:id/dislike').post(isAuthenticated, dislikePost);

// Add and Get Comments for a Post
router.route('/:id/comment').post(isAuthenticated, addComments);
router.route('/:id/comments').get(getCommentsOfPost);

// Bookmark & Unbookmark a Post
router.route('/:id/bookmark').post(isAuthenticated, bookmarkPost);

// Delete a Post (Author only)
router.route('/:id').delete(isAuthenticated, deletePost);

export default router;
