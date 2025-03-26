import { AppSidebar } from '@/components/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

export default function MainLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SidebarProvider>
			<div className="flex min-h-screen">
				<AppSidebar />
				<main className="flex-1">{children}</main>
			</div>
		</SidebarProvider>
	)
}
