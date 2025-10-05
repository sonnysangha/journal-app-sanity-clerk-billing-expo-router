import { defineField, defineType, defineArrayMember } from "sanity";
import { RobotIcon } from "@sanity/icons";

export const aiConversation = defineType({
  name: "aiConversation",
  title: "AI Conversation",
  type: "document", 
  icon: RobotIcon,
  fields: [
    defineField({
      name: "userId",
      type: "string",
      title: "User ID",
      description: "Clerk user ID of the conversation owner",
      validation: (Rule) => [
        Rule.required().error("User ID is required for authentication")
      ]
    }),
    defineField({
      name: "messages",
      type: "array",
      description: "Conversation history between user and AI",
      of: [
        defineArrayMember({
          type: "object",
          name: "message",
          fields: [
            defineField({
              name: "role",
              type: "string",
              options: {
                list: [
                  { title: "User", value: "user" },
                  { title: "Assistant", value: "assistant" }
                ],
                layout: "radio"
              },
              validation: (Rule) => [
                Rule.required().error("Message role is required")
              ]
            }),
            defineField({
              name: "content",
              type: "text",
              validation: (Rule) => [
                Rule.required().error("Message content is required")
              ]
            }),
            defineField({
              name: "timestamp",
              type: "datetime",
              initialValue: () => new Date().toISOString(),
              validation: (Rule) => [
                Rule.required().error("Timestamp is required")
              ]
            }),
            defineField({
              name: "relatedEntries",
              type: "array",
              description: "Journal entries referenced in this message",
              of: [
                defineArrayMember({
                  type: "reference",
                  to: [{ type: "journalEntry" }]
                })
              ]
            })
          ],
          preview: {
            select: {
              role: "role",
              content: "content",
              timestamp: "timestamp"
            },
            prepare({ role, content, timestamp }) {
              const roleEmoji = role === "user" ? "👤" : "🤖";
              const time = new Date(timestamp).toLocaleTimeString();
              const preview = content?.slice(0, 50) || "No content";
              
              return {
                title: `${roleEmoji} ${role}`,
                subtitle: `${time}: ${preview}${content?.length > 50 ? "..." : ""}`
              };
            }
          }
        })
      ]
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      title: "Active Conversation",
      description: "Only one conversation can be active per user",
      initialValue: true,
      validation: (Rule) => [
        Rule.custom((isActive, context) => {
          // This validation would need to be implemented in a custom validation function
          // to check that only one conversation per user is active
          return true;
        })
      ]
    }),
    defineField({
      name: "lastUpdated",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => [
        Rule.required().error("Last updated timestamp is required")
      ]
    })
  ],
  preview: {
    select: {
      userId: "userId",
      lastMessage: "messages",
      lastUpdated: "lastUpdated",
      isActive: "isActive"
    },
    prepare({ userId, lastMessage, lastUpdated, isActive }) {
      const date = new Date(lastUpdated).toLocaleDateString();
      const messageCount = lastMessage?.length || 0;
      const statusEmoji = isActive ? "🟢" : "⚪";
      
      return {
        title: `${statusEmoji} Conversation with ${userId.slice(0, 8)}...`,
        subtitle: `${messageCount} messages • Last updated: ${date}`
      };
    }
  },
  orderings: [
    {
      title: "Last Updated, Recent",
      name: "lastUpdatedDesc",
      by: [{ field: "lastUpdated", direction: "desc" }]
    },
    {
      title: "Active First",
      name: "activeFirst",
      by: [{ field: "isActive", direction: "desc" }]
    }
  ]
});
