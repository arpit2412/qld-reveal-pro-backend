import {
  pgTable,
  foreignKey,
  unique,
  pgPolicy,
  check,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  date,
  jsonb,
  index,
  bigint,
  inet,
  numeric,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    email: text(),
    fullName: text("full_name"),
    companyName: text("company_name"),
    userType: text("user_type").default("agent"),
    phone: text(),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    approvalStatus: text("approval_status").default("pending"),
    approvedBy: uuid("approved_by"),
    approvedAt: timestamp("approved_at", {
      withTimezone: true,
      mode: "string",
    }),
    rejectionReason: text("rejection_reason"),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [table.userId],
      name: "profiles_user_id_fkey",
    }).onDelete("cascade"),
    unique("profiles_user_id_key").on(table.userId),
    pgPolicy("Users can insert their own profile", {
      as: "permissive",
      for: "insert",
      to: ["public"],
      withCheck: sql`(auth.uid() = user_id)`,
    }),
    pgPolicy("Users can update their own profile", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
    pgPolicy("Users can view their own profile", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
    check(
      "profiles_approval_status_check",
      sql`approval_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])`
    ),
    check(
      "profiles_user_type_check",
      sql`user_type = ANY (ARRAY['agent'::text, 'solicitor'::text, 'conveyancer'::text, 'admin'::text])`
    ),
  ]
);

export const userGroups = pgTable(
  "user_groups",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    type: text().default("agency").notNull(),
    description: text(),
    contactEmail: text("contact_email"),
    phone: text(),
    address: text(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    pgPolicy("Admins can manage all groups", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.user_type = 'admin'::text))))`,
    }),
    pgPolicy("Users can view groups they belong to", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
    check(
      "user_groups_type_check",
      sql`type = ANY (ARRAY['agency'::text, 'law_firm'::text, 'conveyancer'::text])`
    ),
  ]
);

export const userGroupMembers = pgTable(
  "user_group_members",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    groupId: uuid("group_id").notNull(),
    role: text().default("member").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [userGroups.id],
      name: "user_group_members_group_id_fkey",
    }).onDelete("cascade"),
    unique("user_group_members_user_id_group_id_key").on(
      table.userId,
      table.groupId
    ),
    pgPolicy("Admins can manage group memberships", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.user_type = 'admin'::text))))`,
    }),
    pgPolicy("Users can view their own group memberships", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
    check(
      "user_group_members_role_check",
      sql`role = ANY (ARRAY['admin'::text, 'member'::text])`
    ),
  ]
);

export const usageReports = pgTable(
  "usage_reports",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    groupId: uuid("group_id").notNull(),
    userId: uuid("user_id").notNull(),
    apiEndpoint: text("api_endpoint").notNull(),
    requestsCount: integer("requests_count").default(1).notNull(),
    reportDate: date("report_date")
      .default(sql`CURRENT_DATE`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [userGroups.id],
      name: "usage_reports_group_id_fkey",
    }).onDelete("cascade"),
    unique("usage_reports_group_id_user_id_api_endpoint_report_date_key").on(
      table.groupId,
      table.userId,
      table.apiEndpoint,
      table.reportDate
    ),
    pgPolicy("Admins can manage all usage reports", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.user_type = 'admin'::text))))`,
    }),
    pgPolicy("Users can view their own usage reports", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ]
);

export const dataIntegrations = pgTable(
  "data_integrations",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    apiType: text("api_type").notNull(),
    isEnabled: boolean("is_enabled").default(true).notNull(),
    configuration: jsonb(),
    usageQuota: integer("usage_quota"),
    currentUsage: integer("current_usage").default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    pgPolicy("All authenticated users can view integrations", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
      using: sql`true`,
    }),
    pgPolicy("Only admins can manage integrations", {
      as: "permissive",
      for: "all",
      to: ["public"],
    }),
    check(
      "data_integrations_api_type_check",
      sql`api_type = ANY (ARRAY['google_maps'::text, 'corelogic'::text, 'qld_globe'::text, 'docusign'::text, 'council_api'::text])`
    ),
  ]
);

export const disclosureForms = pgTable("disclosure_form_data", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),

  // Entire form state (all parts)
  form_data_12: jsonb("form_data_12")
    .default(sql`'{}'::jsonb`)
    .notNull(),

  // Track progress
  currentPart: integer("current_part").default(1).notNull(),
  partsCompletion: jsonb("parts_completion")
    .default(sql`'{}'::jsonb`)
    .notNull(),

  propertyAddress: text("property_address").notNull(),
  propertyDetails: jsonb("property_details"),

  status: text().default("draft").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  submittedAt: timestamp("submitted_at", {
    withTimezone: true,
    mode: "string",
  }),
  signedAt: timestamp("signed_at", { withTimezone: true, mode: "string" }),

  pdfGeneratedAt: timestamp("pdf_generated_at", {
    withTimezone: true,
    mode: "string",
  }),
  pdfUrl: text("pdf_url"),

  signatureData: jsonb("signature_data"),
  witnessData: jsonb("witness_data"),

  documentVersion: integer("document_version").default(1).notNull(),
});

export const disclosureDocuments = pgTable("disclosure_documents", {
  id: uuid().defaultRandom().primaryKey().notNull(),

  // Link to the form
  disclosureFormId: uuid("disclosure_form_id").notNull(),

  userId: uuid("user_id").notNull(),

  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: bigint("file_size", { mode: "number" }).notNull(),
  storagePath: text("storage_path").notNull(),

  // Type/category (e.g., water_notice, body_corporate_bylaws, survey_plan, other)
  documentCategory: text("document_category").notNull(),

  // Extra metadata for "other" type
  description: text("description"),

  uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  isRequired: boolean("is_required").default(false),
});

// export const disclosureForms = pgTable("disclosure_forms", {
// 	id: uuid().defaultRandom().primaryKey().notNull(),
// 	userId: uuid("user_id").notNull(),
// 	formData: jsonb("form_data").notNull(),
// 	propertyAddress: text("property_address").notNull(),
// 	propertyDetails: jsonb("property_details"),
// 	status: text().default('draft').notNull(),
// 	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
// 	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
// 	submittedAt: timestamp("submitted_at", { withTimezone: true, mode: 'string' }),
// 	signedAt: timestamp("signed_at", { withTimezone: true, mode: 'string' }),
// 	pdfGeneratedAt: timestamp("pdf_generated_at", { withTimezone: true, mode: 'string' }),
// 	pdfUrl: text("pdf_url"),
// 	signatureData: jsonb("signature_data"),
// 	witnessData: jsonb("witness_data"),
// 	documentVersion: integer("document_version").default(1).notNull(),
// }, (table) => [
// 	index("idx_disclosure_forms_created_at").using("btree", table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
// 	index("idx_disclosure_forms_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
// 	index("idx_disclosure_forms_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
// 	pgPolicy("Users can create their own disclosure forms", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`(auth.uid() = user_id)`  }),
// 	pgPolicy("Users can update their own disclosure forms", { as: "permissive", for: "update", to: ["public"] }),
// 	pgPolicy("Users can view their own disclosure forms", { as: "permissive", for: "select", to: ["public"] }),
// 	check("disclosure_forms_status_check", sql`status = ANY (ARRAY['draft'::text, 'submitted'::text, 'signed'::text, 'completed'::text])`),
// ]);

// export const disclosureDocuments = pgTable("disclosure_documents", {
// 	id: uuid().defaultRandom().primaryKey().notNull(),
// 	disclosureFormId: uuid("disclosure_form_id").notNull(),
// 	userId: uuid("user_id").notNull(),
// 	fileName: text("file_name").notNull(),
// 	fileType: text("file_type").notNull(),
// 	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
// 	fileSize: bigint("file_size", { mode: "number" }).notNull(),
// 	storagePath: text("storage_path").notNull(),
// 	documentCategory: text("document_category"),
// 	uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
// 	isRequired: boolean("is_required").default(false),
// }, (table) => [
// 	index("idx_disclosure_documents_form_id").using("btree", table.disclosureFormId.asc().nullsLast().op("uuid_ops")),
// 	foreignKey({
// 			columns: [table.disclosureFormId],
// 			foreignColumns: [disclosureForms.id],
// 			name: "disclosure_documents_disclosure_form_id_fkey"
// 		}).onDelete("cascade"),
// 	pgPolicy("Users can manage their own disclosure documents", { as: "permissive", for: "all", to: ["public"], using: sql`(auth.uid() = user_id)` }),
// 	pgPolicy("Users can view their own disclosure documents", { as: "permissive", for: "select", to: ["public"] }),
// ]);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    disclosureFormId: uuid("disclosure_form_id"),
    action: text().notNull(),
    details: jsonb(),
    ipAddress: inet("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_audit_logs_created_at").using(
      "btree",
      table.createdAt.desc().nullsFirst().op("timestamptz_ops")
    ),
    index("idx_audit_logs_user_id").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.disclosureFormId],
      foreignColumns: [disclosureForms.id],
      name: "audit_logs_disclosure_form_id_fkey",
    }).onDelete("set null"),
    pgPolicy("Admins can view all audit logs", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.user_type = 'admin'::text))))`,
    }),
    pgPolicy("All authenticated users can insert audit logs", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy("Users can view their own audit logs", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ]
);

export const apiUsageLogs = pgTable(
  "api_usage_logs",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    disclosureFormId: uuid("disclosure_form_id"),
    apiProvider: text("api_provider").notNull(),
    apiEndpoint: text("api_endpoint").notNull(),
    requestData: jsonb("request_data"),
    responseData: jsonb("response_data"),
    statusCode: integer("status_code"),
    costCredits: numeric("cost_credits", { precision: 10, scale: 4 }).default(
      "0"
    ),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_api_usage_logs_created_at").using(
      "btree",
      table.createdAt.desc().nullsFirst().op("timestamptz_ops")
    ),
    index("idx_api_usage_logs_user_id").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops")
    ),
    foreignKey({
      columns: [table.disclosureFormId],
      foreignColumns: [disclosureForms.id],
      name: "api_usage_logs_disclosure_form_id_fkey",
    }).onDelete("set null"),
    pgPolicy("Admins can view all API usage logs", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.user_type = 'admin'::text))))`,
    }),
    pgPolicy("Users can view their own API usage logs", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ]
);
