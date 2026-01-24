"use client";

import { Lesson } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface LessonsListProps {
  items: Lesson[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const LessonsList = ({
  items,
  onReorder,
  onEdit
}: LessonsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [lessons, setLessons] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setLessons(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedLessons = items.slice(startIndex, endIndex + 1);

    setLessons(items);

    const bulkUpdateData = updatedLessons.map((lesson) => ({
      id: lesson.id,
      position: items.findIndex((item) => item.id === lesson.id)
    }));

    onReorder(bulkUpdateData);
  }

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lessons">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="relative pb-4">
            
             {/* Ligne de progression (Timeline) pour les leçons */}
            <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-slate-200 z-0" />

            {lessons.map((lesson, index) => (
              <Draggable 
                key={lesson.id} 
                draggableId={lesson.id} 
                index={index}
              >
                {(provided) => (
                  <div
                    className="relative mb-6 pl-12 group"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                     {/* Node / Drag Handle */}
                     <div
                      className={cn(
                        "absolute left-0 top-3 h-10 w-10 flex items-center justify-center rounded-full border-2 bg-white z-10 transition-colors cursor-grab active:cursor-grabbing shadow-sm",
                        lesson.status === "PUBLISHED" 
                          ? "border-sky-600 text-sky-600 ring-4 ring-sky-50" 
                          : "border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-500"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>

                    {/* Lesson Card */}
                    <div
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-4 shadow-sm transition-all hover:shadow-md bg-white",
                        lesson.status === "PUBLISHED" ? "border-sky-200 bg-sky-50/50" : "border-slate-200"
                      )}
                    >
                      <div className="flex flex-col gap-y-1">
                         <span className={cn(
                          "font-semibold text-base",
                           lesson.status === "PUBLISHED" ? "text-sky-900" : "text-slate-700"
                        )}>
                          {lesson.title}
                        </span>
                         <div className="flex items-center gap-x-2">
                           <Badge
                             variant={lesson.status === "PUBLISHED" ? "default" : "secondary"}
                              className={cn(
                              "text-xs font-normal",
                              lesson.status === "PUBLISHED" && "bg-sky-600 hover:bg-sky-600/80"
                            )}
                           >
                            {lesson.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                          </Badge>
                          {lesson.isFree && (
                            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                              Gratuit
                            </Badge>
                          )}
                         </div>
                      </div>

                      <div className="flex items-center gap-x-2">
                        <div 
                           onClick={() => onEdit(lesson.id)}
                           className="p-2 rounded-full hover:bg-slate-200/50 cursor-pointer transition text-slate-500 hover:text-slate-800"
                         >
                            <Pencil className="h-4 w-4" />
                         </div>
                      </div>

                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
