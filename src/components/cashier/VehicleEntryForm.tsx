"use client"

import React, { useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Card } from "../ui/Card"
import { recordVehicleEntry, detectLicensePlate } from "../../store/slices/cashierSlice"
import { Camera, Keyboard, Car, Clock } from "lucide-react"

interface VehicleEntryFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export const VehicleEntryForm: React.FC<VehicleEntryFormProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch()
  const { isLoading, lastDetectedPlate } = useAppSelector((state) => state.cashier)
  const { user } = useAppSelector((state) => state.auth)

  const [inputMethod, setInputMethod] = useState<"auto" | "manual">("auto")
  const [licensePlate, setLicensePlate] = useState("")
  const [vehicleType, setVehicleType] = useState("CAR")
  const [notes, setNotes] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setInputMethod("manual")
    }
  }

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsDetecting(true)
    const canvas = canvasRef.current
    const video = videoRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL("image/jpeg", 0.8)

      try {
        const detectedPlate = await dispatch(detectLicensePlate(imageData)).unwrap()
        setLicensePlate(detectedPlate)
      } catch (error) {
        console.error("License plate detection failed:", error)
      }
    }
    setIsDetecting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!licensePlate.trim()) {
      alert("Please enter a license plate number")
      return
    }

    try {
      await dispatch(
        recordVehicleEntry({
          licensePlate: licensePlate.toUpperCase(),
          vehicleType,
          entryTime: new Date(),
          parkingId: user?.parkingId || "",
          operatorId: user?.id || "",
          isManualEntry: inputMethod === "manual",
          notes,
        }),
      ).unwrap()

      onSuccess()
    } catch (error) {
      console.error("Failed to record vehicle entry:", error)
    }
  }

  React.useEffect(() => {
    if (inputMethod === "auto") {
      startCamera()
    }
  }, [inputMethod])

  React.useEffect(() => {
    if (lastDetectedPlate) {
      setLicensePlate(lastDetectedPlate)
    }
  }, [lastDetectedPlate])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Car className="mr-3 h-6 w-6" />
          Vehicle Entry
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Input Method Selection */}
      <div className="flex space-x-4">
        <Button
          type="button"
          variant={inputMethod === "auto" ? "default" : "outline"}
          onClick={() => setInputMethod("auto")}
          className="flex items-center"
        >
          <Camera className="mr-2 h-4 w-4" />
          Auto Detection
        </Button>
        <Button
          type="button"
          variant={inputMethod === "manual" ? "default" : "outline"}
          onClick={() => setInputMethod("manual")}
          className="flex items-center"
        >
          <Keyboard className="mr-2 h-4 w-4" />
          Manual Entry
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* License Plate Input */}
        {inputMethod === "auto" ? (
          <Card className="p-4">
            <div className="space-y-4">
              <div className="relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-64 bg-black rounded-lg" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white border-dashed w-3/4 h-1/3 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">Position license plate here</span>
                  </div>
                </div>
              </div>
              <Button type="button" onClick={captureImage} disabled={isDetecting} className="w-full">
                {isDetecting ? "Detecting..." : "Capture & Detect"}
              </Button>
            </div>
          </Card>
        ) : null}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">License Plate Number</label>
          <Input
            type="text"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
            placeholder="Enter license plate"
            className="text-lg font-mono tracking-wider"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CAR">Car</option>
            <option value="MOTORCYCLE">Motorcycle</option>
            <option value="TRUCK">Truck</option>
            <option value="VAN">Van</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Recording Entry..." : "Record Entry"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
