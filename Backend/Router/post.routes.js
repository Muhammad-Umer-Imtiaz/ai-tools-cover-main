import { Router } from "express";
import { getAllPosts, getPostById } from "../Controller/post.controller.js";

const router = Router();

router.get("/", getAllPosts); // GET /posts
router.get("/:id", getPostById); // GET /posts/:id

export default router;
