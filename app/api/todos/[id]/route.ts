import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Todo from "@/app/models/Todo";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    await Todo.findByIdAndDelete(id);
    return NextResponse.json({ message: "Todo Eliminado" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el Todo" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {}
    if (body.completed !== undefined) updateData.completed = body.completed
    if (body.priority !== undefined) updateData.priority = body.priority

    const todo = await Todo.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el Todo" },
      { status: 500 },
    );
  }
}
