"use client";

import { useState } from "react";
import { CheckIcon, TrashIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (completed: boolean) => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  
  const handleToggle = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      await onToggle(!todo.completed);
    } finally {
      setIsToggling(false);
    }
  };
  
  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className="relative">
        {isToggling ? (
          <div className="h-5 w-5 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Checkbox 
            checked={todo.completed}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-green-600"
          />
        )}
      </div>
      
      <div 
        className={`flex-1 ${
          todo.completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {todo.title}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <TrashIcon className="h-4 w-4" />
        )}
      </Button>
    </Card>
  );
} 