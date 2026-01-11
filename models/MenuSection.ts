import mongoose from 'mongoose';

// models/MenuSection.js
const menuItemSchema = new mongoose.Schema({
    // English fields (default)
    name_en: { type: String, required: true },
    description_en: { type: String, required: true },

    // Arabic fields
    name_ar: { type: String, required: true },
    description_ar: { type: String, required: true },

    // Russian fields
    name_ru: { type: String, required: true },
    description_ru: { type: String, required: true },

    // Common fields
    price: { type: String, required: true },
    image: { type: String },
  }, { _id: true });

  const subSectionSchema = new mongoose.Schema({
    section_en: { type: String, default: "" },
    section_ar: { type: String, default: "" },
    section_ru: { type: String, default: "" },
    items: [menuItemSchema],
  });

  const menuSectionSchema = new mongoose.Schema({
    title_en: { type: String, required: true },
    title_ar: { type: String, required: true },
    title_ru: { type: String, required: true },
    sections: [subSectionSchema],
  }, {
    timestamps: true,
  });

// Check if the model exists before creating a new one
export const MenuSection = mongoose.models.MenuSection || mongoose.model('MenuSection', menuSectionSchema);
