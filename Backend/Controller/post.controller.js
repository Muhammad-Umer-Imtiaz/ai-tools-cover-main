import { listPosts, findPostById } from "../repositories/posts.repo.js";

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page ?? "1", 10);
    const pageSize = parseInt(req.query.pageSize ?? "20", 10);

    // Example: filter by any field you stored manually, e.g. { status: "published" }
    const filter = { _status: "published" }; // customize from req.query if you like

    const result = await listPosts(filter, { page, pageSize });
    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: err?.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const doc = await findPostById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Post not found" });
    res.json(doc);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching post", error: err?.message });
  }
};
