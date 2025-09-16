import { listPosts, findPostById } from "../repositories/posts.repo.js";

export const getAllPosts = async (req, res) => {
  try {
    console.log("Backend working")
    const page = parseInt(req.query.page ?? "1", 10);
    const pageSize = parseInt(req.query.pageSize ?? "20", 10);

    // ✅ Example filter: only published posts
    const filter = { _status: "published" };

    const { data, total } = await listPosts(filter, { page, pageSize });

    return res.status(200).json({
      success: true,
      message:"Get all Blogs",
      page,
      pageSize,
      total,
      posts: data,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: err?.message,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const doc = await findPostById(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      post: doc, // ✅ includes populated heroImage now
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching post",
      error: err?.message,
    });
  }
};
