import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MessageSquare, Clock, Users } from "lucide-react"

export default function PortalDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">0</h2>
            <p className="text-gray-500">Upcoming Appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">0</h2>
            <p className="text-gray-500">Chat Messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold">0</h2>
            <p className="text-gray-500">Hours Saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold">0</h2>
            <p className="text-gray-500">Doctors Available</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild className="h-auto py-4 justify-start">
              <Link href="/portal/appointments">
                <Calendar className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Book Appointment</div>
                  <div className="text-xs text-muted-foreground">Schedule a visit with a doctor</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link href="/portal/appointments/view">
                <Calendar className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">View Appointments</div>
                  <div className="text-xs text-muted-foreground">Check your scheduled visits</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link href="/portal/chat">
                <MessageSquare className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Medical Chat</div>
                  <div className="text-xs text-muted-foreground">Get medical advice</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link href="/portal/profile">
                <Users className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Update Profile</div>
                  <div className="text-xs text-muted-foreground">Manage your information</div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto py-4 justify-start">
              <Link href="/portal/records">
                <Clock className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">View Records</div>
                  <div className="text-xs text-muted-foreground">Access your medical history</div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity to display</p>
              <p className="text-sm mt-2">Your activity will appear here once you start using the platform</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
