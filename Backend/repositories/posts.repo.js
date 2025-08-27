import mongoose from "mongoose";

// Get a handle to the raw "posts" collection (schema-less)
const getPostsCollection = () => mongoose.connection.db.collection("posts");

// List posts with optional filter + pagination + projection (no schema)
export const listPosts = async (
  filter = {},
  { page = 1, pageSize = 20, sort = { _id: -1 }, projection = {} } = {}
) => {
  const col = getPostsCollection();
  const skip = (page - 1) * pageSize;

  const cursor = col.find(filter, { projection }).sort(sort).skip(skip).limit(pageSize);
  const data = await cursor.toArray();
  const total = await col.countDocuments(filter);

  return { data, page, pageSize, total };
};

// Find a single post by _id (works even though no schema)
export const findPostById = async (id) => {
  const col = getPostsCollection();
  const { ObjectId } = mongoose.Types;

  // If id isn't a valid ObjectId, return null gracefully
  let _id;
  try { _id = new ObjectId(id); } catch { return null; }

  return await col.findOne({ _id });
};

// (Optional) Insert without schema, if you ever need it
export const insertPost = async (doc) => {
  const col = getPostsCollection();
  const { insertedId } = await col.insertOne(doc);
  return { _id: insertedId, ...doc };
};
