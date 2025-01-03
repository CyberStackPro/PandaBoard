import Image from "next/image";
import { Button } from "../ui/button";
import { ImageIcon, MessageSquare, Plus } from "lucide-react";

// components/sidebar/project-icon.tsx
interface ProjectIconProps {
  icon: string | null;
  coverImage: string | null;
  handleAddCover: () => void;
  handleAddCommentClick: () => void;
}

export const ProjectIcon = ({
  icon,
  coverImage,
  handleAddCommentClick,
  handleAddCover,
}: ProjectIconProps) => {
  if (!icon) {
    return (
      <div className="flex flex-col gap-2 items-start">
        {/* Icon */}
        <Button
          variant={"ghost"}
          size={"sm"}
          className="relative flex items-center justify-center size-16 rounded-md cursor-pointer transition-colors hover:bg-muted focus:outline-none"
          aria-label="Change page icon"
        >
          {/* <div className="size-10 absolute  flex items-center justify-center"> */}
          {icon ? (
            <Image
              className="absolute top-0 left-0 rounded-full object-cover"
              alt={icon}
              src={"Project Icon"}
              width={32}
              height={32}
            />
          ) : (
            <span className="text-2xl">🎉</span> // Default icon
          )}
          {/* </div> */}
        </Button>
        <div className="flex items-center   opacity-0 hover:opacity-50 transition-opacity duration-300 ease-in-out">
          {!icon && icon && icon?.length > 0 && (
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add icon
            </Button>
          )}
          {!coverImage && (
            <Button
              onClick={handleAddCover}
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Add Cover
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddCommentClick}
            className="text-muted-foreground"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Add comment
          </Button>
        </div>
      </div>
    );
  }

  return <div className="h-4 w-4 flex items-center justify-center">{icon}</div>;
};
