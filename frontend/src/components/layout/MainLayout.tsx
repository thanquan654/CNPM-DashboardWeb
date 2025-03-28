import { AppSidebar } from '@/components/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

export default function MainLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SidebarProvider>
			<div className="flex min-h-screen w-screen">
				<AppSidebar />
				<div className="flex flex-col flex-1">
					<SidebarTrigger className="md:hidden justify-start bg-gray-300 w-full h-8 px-2 rounded-none ">
						<span className="sr-only">Toggle sidebar</span>
					</SidebarTrigger>
					<main className="flex-1">{children}</main>
				</div>
			</div>
		</SidebarProvider>
	)
}
