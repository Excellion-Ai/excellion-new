import { useState, useRef, useEffect, createElement } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  multiline?: boolean;
  placeholder?: string;
}

const EditableText = ({
  value,
  onSave,
  className,
  style,
  as: Tag = "span",
  multiline = false,
  placeholder,
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const save = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    } else {
      setEditValue(value);
    }
    setIsEditing(false);
  };

  const cancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      cancel();
    } else if (e.key === "Enter") {
      if (multiline && !e.metaKey && !e.ctrlKey) return;
      e.preventDefault();
      save();
    }
  };

  if (isEditing) {
    const shared = {
      value: editValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setEditValue(e.target.value),
      onBlur: save,
      onKeyDown: handleKeyDown,
      className: cn("w-full", className),
      style,
      placeholder,
    };

    return multiline ? (
      <Textarea ref={inputRef as any} rows={3} {...shared} />
    ) : (
      <Input ref={inputRef as any} {...shared} />
    );
  }

  return createElement(
    Tag,
    {
      className: cn(
        "cursor-pointer rounded px-1 -mx-1 transition-all hover:ring-2 hover:ring-primary/30",
        !value && "text-muted-foreground italic",
        className
      ),
      style,
      onClick: () => {
        setEditValue(value);
        setIsEditing(true);
      },
    },
    value || placeholder || "Click to edit"
  );
};

export default EditableText;
