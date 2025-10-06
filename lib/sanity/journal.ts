import { defineQuery } from "groq";
import type {
  JOURNAL_ENTRY_BY_ID_QUERYResult,
  USER_JOURNAL_ENTRIES_QUERYResult,
} from "../../sanity/sanity.types";
import { sanityClient } from "./client";
import { uploadImageToSanity } from "./images";

interface JournalEntryInput {
  title?: string;
  content: string;
  images: { uri: string; caption?: string; alt?: string }[];
  mood: string;
  userId: string;
}

// GROQ Queries - defined as module-level constants for Sanity typegen
export const USER_JOURNAL_ENTRIES_QUERY = defineQuery(`*[
  _type == "journalEntry" 
  && userId == $userId
] | order(createdAt desc) {
  _id,
  title,
  content,
  mood,
  createdAt,
  aiGeneratedCategory->{
    title,
    color
  }
}`);

export const JOURNAL_ENTRY_BY_ID_QUERY = defineQuery(`*[
  _type == "journalEntry" 
  && _id == $entryId
][0]{
  _id,
  title,
  content,
  mood,
  createdAt,
  userId,
  aiGeneratedCategory->{
    title,
    color
  }
}`);

// Helper function to create journal entry in Sanity
export const createJournalEntry = async (entry: JournalEntryInput) => {
  try {
    // Upload all images first
    const uploadedImages = await Promise.all(
      entry.images.map(async (img) => {
        const asset = await uploadImageToSanity(img.uri);
        return {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
          alt: img.alt || "Journal entry image",
          caption: img.caption || "",
        };
      })
    );

    // Create content blocks - mix text and images
    const contentBlocks = [
      {
        _type: "block",
        _key: "content-block",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "content-span",
            text: entry.content,
            marks: [],
          },
        ],
        markDefs: [],
      },
      ...uploadedImages.map((img, index) => ({
        ...img,
        _key: `image-${index}`,
      })),
    ];

    // Create the journal entry document
    const journalEntry = {
      _type: "journalEntry",
      title: entry.title,
      content: contentBlocks,
      mood: entry.mood,
      userId: entry.userId,
      createdAt: new Date().toISOString(),
    };

    // Save to Sanity
    const result = await sanityClient.create(journalEntry);
    return result;
  } catch (error) {
    console.error("Error creating journal entry:", error);
    throw error;
  }
};

// Helper function to fetch user's journal entries
export const fetchJournalEntries = async (
  userId: string
): Promise<USER_JOURNAL_ENTRIES_QUERYResult> => {
  try {
    const entries = await sanityClient.fetch(USER_JOURNAL_ENTRIES_QUERY, {
      userId,
    });
    return entries;
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    throw error;
  }
};

// Helper function to update journal entry
export const updateJournalEntry = async (
  entryId: string,
  updates: Partial<JournalEntryInput>
) => {
  try {
    // If content is being updated, convert it to blocks
    const updateData: any = { ...updates };

    if (updates.content) {
      updateData.content = [
        {
          _type: "block",
          _key: "updated-content-block",
          style: "normal",
          children: [
            {
              _type: "span",
              _key: "updated-content-span",
              text: updates.content,
              marks: [],
            },
          ],
          markDefs: [],
        },
      ];
    }

    const result = await sanityClient.patch(entryId).set(updateData).commit();
    return result;
  } catch (error) {
    console.error("Error updating journal entry:", error);
    throw error;
  }
};

// Helper function to delete journal entry
export const deleteJournalEntry = async (entryId: string) => {
  try {
    const result = await sanityClient.delete(entryId);
    return result;
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    throw error;
  }
};

// Helper function to get journal entry by ID
export const getJournalEntryById = async (
  entryId: string
): Promise<JOURNAL_ENTRY_BY_ID_QUERYResult> => {
  try {
    const entry = await sanityClient.fetch(JOURNAL_ENTRY_BY_ID_QUERY, {
      entryId,
    });
    return entry;
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    throw error;
  }
};
