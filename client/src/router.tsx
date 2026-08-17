import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { authClient } from './api/client'
import { Navbar } from './components/Navbar'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { ArticleDetailPage } from './pages/ArticlePage'
import { AuthorProfilePage } from './pages/AuthorProfilePage'

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#ebe9e6] dark:bg-[#0d0f17]">
      <Navbar />
      <main className="max-w-6xl mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: async () => {
    const { data } = await authClient.getSession()
    if (!data?.user) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardPage,
})

const articleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/article/$id',
  component: ArticleDetailPage,
})

const authorDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/author/$authorId',
  validateSearch: z.object({
    name: z.string().optional(),
  }),
  component: AuthorProfilePage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
  articleDetailRoute,
  authorDetailRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}