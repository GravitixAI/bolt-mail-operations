# SQLite Setup Documentation

This project uses SQLite as the database with Drizzle ORM for type-safe database operations.

## Database Setup

### Dependencies Installed

- **better-sqlite3**: Fast, synchronous SQLite3 driver for Node.js
- **drizzle-orm**: Type-safe ORM with excellent TypeScript support
- **drizzle-kit**: Database migration and management toolkit

### File Structure

```
lib/
  db/
    schema.ts       # Database schema definitions
    index.ts        # Database connection and initialization
app/
  api/
    todos/
      route.ts      # GET all todos, POST new todo
      [id]/
        route.ts    # GET, PUT, DELETE individual todo
```

### Database Schema

The application includes a `todos` table with the following structure:

```typescript
{
  id: integer (primary key, auto-increment)
  title: text (required)
  description: text (optional)
  completed: boolean (default: false)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## API Endpoints

### Get All Todos
- **Endpoint**: `GET /api/todos`
- **Response**: Array of todo objects

### Create Todo
- **Endpoint**: `POST /api/todos`
- **Body**: `{ title: string, description?: string }`
- **Response**: Created todo object

### Get Single Todo
- **Endpoint**: `GET /api/todos/[id]`
- **Response**: Todo object

### Update Todo
- **Endpoint**: `PUT /api/todos/[id]`
- **Body**: `{ title?: string, description?: string, completed?: boolean }`
- **Response**: Updated todo object

### Delete Todo
- **Endpoint**: `DELETE /api/todos/[id]`
- **Response**: Success message

## Testing the CRUD App

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to: `http://localhost:3000/todo-crud`

3. The page includes:
   - Statistics dashboard showing total, completed, and pending todos
   - Create new todos with title and description
   - Mark todos as complete/incomplete
   - Edit existing todos
   - Delete todos
   - Beautiful UI with shadcn/ui components
   - Toast notifications for all operations

## Database File

The SQLite database file is stored at `local.db` in the project root and is automatically created on first run. This file is excluded from version control via `.gitignore`.

## Features Demonstrated

✅ **Create**: Add new todos with title and description  
✅ **Read**: View all todos with statistics  
✅ **Update**: Edit todo details and toggle completion status  
✅ **Delete**: Remove todos from the database  
✅ **Type Safety**: Full TypeScript support with Drizzle ORM  
✅ **Modern UI**: Beautiful interface with shadcn/ui components  
✅ **Real-time Updates**: UI refreshes after each operation  
✅ **Error Handling**: Proper error messages and validation  

## Next Steps

You can extend this setup by:
- Adding user authentication
- Creating additional tables (users, categories, etc.)
- Implementing relations between tables
- Adding data validation with Zod
- Creating database migrations with Drizzle Kit
- Adding pagination for large datasets
- Implementing search and filtering
