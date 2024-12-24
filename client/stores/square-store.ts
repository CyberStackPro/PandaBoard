// // // types/store.ts
// // import { AuthSlice } from '@/stores/auth-slice'
// // import { ThemeSlice } from '@/stores/theme-slice'

// // export interface Store extends AuthSlice, ThemeSlice {}

// // // stores/auth-slice.ts
// // import { StateCreator } from 'zustand'
// // import { Store } from '@/types/store'
// // import { User } from '@/types/user'

// // export interface AuthState {
// //   user: User | null
// //   accessToken: string | null
// //   isAuthenticated: boolean
// //   isLoading: boolean
// //   error: string | null
// // }

// // interface AuthActions {
// //   login: (email: string, password: string) => Promise<void>
// //   signup: (name: string, email: string, password: string) => Promise<void>
// //   logout: () => void
// //   setUser: (user: User) => void
// //   clearError: () => void
// // }

// // export type AuthSlice = AuthState & AuthActions

// // const initialState: AuthState = {
// //   user: null,
// //   accessToken: null,
// //   isAuthenticated: false,
// //   isLoading: false,
// //   error: null
// // }

// // export const createAuthSlice: StateCreator<
// //   Store,
// //   [["zustand/immer", never]],
// //   [],
// //   AuthSlice
// // > = (set, get) => ({
// //   ...initialState,
// //   login: async (email, password) => {
// //     try {
// //       set(state => { state.isLoading = true; state.error = null })

// //       const response = await fetch('/api/auth/login', {
// //         method: 'POST',
// //         body: JSON.stringify({ email, password })
// //       })
// //       const data = await response.json()

// //       if (!response.ok) throw new Error(data.message)

// //       set(state => {
// //         state.user = data.user
// //         state.accessToken = data.accessToken
// //         state.isAuthenticated = true
// //         state.isLoading = false
// //       })
// //     } catch (error) {
// //       set(state => {
// //         state.error = error.message
// //         state.isLoading = false
// //       })
// //     }
// //   },

// //   signup: async (name, email, password) => {
// //     try {
// //       set(state => { state.isLoading = true; state.error = null })

// //       const response = await fetch('/api/auth/signup', {
// //         method: 'POST',
// //         body: JSON.stringify({ name, email, password })
// //       })
// //       const data = await response.json()

// //       if (!response.ok) throw new Error(data.message)

// //       set(state => {
// //         state.user = data.user
// //         state.accessToken = data.accessToken
// //         state.isAuthenticated = true
// //         state.isLoading = false
// //       })
// //     } catch (error) {
// //       set(state => {
// //         state.error = error.message
// //         state.isLoading = false
// //       })
// //     }
// //   },

// //   logout: () => set(initialState),

// //   setUser: (user) => set(state => { state.user = user }),

// //   clearError: () => set(state => { state.error = null })
// // })

// // // stores/theme-slice.ts
// // export interface ThemeState {
// //   theme: 'light' | 'dark'
// // }

// // interface ThemeActions {
// //   toggleTheme: () => void
// //   setTheme: (theme: 'light' | 'dark') => void
// // }

// // export type ThemeSlice = ThemeState & ThemeActions

// // export const createThemeSlice: StateCreator<
// //   Store,
// //   [["zustand/immer", never]],
// //   [],
// //   ThemeSlice
// // > = (set) => ({
// //   theme: 'light',
// //   toggleTheme: () => set(state => {
// //     state.theme = state.theme === 'light' ? 'dark' : 'light'
// //   }),
// //   setTheme: (theme) => set(state => { state.theme = theme })
// // })

// // // stores/store.ts
// // import { create } from 'zustand'
// // import { immer } from 'zustand/middleware/immer'
// // import { devtools, subscribeWithSelector } from 'zustand/middleware'
// // import { persist } from 'zustand/middleware'
// // import { createAuthSlice } from './auth-slice'
// // import { createThemeSlice } from './theme-slice'
// // import { Store } from '@/types/store'

// // export const useStore = create<Store>()(
// //   devtools(
// //     persist(
// //       subscribeWithSelector(
// //         immer((...a) => ({
// //           ...createAuthSlice(...a),
// //           ...createThemeSlice(...a),
// //         }))
// //       ),
// //       { name: 'app-store' }
// //     )
// //   )
// // )

// // components/LoginForm.tsx
// // const LoginForm = () => {
// //   const { login, isLoading, error, clearError } = useStore(
// //     useShallow((state) => ({
// //       login: state.login,
// //       isLoading: state.isLoading,
// //       error: state.error,
// //       clearError: state.clearError
// //     }))
// //   )

// //   const handleSubmit = async (e: FormEvent) => {
// //     e.preventDefault()
// //     await login(email, password)
// //   }

// //   return (
// //     <form onSubmit={handleSubmit}>
// //       {error && <div className="error">{error}</div>}
// //       {/* form fields */}
// //     </form>
// //   )
// // }

// // // components/ThemeToggle.tsx
// // const ThemeToggle = () => {
// //   const { theme, toggleTheme } = useStore(
// //     useShallow((state) => ({
// //       theme: state.theme,
// //       toggleTheme: state.toggleTheme
// //     }))
// //   )

// //   return (
// //     <button onClick={toggleTheme}>
// //       Current theme: {theme}
// //     </button>
// //   )
// // }

// import { createCartSlice } from "./cart-slice";
// import { createUserSlice } from "./user-slice";
// import { create } from "zustand";
// import { Store } from "../types/store";
// import { immer } from "zustand/middleware/immer";
// import { devtools, subscribeWithSelector } from "zustand/middleware";
// import { persist } from "zustand/middleware";

// export const useStore = create<Store>()(
//   devtools(
//     persist(
//       subscribeWithSelector(
//         immer((...a) => ({
//           ...createUserSlice(...a),
//           ...createCartSlice(...a),
//         }))
//       ),
//       { name: "zustand-store" }
//     )
//   )
// );

// import { StateCreator } from "zustand";
// import { Product } from "../types/product";
// import { CartProduct } from "../types/cartProduct";
// import { Store } from "../types/store";

// interface CartState {
//   products: CartProduct[];
//   total: number;
// }

// type CartActions = {
//   addProduct: (product: Product) => void;
//   removeProduct: (productId: string) => void;
//   incQty: (productId: string) => void;
//   decQty: (productId: string) => void;
//   // getProductId: (productId: string) => CartProduct | undefined;
//   getProductById: (productId: string) => CartProduct | undefined;
//   setTotal: (total: number) => void;
//   reset: () => void;
//   // setAddress: (address: string) => void;
// };

// export type CartSlice = CartState & CartActions;

// const initialState: CartState = {
//   products: [],
//   total: 0,
// };

// export const createCartSlice: StateCreator<
//   Store,
//   [["zustand/immer", never]],
//   [],
//   CartSlice
// > = (set, get) => ({
//   ...initialState,
//   incQty: (productId) =>
//     set((state) => {
//       const product = state.products.find(
//         (product) => product.id === +productId
//       );
//       if (product) {
//         product.quantity++;
//       }
//     }),
//   decQty: (productId) =>
//     set((state) => {
//       const foundIndex = state.products.findIndex(
//         (product) => product.id === +productId
//       );
//       if (foundIndex !== -1) {
//         if (state.products[foundIndex].quantity === 1) {
//           state.products.splice(foundIndex, 1);
//         } else {
//           state.products[foundIndex].quantity--;
//         }
//       }
//     }),
//   addProduct: (product) =>
//     set((state) => {
//       state.products.push({ ...product, quantity: 1 });
//     }),
//   removeProduct: (productId) =>
//     set((state) => {
//       state.products = state.products.filter((item) => item.id !== +productId);
//     }),
//   getProductById: (productId) =>
//     get().products.find((product) => product.id === +productId),
//   setTotal: (total) =>
//     set((state) => {
//       state.total = total;
//     }),
//   reset: () => set(() => initialState),
// });
// // types/workspace.ts
// export interface Project {
//     id: string;
//     name: string;
//     icon?: string | null;
//     type: 'folder' | 'file';
//     children?: Project[];
//     parentId?: string | null;
//   }

//   // store/workspaceStore.ts
//   import { create } from 'zustand';
//   import { v4 as uuidv4 } from 'uuid';
//   import { Folder, File } from 'lucide-react';

//   interface WorkspaceState {
//     workspaces: Project[];
//     addProject: (parentId?: string | null) => void;
//     addFile: (parentId?: string | null) => void;
//     deleteProject: (projectId: string) => void;
//     updateProject: (projectId: string, updates: Partial<Project>) => void;
//   }

//   const findAndUpdateProject = (
//     projects: Project[],
//     projectId: string,
//     updates: Partial<Project>
//   ): Project[] => {
//     return projects.map(project => {
//       if (project.id === projectId) {
//         return { ...project, ...updates };
//       }
//       if (project.children) {
//         return {
//           ...project,
//           children: findAndUpdateProject(project.children, projectId, updates),
//         };
//       }
//       return project;
//     });
//   };

//   const findAndDeleteProject = (projects: Project[], projectId: string): Project[] => {
//     return projects.filter(project => {
//       if (project.id === projectId) return false;
//       if (project.children) {
//         project.children = findAndDeleteProject(project.children, projectId);
//       }
//       return true;
//     });
//   };

//   export const useWorkspaceStore = create<WorkspaceState>((set) => ({
//     workspaces: [],

//     addProject: (parentId?: string | null) => {
//       set((state) => {
//         const newProject: Project = {
//           id: uuidv4(),
//           name: 'Untitled',
//           type: 'folder',
//           icon: null,
//           children: [],
//           parentId,
//         };

//         if (!parentId) {
//           return { workspaces: [...state.workspaces, newProject] };
//         }

//         const updatedWorkspaces = state.workspaces.map(workspace => {
//           if (workspace.id === parentId) {
//             return {
//               ...workspace,
//               children: [...(workspace.children || []), newProject],
//             };
//           }
//           return workspace;
//         });

//         return { workspaces: updatedWorkspaces };
//       });
//     },

//     addFile: (parentId?: string | null) => {
//       set((state) => {
//         const newFile: Project = {
//           id: uuidv4(),
//           name: 'Untitled',
//           type: 'file',
//           icon: null,
//           parentId,
//         };

//         if (!parentId) {
//           return { workspaces: [...state.workspaces, newFile] };
//         }

//         const updatedWorkspaces = state.workspaces.map(workspace => {
//           if (workspace.id === parentId) {
//             return {
//               ...workspace,
//               children: [...(workspace.children || []), newFile],
//             };
//           }
//           return workspace;
//         });

//         return { workspaces: updatedWorkspaces };
//       });
//     },

//     deleteProject: (projectId: string) => {
//       set((state) => ({
//         workspaces: findAndDeleteProject(state.workspaces, projectId),
//       }));
//     },

//     updateProject: (projectId: string, updates: Partial<Project>) => {
//       set((state) => ({
//         workspaces: findAndUpdateProject(state.workspaces, projectId, updates),
//       }));
//     },
//   }));

//   // components/ProjectItem.tsx
//   interface ProjectItemProps {
//     project: Project;
//     isCollapsed: boolean;
//     level: number;
//   }

//   export const ProjectItem = ({ project, isCollapsed, level }: ProjectItemProps) => {
//     const { deleteProject, addProject, addFile } = useWorkspaceStore();

//     const handleAction = (action: string, projectId: string) => {
//       switch (action) {
//         case 'delete':
//           deleteProject(projectId);
//           break;
//         // Add more actions here
//       }
//     };

//     const handleAddNew = (type: 'folder' | 'file') => {
//       if (type === 'folder') {
//         addProject(project.id);
//       } else {
//         addFile(project.id);
//       }
//     };

//     // Rest of your ProjectItem component code...
//   };

//   // components/NavWorkspaces.tsx
//   export const NavWorkspaces = ({ isCollapsed }: { isCollapsed: boolean }) => {
//     const { workspaces, addProject } = useWorkspaceStore();

//     return (
//       // Your existing NavWorkspaces code, but using the store
//     );
//   };
