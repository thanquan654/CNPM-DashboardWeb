import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import MainLayout from '@/components/layout/MainLayout'
import DashboardPage from '@/pages/DashboardPage'
import RecommendationsPage from '@/pages/RecommendationsPage'

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<Routes>
			<Route
				path="/"
				element={
					<MainLayout>
						<DashboardPage />
					</MainLayout>
				}
			/>
			<Route
				path="/recommendations"
				element={
					<MainLayout>
						<RecommendationsPage />
					</MainLayout>
				}
			/>
		</Routes>
	</BrowserRouter>,
)
