"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  priority: "high" | "medium" | "low";
  dueDate?: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<{ q: string; a: string } | null>(null);
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [dueDate, setDueDate] = useState<string>("");

  useEffect(() => {
    fetchTodos();
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    const res = await fetch("/api/quote");
    const data = await res.json();
    setQuote(data[0]);
  }

  async function fetchTodos() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  }

  async function addTodo() {
    if (!input.trim()) return;
    setLoading(true);
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: input,
        priority,
        dueDate: dueDate || undefined,
      }),
    });
    const resData = await res.json();
    console.log("response:", resData);
    setInput("");
    setDueDate("");
    await fetchTodos();
    setLoading(false);
  }

  async function toggleTodo(id: string, completed: boolean) {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    await fetchTodos();
  }

  async function deleteTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    await fetchTodos();
  }

  async function togglePriority(
    id: string,
    currentPriority: "high" | "medium" | "low",
  ) {
    const next =
      currentPriority === "low"
        ? "medium"
        : currentPriority === "medium"
          ? "high"
          : "low";
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: next }),
    });
    await fetchTodos();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-medium text-gray-900">My tasks</h1>
            <Link
              href="/stats"
              className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
            >
              Stats →
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            {todos.filter((t) => t.completed).length} of {todos.length} tasks
            completed
          </p>
          <span className="text-sm text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>

          {/* Barra de progreso */}
          <div className="mt-3 h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 rounded-full transition-all duration-500"
              style={{
                width: todos.length
                  ? `${(todos.filter((t) => t.completed).length / todos.length) * 100}%`
                  : "0%",
              }}
            />
          </div>
        </div>

        {/* Quote */}
        {quote && (
          <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 mb-6">
            <p className="text-sm text-gray-600 italic">"{quote.q}"</p>
            <p className="text-xs text-gray-400 mt-2">— {quote.a}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-2xl font-medium text-gray-900">{todos.length}</p>
            <p className="text-xs text-gray-400 mt-1">Total</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-2xl font-medium text-gray-900">
              {todos.filter((t) => t.completed).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Completed</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-2xl font-medium text-gray-900">
              {todos.filter((t) => !t.completed).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Pending</p>
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new task..."
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
          />
          <input
            type="date"
            title="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={addTodo}
            disabled={loading}
            className="bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "..." : "+ Add"}
          </button>
        </div>

        {/* Pendientes */}
        {todos.filter((t) => !t.completed).length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
              Pending
            </p>
            <div className="flex flex-col gap-2">
              {todos
                .filter((t) => !t.completed)
                .map((todo) => (
                  <div
                    key={todo._id}
                    className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3"
                  >
                    <button
                      onClick={() => togglePriority(todo._id, todo.priority)}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        todo.priority === "high"
                          ? "bg-red-100 text-red-500"
                          : todo.priority === "medium"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {todo.priority === "high"
                        ? "High"
                        : todo.priority === "medium"
                          ? "Medium"
                          : "Low"}
                    </button>
                    <button
                      onClick={() => toggleTodo(todo._id, todo.completed)}
                      title="Completed"
                      className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 hover:border-gray-900 transition-colors"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-gray-800">
                        {todo.title}
                      </span>
                      {todo.dueDate && (
                        <p
                          className={`text-xs mt-0.5 ${
                            new Date(todo.dueDate) < new Date()
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          📅{" "}
                          {new Date(todo.dueDate).toLocaleDateString("es-CR")}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Completadas */}
        {todos.filter((t) => t.completed).length > 0 && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
              Completadas
            </p>
            <div className="flex flex-col gap-2">
              {todos
                .filter((t) => t.completed)
                .map((todo) => (
                  <div
                    key={todo._id}
                    className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 opacity-50"
                  >
                    <button
                      onClick={() => toggleTodo(todo._id, todo.completed)}
                      className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0"
                    >
                      <span className="text-white text-xs">✓</span>
                    </button>
                    <span className="flex-1 text-sm text-gray-400 line-through">
                      {todo.title}
                    </span>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {todos.length === 0 && (
          <p className="text-center text-gray-300 text-sm py-12">
            No tasks available
          </p>
        )}
      </div>
    </main>
  );
}
