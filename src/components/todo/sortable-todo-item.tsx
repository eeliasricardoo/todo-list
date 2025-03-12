"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo } from "@/types";
import { TodoItem } from "./todo-item";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableTodoItemProps {
  todo: Todo;
}

export function SortableTodoItem({ todo }: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group mb-4 transition-all",
        isDragging ? "z-10" : "z-0",
        isDragging && "opacity-80 scale-[1.02] shadow-lg"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 flex items-center px-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="pl-8">
        <TodoItem todo={todo} />
      </div>
    </div>
  );
} 