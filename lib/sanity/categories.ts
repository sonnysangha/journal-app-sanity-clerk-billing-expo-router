import { sanityClient } from "./client";

interface Category {
  _id: string;
  title: string;
  color?: string;
}

// Helper function to fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const query = `*[
      _type == "category"
    ] | order(title asc) {
      _id,
      title,
      color
    }`;

    const categories = await sanityClient.fetch(query);
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
    return result;
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
    const result = await sanityClient
      .patch(categoryId)
      .set(updates)
      .commit();
    return result;
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
export const getCategoryById = async (categoryId: string): Promise<Category | null> => {
  try {
    const query = `*[
      _type == "category" 
      && _id == $categoryId
    ][0]{
      _id,
      title,
      color
    }`;

    const category = await sanityClient.fetch(query, { categoryId });
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};
