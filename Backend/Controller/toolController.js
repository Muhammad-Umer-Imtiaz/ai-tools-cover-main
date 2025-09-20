import fs from "fs";
import csv from "csv-parser";
import { Tool } from "../Model/toolsModel.js";
import mongoose from "mongoose";

//add tool through CSV
export const addTool = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const filePath = req.file.path;
    const tools = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        tools.push({
          name: row["Tool Name"],
          category: row.Category,
          tags: row.Tags,
          rating: row.Rating,
          pricing: row["Pricing (Raw)"],
          overview: row.Overview,
          what_you_can_do_with: row["What You Can Do With"],
          key_features: row["Key Features"],
          benefits: row.Benefits,
          pricing_plans: row["Pricing Plans"],
          tips_best_practices: row["Tips & Best Practices"],
          faqs: row.FAQs,
          final_take: row["Final Take"],
          link: row["Tool URL"],
          thumbnail_url: row["Thumnail URL"] || row["Thumbnail URL"], // Handle typo
          image_url: row["Logo URL"],
        });
      })
      .on("end", async () => {
        try {
          const savedTools = await Tool.insertMany(tools);
          // Clean up temporary file
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting temp file:", err);
          });
          return res.status(201).json({
            success: true,
            message: "CSV uploaded and data saved",
          });
        } catch (dbErr) {
          // Clean up on error
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting temp file:", err);
          });
          return res
            .status(500)
            .json({ message: "Database Error", error: dbErr.message });
        }
      })
      .on("error", (err) => {
        // Clean up on stream error
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });
        return res
          .status(500)
          .json({ message: "CSV Parsing Error", error: err.message });
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
//add tool through login user
export const AddTool = async (req, res) => {
  try {
    const { name, link, thumbnail_url, image_url, overview } = req.body;
    const userID = req.user;
    if (!name || !link || !thumbnail_url || !image_url || !overview)
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    const add = await Tool.create({
      name,
      link,
      thumbnail_url,
      image_url,
      overview,
      submitted_by: userID,
    });
    return res
      .status(200)
      .json({ message: "Tool add SuccessFully", success: true, add });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
//submit tool via Admin
export const submitTool = async (req, res) => {
  try {
    const { is_approved } = req.body;
    const toolId = req.params.id;

    if (!toolId) {
      return res.status(400).json({ message: "ToolId not found" });
    }

    const tool = await Tool.findByIdAndUpdate(
      toolId,
      { is_approved },
      { new: true }
    );

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    return res.status(200).json({ message: "Submit Todo Successfully", tool });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getSingleTool = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("Slug received:", slug);

    if (!slug) {
      return res
        .status(404)
        .json({ message: "Tool Slug not Found", success: false });
    }

    const tool = await Tool.findOne({
      name: { $regex: `^${slug}$`, $options: "i" },
    });
    if (!tool) {
      return res
        .status(404)
        .json({ message: "Tool not Found", success: false });
    }

    return res.status(200).json({ message: "Tool Found", success: true, tool });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
};

export const FeaturedTools = async (req, res) => {
  try {
    // ✅ fetch latest 6 approved tools (if you have is_approved filter, keep it)
    const tools = await Tool.find({ is_approved: true })
      .sort({ createdAt: -1 }) // newest first
      .limit(6);

    return res.status(200).json({
      message: "Featured Tools Found",
      success: true,
      count: tools.length,
      tools,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
};

export const findToolByUser = async (req, res) => {
  try {
    const id = req.user._id;
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user found",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    const tool = await Tool.find({ submitted_by: id });
    if (!tool)
      return res.status(400).json({ message: "No Tool Find you submit" });
    return res
      .status(200)
      .json({ success: true, message: "Get Tool Successfully", tool });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllTools = async (req, res) => {
  try {
    const tool = await Tool.find();
    if (!tool)
      return res
        .status(401)
        .json({ success: false, message: "Tools not Found" });
    return res
      .status(200)
      .json({ success: true, message: "Get all Tools Successfully", tool });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server issue" });
  }
};

export const pagination = async (req, res) => {
  try {
    const page = parseInt(req.query.offset) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { is_approved: true };

    const [results, total] = await Promise.all([
      Tool.find(query)
        .sort({ createdAt: -1 }) // ✅ latest first
        .skip(skip)
        .limit(limit),
      Tool.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      currentResults: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const Search = async (req, res) => {
  try {
    // const { word } = req.body;
    const word = req.query.q;
    if (!word)
      return res.status(400).json({ message: "Enter a keyword to search" });
    const results = await Tool.find({
      is_approved: true,
      $or: [
        { name: { $regex: word, $options: "i" } },
        // { description: { $regex: word, $options: "i" } },
        // { tags: { $regex: word, $options: "i" } },
        // { category: { $regex: word, $options: "i" } },
      ],
    });
    return res
      .status(200)
      .json({ success: "true", message: "search Successfully", results });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const categoryPagination = async (req, res) => {
  try {
    const categoryName = req.query.category;
    if (!categoryName) {
      return res.status(400).json({ message: "Enter a category Name" });
    }

    const offset = parseInt(req.query.offset) || 0; // default offset = 0
    const limit = parseInt(req.query.limit) || 20;

    const query = { is_approved: true, category: categoryName };

    const [results, total] = await Promise.all([
      Tool.find(query).skip(offset).limit(limit).sort({ createdAt: -1 }),
      Tool.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      offset,
      limit,
      totalResults: total,
      currentResults: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const suggestions = async (req, res) => {
  try {
    const tag = req.query.tag; // ?tag=marketing
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    if (!tag) {
      return res
        .status(400)
        .json({ message: "Tag query parameter is required" });
    }

    // Search in tags string (case-insensitive)
    const regex = new RegExp(tag, "i");

    const query = {
      is_approved: true,
      tags: { $regex: regex }, // matches "AI#marketing#tools"
    };

    const [results, total] = await Promise.all([
      Tool.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Tool.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      currentResults: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const toolFeature = async (req, res) => {
  try {
    const name = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // Default to 12 tools per page
    const skip = (page - 1) * limit;

    if (!name) {
      return res.status(404).json({
        success: false,
        message: `Cannot get feature or category name from URL(Params)`,
      });
    }

    // Get total count of tools for pagination metadata
    const totalTools = await Tool.countDocuments({ category: name });

    if (totalTools === 0) {
      return res.status(404).json({
        success: false,
        message: `${name} related Tools not Found`,
      });
    }

    // Get paginated tools
    const matchTools = await Tool.find({ category: name })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Optional: Sort by newest first

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalTools / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      message: "Tools found successfully",
      data: {
        tools: matchTools,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalTools: totalTools,
          toolsPerPage: limit,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null,
        }
      }
    });

  } catch (error) {
    console.error('Error in toolFeature:', error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const aiToolsFeatures = async (req, res) => {
  try {
    let features = req.query.q; // comes as string

    // Parse into array if it's JSON string
    if (typeof features === "string") {
      try {
        features = JSON.parse(features);
      } catch (err) {
        return res.status(400).json({ error: "Invalid features array format" });
      }
    }

    console.log("Features are: ", features);

    if (!features || !Array.isArray(features)) {
      return res.status(400).json({ error: "features array required" });
    }

    const results = {};

    for (const category of features) {
      const tools = await Tool.find({ category }).limit(6).lean();
      results[category] = tools;
    }

    res.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
