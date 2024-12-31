"use client";
// components/editor/CoverImage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CoverImage() {
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="relative h-[200px] w-full bg-gradient-to-r from-primary/10 to-primary/5"
      style={
        coverImage
          ? {
              backgroundImage: `url(${coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <label className="absolute bottom-3 right-3">
        <Button
          variant="secondary"
          size="sm"
          className="bg-background/80 hover:bg-background"
        >
          {coverImage ? "Change cover" : "Add cover"}
        </Button>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </label>
    </div>
  );
}
