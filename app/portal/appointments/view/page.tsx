"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Calendar, Clock, User, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Appointment {
  appointment_id: number
  doctor_name: string
  specialization: string
  room_number: number
  patient_name: string
  age: number
  gender: string
  appointment_date: string
  appointment_time: string
  status: string
  user_email: string
  created_at: string
}

export default function ViewAppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("http://localhost:8000/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch appointments")
      }

      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Calendar className="mr-2 h-6 w-6" />
          Your Appointments
        </h1>
        <Button variant="outline" asChild>
          <Link href="/portal/appointments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Book New Appointment
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Appointments Found</h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              You haven't booked any appointments yet. Schedule your first appointment to get started.
            </p>
            <Button asChild>
              <Link href="/portal/appointments">Book Your First Appointment</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <Card key={appointment.appointment_id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="bg-blue-50 p-6 flex flex-col justify-center items-center md:w-1/4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Appointment Date</p>
                    <p className="text-xl font-bold mb-1">{formatDate(appointment.appointment_date)}</p>
                    <div className="flex items-center justify-center text-blue-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <p>{appointment.appointment_time}</p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 md:w-3/4">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Dr. {appointment.doctor_name}</h3>
                      <p className="text-gray-500">{appointment.specialization}</p>
                    </div>
                    <Badge className={`${getStatusColor(appointment.status)} mt-2 md:mt-0`}>{appointment.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="font-medium">{appointment.patient_name}</p>
                        <p className="text-sm text-gray-500">
                          {appointment.age} years, {appointment.gender}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">Room {appointment.room_number}</p>
                        <p className="text-sm text-gray-500">Medical Center, Floor 2</p>
                      </div>
                    </div>
                  </div>

                  {/* <div className="flex justify-end mt-6 space-x-2">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Cancel
                    </Button>
                  </div> */}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
