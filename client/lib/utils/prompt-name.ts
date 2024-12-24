export const promptForName = async (type: "folder" | "file") => {
  // In a real application, you'd want to use a proper dialog/modal component
  const defaultName = type === "folder" ? "Untitled Folder" : "Untitled";
  const name = prompt(`Enter ${type} name:`, defaultName);
  return name || null;
};
