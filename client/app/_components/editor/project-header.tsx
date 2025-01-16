import { ProjectIcon } from "@/components/sidebar/project-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Project } from "@/types/workspace";
import debounce from "lodash.debounce";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ProjectHeaderProps {
  activeProject?: Project | null;
  coverImage: string | null;
  onCoverImageChange: (url: string | null) => void;
  onRename: (id: string, name: string) => void;
  updateActiveProject: (data: { name: string }) => void;
}

export function ProjectHeader({
  activeProject,
  coverImage,
  onCoverImageChange,
  onRename,
  updateActiveProject,
}: ProjectHeaderProps) {
  const [tempName, setTempName] = useState(activeProject?.name || "");
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [coverPosition, setCoverPosition] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const debouncedRename = useMemo(
    () =>
      debounce(async (id: string, newName: string) => {
        try {
          onRename(id, newName);
          updateActiveProject({ name: newName });
        } catch (error: unknown) {
          // Revert to last known good state
          setTempName(activeProject?.name || "");
        }
      }, 300),
    [onRename, updateActiveProject, activeProject?.name]
  );

  // Cover image handlers
  const handleCoverDrag = useCallback(
    (e: React.DragEvent) => {
      if (!isDraggingCover) return;
      const container = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - container.top;
      const percentage = Math.max(
        0,
        Math.min(100, (y / container.height) * 100)
      );
      setCoverPosition(percentage);
    },
    [isDraggingCover]
  );

  const handleAddCover = useCallback(() => {
    const newCover = prompt("Enter cover image URL:");
    if (newCover) onCoverImageChange(newCover);
  }, [onCoverImageChange]);

  const handleAddCommentClick = useCallback(() => {
    const newCover = prompt("Enter cover image URL:");
    if (newCover) onCoverImageChange(newCover);
  }, [onCoverImageChange]);

  // Title editing handlers
  const handleInput = useCallback(() => {
    if (headingRef.current) {
      const newName = headingRef.current.textContent || "";
      setTempName(newName);
      if (activeProject?.id) {
        debouncedRename(activeProject.id, newName);
      }
    }
  }, [activeProject?.id, debouncedRename]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLHeadingElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.currentTarget.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setTempName(activeProject?.name || "");
        e.currentTarget.blur();
      }
    },
    [activeProject?.name]
  );

  const handleBlur = useCallback(() => {
    const newName = tempName.trim();
    if (newName && newName !== activeProject?.name && activeProject?.id) {
      onRename(activeProject.id, newName);
      updateActiveProject({ name: newName });
    }
  }, [tempName, activeProject, onRename, updateActiveProject]);

  useEffect(() => {
    if (headingRef.current && activeProject) {
      headingRef.current.textContent = activeProject.name || "";
      setTempName(activeProject?.name || "");
    }
  }, [activeProject]);

  return (
    <div className="relative">
      {/* Cover Image Section */}
      {coverImage && (
        <div
          className="relative w-full h-[25vh] max-h-[280px] group"
          onMouseEnter={() => setIsDraggingCover(true)}
          onMouseLeave={() => setIsDraggingCover(false)}
        >
          <div
            className={cn("w-full h-full relative overflow-hidden", {
              "cursor-grabbing": isDraggingCover,
            })}
            draggable
            onDrag={handleCoverDrag}
            onDragEnd={() => setIsDraggingCover(false)}
            onDragStart={() => setIsDraggingCover(true)}
          >
            <Image
              src={coverImage}
              alt="Cover"
              layout="fill"
              className="object-cover transition-all duration-300"
              style={{ objectPosition: `center ${coverPosition}%` }}
            />
          </div>

          {/* Cover Controls */}
          <div
            className={cn(
              "absolute bottom-4 right-4 flex gap-1",
              "bg-background/90 backdrop-blur-sm rounded-lg shadow-sm",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            )}
          >
            {coverImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddCover}
                className="text-sm hover:bg-background/90"
              >
                {coverImage ? "Change Cover" : "Add Cover"}
              </Button>
            )}

            {coverImage && (
              <>
                <Separator
                  orientation="vertical"
                  className="h-[20px] my-auto"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm hover:bg-background/90"
                  onClick={() => setIsDraggingCover(true)}
                >
                  Reposition
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Title Section */}
      <div className="max-w-[765px] mx-auto px-4 mt-16">
        <div className="flex flex-col gap-2">
          <ProjectIcon
            handleAddCommentClick={handleAddCommentClick}
            coverImage={coverImage}
            handleAddCover={handleAddCover}
            icon={activeProject?.icon || ""}
          />
          <h1
            ref={headingRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            data-placeholder="Untitled Project"
            className={cn(
              "outline-none w-full px-1 whitespace-pre-wrap break-words",
              "text-4xl font-bold",
              "empty:before:content-[attr(data-placeholder)]",
              "empty:before:text-muted-foreground/60",
              "focus:ring-1 focus:ring-primary/20 rounded-sm"
            )}
          >
            {tempName}
          </h1>
        </div>
      </div>
    </div>
  );
}
