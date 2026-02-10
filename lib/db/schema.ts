import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;

// Application configuration table
export const appConfig = sqliteTable('app_config', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export type AppConfig = typeof appConfig.$inferSelect;
export type NewAppConfig = typeof appConfig.$inferInsert;

// Sync log table for tracking sync operations
export const syncLog = sqliteTable('sync_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  queueType: text('queue_type').notNull(), // 'certified' or 'regular'
  uncPath: text('unc_path').notNull(),
  filesScanned: integer('files_scanned').notNull().default(0),
  filesAdded: integer('files_added').notNull().default(0),
  filesUpdated: integer('files_updated').notNull().default(0),
  filesDeleted: integer('files_deleted').notNull().default(0),
  errors: integer('errors').notNull().default(0),
  status: text('status').notNull(), // 'success', 'error', 'partial'
  message: text('message'),
  syncedAt: integer('synced_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export type SyncLog = typeof syncLog.$inferSelect;
export type NewSyncLog = typeof syncLog.$inferInsert;

// Config keys used in the application
export const CONFIG_KEYS = {
  // UNC Path settings
  UNC_PATH: 'unc_path', // Legacy - kept for backwards compatibility
  UNC_PATH_CERTIFIED: 'unc_path_certified',
  UNC_PATH_REGULAR: 'unc_path_regular',
  
  // MySQL connection settings
  MYSQL_HOST: 'mysql_host',
  MYSQL_PORT: 'mysql_port',
  MYSQL_DATABASE: 'mysql_database',
  MYSQL_USER: 'mysql_user',
  MYSQL_PASSWORD: 'mysql_password', // Note: Consider encryption for production
  
  // Auto-sync settings
  AUTO_SYNC_ENABLED: 'auto_sync_enabled',
  AUTO_SYNC_INTERVAL: 'auto_sync_interval', // In minutes
} as const;
