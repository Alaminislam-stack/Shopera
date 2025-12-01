import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  real,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shops = pgTable("shops", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  buyingPrice: real("buying_price").notNull(),
  sellingPrice: real("selling_price").notNull(),
  stock: integer("stock").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("Active"),
  shopId: uuid("shop_id")
    .notNull()
    .references(() => shops.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sales = pgTable("sales", {
  id: uuid("id").primaryKey().defaultRandom(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productId: uuid("product_id"),
  quantity: integer("quantity").notNull(),
  buyingPrice: real("buying_price").notNull(),
  sellingPrice: real("selling_price").notNull(),
  profit: real("profit").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  shopId: uuid("shop_id")
    .notNull()
    .references(() => shops.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  shopId: uuid("shop_id")
    .notNull()
    .references(() => shops.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
