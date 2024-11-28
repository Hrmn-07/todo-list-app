"use client"; // client side rendering

// melakukan import hooks dan types dari react
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";

// import custom ui dari shadcn component
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// interface untuk tasks
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  // hooks untuk manage tasks, new task, editing task, dan component status
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskText, setEditedTaskText] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Effect hook untuk melakukan run mount component
  useEffect(() => {
    setIsMounted(true); // Set mounted ke true
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks) as Task[]); // Parse dan set tasks dari local storage
    }
  }, []);

  // Effect hook untuk melakukan save pada local storage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks)); // Save tasks ke local storage
    }
  }, [tasks, isMounted]);

  // Function untuk add task baru
  const addTask = (): void => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  // Function untuk check complete tasks
  const toggleTaskCompletion = (id: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Function untuk editing task
  const startEditingTask = (id: number, text: string): void => {
    setEditingTaskId(id); // Set task ID
    setEditedTaskText(text); // Set task text
  };

  // Function untuk update task
  const updateTask = (): void => {
    if (editedTaskText.trim() !== "") {
      // Update task text
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { ...task, text: editedTaskText } : task
        )
      );
      setEditingTaskId(null); // Clear task ID
      setEditedTaskText(""); // Clear task text
    }
  };

  // Function untuk menghapus task
  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // untuk menghindari hydration error
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 dark:bg-gray-900">
      <div className="w-full max-w-md bg-blue-200 dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Simple ToDo List App
        </h1>

        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="ketik list disini"
            value={newTask}
            onChange={
              (e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value) // Update new task input
            }
            className="flex-1 mr-2 px-3 py-2 rounded-md border border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <Button
            onClick={addTask}
            className="bg-black hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-md"
          >
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-blue-300 dark:bg-gray-700 rounded-md px-4 py-2"
            >
              <div className="flex items-center">
                <Checkbox
                  checked={task.completed}
                  className="mr-2"
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                />
                {editingTaskId === task.id ? (
                  // Input untuk editing task text
                  <Input
                    type="text"
                    value={editedTaskText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEditedTaskText(e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        updateTask();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  />
                ) : (
                  // Display task text
                  <span
                    className={`flex-1 text-gray-800 dark:text-gray-200 ${
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : ""
                    }`}
                  >
                    {task.text}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                {editingTaskId === task.id ? (
                  // Button untuk save edited task
                  <Button
                    onClick={updateTask}
                    className="bg-black hover:bg-slate-800 text-white font-medium py-1 px-2 rounded-md mr-2"
                  >
                    Save
                  </Button>
                ) : (
                  // Button untuk start editing task
                  <Button
                    onClick={() => startEditingTask(task.id, task.text)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-medium py-1 px-2 rounded-md mr-2"
                  >
                    Edit
                  </Button>
                )}

                <Button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-black font-medium py-1 px-2 rounded-md"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
