export interface Project {
  id: string;
  name: string;
  owner_id: string;
  parent_id: string | null;
  description: string | null;
  status: "active" | "archived" | "deleted" | "template";
  visibility: "private" | "team" | "public";
  metadata: Record<string, unknown>;
  icon: string | null;
  cover_image: string | null;
  children: Project[];
  //   documents: Document[];
  documents: unknown;
  created_at: string;
  updated_at: string;
}
