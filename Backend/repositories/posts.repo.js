import mongoose from "mongoose";

// Get raw "posts" collection
const getPostsCollection = () => mongoose.connection.db.collection("posts");
// Get raw "media" collection
const getMediaCollection = () => mongoose.connection.db.collection("media");

// ✅ Utility: populate heroImage manually
const populateHeroImage = async (posts) => {
  const mediaIds = posts
    .map((p) => p.heroImage)
    .filter(Boolean); // remove nulls

  if (mediaIds.length === 0) return posts;

  const { ObjectId } = mongoose.Types;
  const col = getMediaCollection();
  const mediaDocs = await col
    .find({ _id: { $in: mediaIds.map((id) => new ObjectId(id)) } })
    .toArray();

  const mediaMap = new Map(mediaDocs.map((m) => [m._id.toString(), m]));

  return posts.map((p) => ({
    ...p,
    heroImage: p.heroImage
      ? mediaMap.get(p.heroImage.toString()) ?? p.heroImage
      : null,
  }));
};

// ✅ List posts with pagination + heroImage populated
export const listPosts = async (
  filter = {},
  { page = 1, pageSize = 20, sort = { _id: -1 }, projection = {} } = {}
) => {
  const col = getPostsCollection();
  console.log("COllection is ",col)
  const skip = (page - 1) * pageSize;

  const cursor = col.find(filter, { projection }).sort(sort).skip(skip).limit(pageSize);
  let data = await cursor.toArray();
  console.log("Data from list post",cursor)
  const total = await col.countDocuments(filter);
  console.log("total ", total)
  // Populate heroImage field
  data = await populateHeroImage(data);
  console.log(data)
  return { data, page, pageSize, total };
};

// ✅ Find a single post by ID with heroImage populated
export const findPostById = async (id) => {
  const col = getPostsCollection();
  const { ObjectId } = mongoose.Types;

  let _id;
  try {
    _id = new ObjectId(id);
  } catch {
    return null;
  }

  const doc = await col.findOne({ _id });
  if (!doc) return null;

  const [populatedDoc] = await populateHeroImage([doc]);
  return populatedDoc;
};

// (Optional) Insert without schema
export const insertPost = async (doc) => {
  const col = getPostsCollection();
  const { insertedId } = await col.insertOne(doc);
  return { _id: insertedId, ...doc };
};
