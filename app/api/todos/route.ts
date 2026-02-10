import { NextRequest, NextResponse } from 'next/server';
import { db, initDB } from '@/lib/db';
import { todos } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

// Initialize database on first request
initDB();

export async function GET() {
  try {
    const allTodos = db.select().from(todos).orderBy(desc(todos.createdAt)).all();
    return NextResponse.json(allTodos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newTodo = db.insert(todos).values({
      title,
      description: description || null,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning().get();

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
