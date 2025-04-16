import { pgTable, text, uuid, timestamp, numeric, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  user_id: uuid("user_id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  full_name: text("full_name"),
  email: text("email"),
  created_at: timestamp("created_at").defaultNow(),
});

// Leads table
export const leads = pgTable("leads", {
  lead_id: uuid("lead_id").primaryKey().defaultRandom(),
  seller_name: text("seller_name").notNull(),
  seller_phone: text("seller_phone"),
  seller_email: text("seller_email"),
  property_address: text("property_address").notNull(),
  bedrooms: text("bedrooms"),
  bathrooms: text("bathrooms"),
  square_footage: text("square_footage"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
  created_by: uuid("created_by").references(() => users.user_id),
});

// Deals table
export const deals = pgTable("deals", {
  deal_id: uuid("deal_id").primaryKey().defaultRandom(),
  lead_id: uuid("lead_id").references(() => leads.lead_id),
  property_address: text("property_address").notNull(),
  seller_name: text("seller_name").notNull(),
  seller_phone: text("seller_phone"),
  seller_email: text("seller_email"),
  bedrooms: text("bedrooms"),
  bathrooms: text("bathrooms"),
  square_footage: text("square_footage"),
  target_price: numeric("target_price", { precision: 10, scale: 2 }),
  assigned_price: numeric("assigned_price", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("New"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  notes: text("notes"),
  assigned_to: uuid("assigned_to").references(() => users.user_id),
});

// Status History table for audit logs
export const dealStatusHistory = pgTable("deal_status_history", {
  history_id: uuid("history_id").primaryKey().defaultRandom(),
  deal_id: uuid("deal_id").references(() => deals.deal_id).notNull(),
  old_status: text("old_status"),
  new_status: text("new_status").notNull(),
  changed_by: uuid("changed_by").references(() => users.user_id),
  timestamp: timestamp("timestamp").defaultNow(),
  notes: text("notes"),
});

// Documents table for S3 metadata
export const documents = pgTable("documents", {
  doc_id: uuid("doc_id").primaryKey().defaultRandom(),
  deal_id: uuid("deal_id").references(() => deals.deal_id).notNull(),
  filename: text("filename").notNull(),
  file_type: text("file_type"),
  s3_key: text("s3_key"), // For real S3, this would be the path
  uploaded_by: uuid("uploaded_by").references(() => users.user_id),
  uploaded_at: timestamp("uploaded_at").defaultNow(),
});

// Zod schemas for insertions
export const insertUserSchema = createInsertSchema(users).omit({
  user_id: true,
  created_at: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  lead_id: true,
  created_at: true,
});

export const insertDealSchema = createInsertSchema(deals).omit({
  deal_id: true,
  created_at: true,
  updated_at: true,
});

export const insertDealStatusHistorySchema = createInsertSchema(dealStatusHistory).omit({
  history_id: true,
  timestamp: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  doc_id: true,
  uploaded_at: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Deal = typeof deals.$inferSelect;
export type DealStatusHistory = typeof dealStatusHistory.$inferSelect;
export type Document = typeof documents.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type InsertDealStatusHistory = z.infer<typeof insertDealStatusHistorySchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

// Status enum for type safety
export enum DealStatus {
  New = "New",
  Negotiating = "Negotiating",
  UnderContract = "Under Contract",
  Assigned = "Assigned",
  Closed = "Closed",
  Dead = "Dead"
}
