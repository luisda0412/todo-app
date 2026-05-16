import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Todo from "@/app/models/Todo";

// GET - Obtener todos los todos
export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los todos" },
      { status: 500 },
    );
  }
}

// POST - Crear un nuevo todo
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
     console.log('body:', body)
    const todo = await Todo.create({
      title: body.title,
      priority: body.priority,
      dueDate: body.dueDate,
    });
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el todo" },
      { status: 500 },
    );
  }
}
