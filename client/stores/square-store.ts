// // types/store.ts
// import { AuthSlice } from '@/stores/auth-slice'
// import { ThemeSlice } from '@/stores/theme-slice'

// export interface Store extends AuthSlice, ThemeSlice {}

// // stores/auth-slice.ts
// import { StateCreator } from 'zustand'
// import { Store } from '@/types/store'
// import { User } from '@/types/user'

// export interface AuthState {
//   user: User | null
//   accessToken: string | null
//   isAuthenticated: boolean
//   isLoading: boolean
//   error: string | null
// }

// interface AuthActions {
//   login: (email: string, password: string) => Promise<void>
//   signup: (name: string, email: string, password: string) => Promise<void>
//   logout: () => void
//   setUser: (user: User) => void
//   clearError: () => void
// }

// export type AuthSlice = AuthState & AuthActions

// const initialState: AuthState = {
//   user: null,
//   accessToken: null,
//   isAuthenticated: false,
//   isLoading: false,
//   error: null
// }

// export const createAuthSlice: StateCreator<
//   Store,
//   [["zustand/immer", never]],
//   [],
//   AuthSlice
// > = (set, get) => ({
//   ...initialState,
//   login: async (email, password) => {
//     try {
//       set(state => { state.isLoading = true; state.error = null })

//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         body: JSON.stringify({ email, password })
//       })
//       const data = await response.json()

//       if (!response.ok) throw new Error(data.message)

//       set(state => {
//         state.user = data.user
//         state.accessToken = data.accessToken
//         state.isAuthenticated = true
//         state.isLoading = false
//       })
//     } catch (error) {
//       set(state => {
//         state.error = error.message
//         state.isLoading = false
//       })
//     }
//   },

//   signup: async (name, email, password) => {
//     try {
//       set(state => { state.isLoading = true; state.error = null })

//       const response = await fetch('/api/auth/signup', {
//         method: 'POST',
//         body: JSON.stringify({ name, email, password })
//       })
//       const data = await response.json()

//       if (!response.ok) throw new Error(data.message)

//       set(state => {
//         state.user = data.user
//         state.accessToken = data.accessToken
//         state.isAuthenticated = true
//         state.isLoading = false
//       })
//     } catch (error) {
//       set(state => {
//         state.error = error.message
//         state.isLoading = false
//       })
//     }
//   },

//   logout: () => set(initialState),

//   setUser: (user) => set(state => { state.user = user }),

//   clearError: () => set(state => { state.error = null })
// })

// // stores/theme-slice.ts
// export interface ThemeState {
//   theme: 'light' | 'dark'
// }

// interface ThemeActions {
//   toggleTheme: () => void
//   setTheme: (theme: 'light' | 'dark') => void
// }

// export type ThemeSlice = ThemeState & ThemeActions

// export const createThemeSlice: StateCreator<
//   Store,
//   [["zustand/immer", never]],
//   [],
//   ThemeSlice
// > = (set) => ({
//   theme: 'light',
//   toggleTheme: () => set(state => {
//     state.theme = state.theme === 'light' ? 'dark' : 'light'
//   }),
//   setTheme: (theme) => set(state => { state.theme = theme })
// })

// // stores/store.ts
// import { create } from 'zustand'
// import { immer } from 'zustand/middleware/immer'
// import { devtools, subscribeWithSelector } from 'zustand/middleware'
// import { persist } from 'zustand/middleware'
// import { createAuthSlice } from './auth-slice'
// import { createThemeSlice } from './theme-slice'
// import { Store } from '@/types/store'

// export const useStore = create<Store>()(
//   devtools(
//     persist(
//       subscribeWithSelector(
//         immer((...a) => ({
//           ...createAuthSlice(...a),
//           ...createThemeSlice(...a),
//         }))
//       ),
//       { name: 'app-store' }
//     )
//   )
// )

// components/LoginForm.tsx
// const LoginForm = () => {
//   const { login, isLoading, error, clearError } = useStore(
//     useShallow((state) => ({
//       login: state.login,
//       isLoading: state.isLoading,
//       error: state.error,
//       clearError: state.clearError
//     }))
//   )

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     await login(email, password)
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       {error && <div className="error">{error}</div>}
//       {/* form fields */}
//     </form>
//   )
// }

// // components/ThemeToggle.tsx
// const ThemeToggle = () => {
//   const { theme, toggleTheme } = useStore(
//     useShallow((state) => ({
//       theme: state.theme,
//       toggleTheme: state.toggleTheme
//     }))
//   )

//   return (
//     <button onClick={toggleTheme}>
//       Current theme: {theme}
//     </button>
//   )
// }
