import { ProjectIcon } from "@/components/sidebar/project-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Workspace } from "@/types/workspace";
import debounce from "lodash.debounce";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ProjectHeaderProps {
  activeWorkspace?: Workspace | null;
  coverImage: string | null;
  onCoverImageChange: (url: string | null) => void;
  onRename: (id: string, name: string) => void;
  updateActiveWorkspace: (data: { name: string }) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;
}

export function ProjectHeader({
  activeWorkspace,
  coverImage,
  onCoverImageChange,
  onRename,
  updateActiveWorkspace,
}: ProjectHeaderProps) {
  const [tempName, setTempName] = useState(activeWorkspace?.name || "");
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [coverPosition, setCoverPosition] = useState(50);
  const [isRepositioning, setIsRepositioning] = useState(false);

  const coverRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const compositionRef = useRef(false);

  const handleCoverPosition = useCallback((clientY: number) => {
    if (!coverRef.current || !headingRef.current) return;
    setIsRepositioning(true);

    const container = coverRef.current.getBoundingClientRect();
    const yPosition = clientY - container.top;
    const percentage = Math.max(
      0,
      Math.min(100, (yPosition / container.height) * 100)
    );
    setCoverPosition(percentage);
  }, []);

  const debouncedRename = useMemo(
    () =>
      debounce(async (id: string, newName: string) => {
        try {
          onRename(id, newName);
          updateActiveWorkspace({ name: newName });
        } catch (error) {
          if (error instanceof Error) console.error(error.message);

          // Revert to last known good state
          setTempName(activeWorkspace?.name || "");
        }
      }, 300),
    [onRename, updateActiveWorkspace, activeWorkspace?.name]
  );

  const handleComposition = useCallback(
    (e: React.CompositionEvent) => {
      if (e.type === "compositionstart") {
        compositionRef.current = true;
        return;
      }

      compositionRef.current = false;
      // Force update after composition ends
      const newName = e.currentTarget.textContent || "";
      setTempName(newName);
      if (activeWorkspace?.id) {
        debouncedRename(activeWorkspace.id, newName);
      }
    },
    [activeWorkspace?.id, debouncedRename]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isRepositioning) {
        e.preventDefault();
        handleCoverPosition(e.clientY);
      }
    },
    [isRepositioning, handleCoverPosition]
  );
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isRepositioning && e.touches[0]) {
        e.preventDefault();
        handleCoverPosition(e.touches[0].clientY);
      }
    },
    [isRepositioning, handleCoverPosition]
  );
  const endRepositioning = useCallback(() => {
    setIsRepositioning(false);
    if (coverRef.current) {
      coverRef.current.style.cursor = "grab";
    }

    // Save final position to your backend/store
    if (activeWorkspace?.id) {
      // Update your workspace data here
      updateActiveWorkspace({ coverPosition });
    }
  }, [activeWorkspace?.id, coverPosition, updateActiveWorkspace]);

  useEffect(() => {
    if (isRepositioning) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("mouseup", endRepositioning);
      document.addEventListener("touchend", endRepositioning);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", endRepositioning);
      document.removeEventListener("touchend", endRepositioning);
    };
  }, [isRepositioning, handleMouseMove, handleTouchMove, endRepositioning]);

  const startRepositioning = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsRepositioning(true);
      if (coverRef.current) {
        coverRef.current.style.cursor = "grabbing";
      }

      // Handle initial position for touch
      if ("touches" in e && e.touches[0]) {
        handleCoverPosition(e.touches[0].clientY);
      }
    },
    [handleCoverPosition]
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

      if (activeWorkspace?.id) {
        debouncedRename(activeWorkspace.id, newName);
      }
    }
  }, [activeWorkspace?.id, debouncedRename]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLHeadingElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.currentTarget.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setTempName(activeWorkspace?.name || "");
        e.currentTarget.blur();
      }
    },
    [activeWorkspace?.name]
  );

  const handleBlur = useCallback(() => {
    const newName = tempName.trim();
    if (newName && newName !== activeWorkspace?.name && activeWorkspace?.id) {
      onRename(activeWorkspace.id, newName);
      updateActiveWorkspace({ name: newName });
    }
  }, [tempName, activeWorkspace, onRename, updateActiveWorkspace]);

  useEffect(() => {
    if (headingRef.current && activeWorkspace) {
      headingRef.current.textContent = activeWorkspace.name || "";
      setTempName(activeWorkspace?.name || "");
    }
  }, [activeWorkspace]);

  return (
    <div className="relative">
      {/* Cover Image Section */}
      {coverImage && (
        <div
          ref={coverRef}
          className="relative w-full h-[25vh] max-h-[280px] group overflow-hidden"
          style={{ cursor: isRepositioning ? "move" : "default" }}
        >
          <div
            className="w-full h-full relative"
            onMouseDown={isRepositioning ? startRepositioning : undefined}
            onTouchStart={isRepositioning ? startRepositioning : undefined}
          >
            <Image
              src={coverImage}
              alt="Cover"
              layout="fill"
              className="object-cover select-none"
              style={{ objectPosition: `center ${coverPosition}%` }}
            />
          </div>

          {/* Updated Cover Controls */}
          <div
            className={cn(
              "absolute bottom-4 right-4 flex gap-2",
              "bg-background/90 backdrop-blur-sm rounded-lg shadow-sm p-1",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              { "opacity-100": isRepositioning }
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddCover}
              className="text-sm hover:bg-background/80"
            >
              {coverImage ? "Change" : "Add"}
            </Button>

            <Separator orientation="vertical" className="h-[20px] my-auto" />

            <Button
              variant="ghost"
              size="sm"
              className="text-sm hover:bg-background/80"
              onMouseDown={startRepositioning}
              onTouchStart={startRepositioning}
            >
              Reposition
            </Button>
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
            icon={activeWorkspace?.icon || ""}
          />
          <h1
            ref={headingRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleComposition}
            onCompositionEnd={handleComposition}
            onBlur={handleBlur}
            data-placeholder={"Untitled Project"}
            className={cn(
              "outline-none w-full px-1 ",
              "text-4xl font-bold",
              "empty:before:content-[attr(data-placeholder)]",
              "empty:before:text-muted-foreground/60"
            )}
          />
          {/* {tempName}
          </h1> */}
        </div>
      </div>
    </div>
  );
}
