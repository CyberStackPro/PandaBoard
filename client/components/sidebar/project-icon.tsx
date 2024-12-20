// components/sidebar/project-icon.tsx
interface ProjectIconProps {
  icon: string | null;
}

export const ProjectIcon = ({ icon }: ProjectIconProps) => {
  if (!icon) {
    return (
      <div className="h-4 w-4 rounded bg-muted flex items-center justify-center">
        📄
      </div>
    );
  }

  return <div className="h-4 w-4 flex items-center justify-center">{icon}</div>;
};
