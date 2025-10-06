import { defineQuery } from "groq";
import type {
  ALL_CATEGORIES_QUERYResult,
  CATEGORY_BY_ID_QUERYResult,
} from "../../sanity/sanity.types";
import { sanityClient } from "./client";

interface Category {
  _id: string;
  title: string;
  color?: string;
}

// GROQ Queries - defined as module-level constants for Sanity typegen
export const ALL_CATEGORIES_QUERY = defineQuery(`*[
  _type == "category"
] | order(title asc) {
  _id,
  title,
  color
}`);

export const CATEGORY_BY_ID_QUERY = defineQuery(`*[
  _type == "category" 
  && _id == $categoryId
][0]{
  _id,
  title,
  color
}`);

// Helper function to fetch all categories
export const fetchCategories =
  async (): Promise<ALL_CATEGORIES_QUERYResult> => {
    try {
      const categories = await sanityClient.fetch(ALL_CATEGORIES_QUERY);
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

// Helper function to create a new category
export const createCategory = async (category: {
  title: string;
  color?: string;
}): Promise<Category> => {
  try {
    const newCategory = {
      _type: "category",
      title: category.title,
      color: category.color,
    };

    const result = await sanityClient.create(newCategory);
    return result as Category;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Helper function to update category
export const updateCategory = async (
  categoryId: string,
  updates: Partial<{ title: string; color: string }>
): Promise<Category> => {
  try {
    const result = await sanityClient.patch(categoryId).set(updates).commit();
    return result as unknown as Category;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Helper function to delete category
export const deleteCategory = async (categoryId: string) => {
  try {
    const result = await sanityClient.delete(categoryId);
    return result;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Helper function to get category by ID
export const getCategoryById = async (
  categoryId: string
): Promise<CATEGORY_BY_ID_QUERYResult> => {
  try {
    const category = await sanityClient.fetch(CATEGORY_BY_ID_QUERY, {
      categoryId,
    });
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};
