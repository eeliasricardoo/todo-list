"use client";

import React, { useState } from "react";
import { Todo } from "@/types";
import { useTodoStore } from "@/lib/store/todo-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Edit, Check } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, removeTodo, editTodo } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleRemove = () => {
    removeTodo(todo.id);
  };

  const handleEdit = () => {
    if (isEditing) {
      editTodo(todo.id, editValue);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <Card className="flex items-center p-4 gap-4 w-full">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggle}
        className="h-6 w-6"
      />
      
      <div className="flex-1">
        {isEditing ? (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full"
            autoFocus
          />
        ) : (
          <span className={`text-base ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
            {todo.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEdit}
          className="h-8 w-8"
        >
          {isEditing ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="h-8 w-8 text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
} 