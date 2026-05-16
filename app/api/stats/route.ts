import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Todo from "@/app/models/Todo";

export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    const completionRate = todos.length
      ? Math.round(
          (todos.filter((t) => t.completed).length / todos.length) * 100,
        )
      : 0;
    const byPriority = ["high", "medium", "low"].map((p) => ({
      priority: p,
      count: todos.filter((t) => t.priority === p).length,
    }));
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        completed: todos.filter((t) => {
          if (!t.completed || !t.createdAt) return false;
          const todoDate = new Date(t.createdAt);
          return todoDate.toDateString() === date.toDateString();
        }).length,
      };
    });
    return NextResponse.json({
      completionRate,
      byPriority,
      completedByDay: last7Days,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los todos" },
      { status: 500 },
    );
  }
}
