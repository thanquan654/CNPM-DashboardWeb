import { Card, CardContent } from '@/components/ui/card'

export default function DashboardPage() {
	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Dashboard</h1>

			<Card className="w-full p-2">
				<CardContent className="p-2">
					<div className="aspect-video w-full border rounded-md bg-muted">
						<iframe
							src="https://playground.powerbi.com/sampleReportEmbed" // Replace with your actual PowerBI embed URL
							className="w-full h-full"
							title="PowerBI Dashboard"
							allowFullScreen
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
