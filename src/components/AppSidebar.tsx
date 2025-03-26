'use client'

import { BarChart, LayoutDashboard, ShoppingBag } from 'lucide-react'
import { Link, useLocation } from 'react-router'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'

export function AppSidebar() {
	const pathname = useLocation().pathname

	const menuItems = [
		{
			title: 'Dashboard',
			icon: LayoutDashboard,
			href: '/',
			isActive: pathname === '/',
		},
		{
			title: 'Product Recommendations',
			icon: ShoppingBag,
			href: '/recommendations',
			isActive: pathname === '/recommendations',
		},
	]

	return (
		<Sidebar>
			<SidebarHeader className="flex items-center justify-center py-4">
				<div className="flex items-center gap-2">
					<BarChart className="h-6 w-6" />
					<span className="font-semibold text-lg">Analytics Hub</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					{menuItems.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild isActive={item.isActive}>
								<Link to={item.href}>
									<item.icon className="h-6 w-6" />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter className="p-4">
				<div className="text-xs text-muted-foreground text-center">
					© 2025 Analytics Hub
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}
