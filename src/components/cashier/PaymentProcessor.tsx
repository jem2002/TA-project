"use client"

import type React from "react"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Card } from "../ui/Card"
import { processVehicleExit } from "../../store/slices/cashierSlice"
import { DollarSign, CreditCard, Smartphone } from "lucide-react"

interface PaymentProcessorProps {
  onSuccess: () => void
  onCancel: () => void
}

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch()
  const { currentTransaction, isLoading } = useAppSelector((state) => state.cashier)
  const { user } = useAppSelector((state) => state.auth)

  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "DIGITAL">("CASH")
  const [amountReceived, setAmountReceived] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [notes, setNotes] = useState("")

  const totalAmount = currentTransaction.charges?.totalAmount || 0
  const finalAmount = totalAmount - discountAmount
  const changeAmount =
    paymentMethod === "CASH" ? Math.max(0, Number.parseFloat(amountReceived || "0") - finalAmount) : 0

  const handlePayment = async () => {
    if (!currentTransaction.entry || !currentTransaction.charges) {
      alert("Missing transaction data")
      return
    }

    if (paymentMethod === "CASH" && Number.parseFloat(amountReceived) < finalAmount) {
      alert("Insufficient payment amount")
      return
    }

    try {
      await dispatch(
        processVehicleExit({
          entryId: currentTransaction.entry.id!,
          licensePlate: currentTransaction.entry.licensePlate,
          exitTime: new Date(),
          totalAmount,
          discountAmount,
          finalAmount,
          paymentMethod,
          operatorId: user?.id || "",
          receiptNumber: `RCP-${Date.now()}`,
          notes,
        }),
      ).unwrap()

      onSuccess()
    } catch (error) {
      console.error("Payment processing failed:", error)
      alert("Payment processing failed. Please try again.")
    }
  }

  const paymentMethods = [
    { value: "CASH", label: "Cash", icon: DollarSign, color: "bg-green-500" },
    { value: "CARD", label: "Card", icon: CreditCard, color: "bg-blue-500" },
    { value: "DIGITAL", label: "Digital", icon: Smartphone, color: "bg-purple-500" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <DollarSign className="mr-3 h-6 w-6" />
          Process Payment
        </h2>
      </div>

      {/* Payment Summary */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-2">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
        <div className="grid grid-cols-3 gap-3">
          {paymentMethods.map((method) => {
            const IconComponent = method.icon
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => setPaymentMethod(method.value as any)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === method.value
                    ? `${method.color} text-white border-transparent`
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                <IconComponent className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{method.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Cash Payment Details */}
      {paymentMethod === "CASH" && (
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount Received</label>
              <Input
                type="number"
                step="0.01"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                placeholder="0.00"
                className="text-lg"
              />
            </div>

            {amountReceived && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">Change Due</span>
                  <span className="text-2xl font-bold text-blue-900">${changeAmount.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Discount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Discount Amount (Optional)</label>
        <Input
          type="number"
          step="0.01"
          value={discountAmount}
          onChange={(e) => setDiscountAmount(Number.parseFloat(e.target.value) || 0)}
          placeholder="0.00"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          onClick={handlePayment}
          disabled={isLoading || (paymentMethod === "CASH" && !amountReceived)}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isLoading ? "Processing..." : "Complete Payment"}
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  )
}
