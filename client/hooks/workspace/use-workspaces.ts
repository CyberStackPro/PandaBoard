// import APIClient from "@/services/api-client";
// import { Project } from "@/types/project";
// import { useEffect, useState } from "react";

// const apiClient = new APIClient(
//   "/projects/owner/8ac84726-7c67-4c1b-a18f-aa8bd52710dc"
// );
// export const useWorkspace = () => {
//   const [workspaces, setWorkspace] = useState<Project[]>();
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   console.log(workspaces);

//   useEffect(() => {
//     apiClient
//       .get()
//       .then((res) => setWorkspace(res))
//       .catch((err) => console.log(err));
//   }, []);

//   return { workspaces };
// };
