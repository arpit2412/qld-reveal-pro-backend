import { relations } from "drizzle-orm/relations";
import { profiles, userGroups, userGroupMembers, usageReports, disclosureForms, disclosureDocuments, auditLogs, apiUsageLogs } from "./schema";

export const profilesRelations = relations(profiles, ({one, many}) => ({
	profile: one(profiles, {
		fields: [profiles.userId],
		references: [profiles.userId],
		relationName: "profiles_userId_profiles_userId"
	}),
	profiles: many(profiles, {
		relationName: "profiles_userId_profiles_userId"
	}),
}));

export const userGroupMembersRelations = relations(userGroupMembers, ({one}) => ({
	userGroup: one(userGroups, {
		fields: [userGroupMembers.groupId],
		references: [userGroups.id]
	}),
}));

export const userGroupsRelations = relations(userGroups, ({many}) => ({
	userGroupMembers: many(userGroupMembers),
	usageReports: many(usageReports),
}));

export const usageReportsRelations = relations(usageReports, ({one}) => ({
	userGroup: one(userGroups, {
		fields: [usageReports.groupId],
		references: [userGroups.id]
	}),
}));

export const disclosureDocumentsRelations = relations(disclosureDocuments, ({one}) => ({
	disclosureForm: one(disclosureForms, {
		fields: [disclosureDocuments.disclosureFormId],
		references: [disclosureForms.id]
	}),
}));

export const disclosureFormsRelations = relations(disclosureForms, ({many}) => ({
	disclosureDocuments: many(disclosureDocuments),
	auditLogs: many(auditLogs),
	apiUsageLogs: many(apiUsageLogs),
}));

export const auditLogsRelations = relations(auditLogs, ({one}) => ({
	disclosureForm: one(disclosureForms, {
		fields: [auditLogs.disclosureFormId],
		references: [disclosureForms.id]
	}),
}));

export const apiUsageLogsRelations = relations(apiUsageLogs, ({one}) => ({
	disclosureForm: one(disclosureForms, {
		fields: [apiUsageLogs.disclosureFormId],
		references: [disclosureForms.id]
	}),
}));