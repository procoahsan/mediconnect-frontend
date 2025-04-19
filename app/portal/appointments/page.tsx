"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Calendar } from "lucide-react"
import Link from "next/link"

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState<string[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [success, setSuccess] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [formData, setFormData] = useState({
    patient_name: "",
    age: "",
    gender: "male",
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    if (selectedDoctor) {
      fetchAvailableSlots(selectedDoctor)
    }
  }, [selectedDoctor])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/api/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch doctors")
      }

      const data = await response.json()
      setDoctors(data.doctors || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableSlots = async (doctorName: string) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8000/api/available-slots?doctor_name=${encodeURIComponent(doctorName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch available slots")
      }

      const data = await response.json()
      setAvailableSlots(data.slots || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!selectedDoctor || !selectedSlot) {
      setError("Please select a doctor and an appointment slot")
      return
    }

    if (!formData.patient_name || !formData.age) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor_name: selectedDoctor,
          patient_name: formData.patient_name,
          age: Number.parseInt(formData.age),
          gender: formData.gender,
          chosen_slot: selectedSlot,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Failed to book appointment")
      }

      setSuccess("Appointment booked successfully!")
      // Reset form
      setSelectedSlot("")
      setFormData({
        patient_name: "",
        age: "",
        gender: "male",
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Calendar className="mr-2 h-6 w-6" />
          Book an Appointment
        </h1>
        <Button variant="outline" asChild>
          <Link href="/portal/appointments/view">
            <Calendar className="mr-2 h-4 w-4" />
            View Your Appointments
          </Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Schedule Your Visit</CardTitle>
          <CardDescription>Fill in the details below to book an appointment with one of our doctors</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDoctor && (
              <div className="space-y-2">
                <Label htmlFor="slot">Available Slots</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <div
                        key={slot}
                        className={`p-2 border rounded-md cursor-pointer transition-colors ${
                          selectedSlot === slot ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-2">No available slots</p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="patient_name">Patient Name</Label>
              <Input
                id="patient_name"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup value={formData.gender} onValueChange={handleGenderChange} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
