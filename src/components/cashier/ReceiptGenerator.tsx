"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hooks"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { generateReceipt } from "../../store/slices/cashierSlice"
import { cashierService } from "../../services/cashier.service"
import { Receipt, Printer, Mail, Download, CheckCircle } from "lucide-react"

interface ReceiptGeneratorProps {
  onComplete: () => void
}

export const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ onComplete }) => {
  const dispatch = useAppDispatch()
  const { currentTransaction, isLoading } = useAppSelector((state) => state.cashier)

  const [emailAddress, setEmailAddress] = useState("")
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [printed, setPrinted] = useState(false)

  useEffect(() => {
    if (currentTransaction.exit && !currentTransaction.receipt) {
      dispatch(generateReceipt(currentTransaction.exit.id!))
    }
  }, [currentTransaction.exit, currentTransaction.receipt, dispatch])

  const handlePrint = async () => {
    if (!currentTransaction.receipt) return

    setIsPrinting(true)
    try {
      await cashierService.printReceipt(currentTransaction.receipt.receiptNumber)
      setPrinted(true)
    } catch (error) {
      console.error("Print failed:", error)
      alert("Printing failed. Please try again.")
    }
    setIsPrinting(false)
  }

  const handleEmailSend = async () => {
    if (!currentTransaction.receipt || !emailAddress) return

    setIsEmailSending(true)
    try {
      await cashierService.emailReceipt(currentTransaction.receipt.receiptNumber, emailAddress)
      setEmailSent(true)
    } catch (error) {
      console.error("Email send failed:", error)
      alert("Email sending failed. Please try again.")
    }
    setIsEmailSending(false)
  }

  const handleDownload = () => {
    if (!currentTransaction.receipt) return

    // Create a printable version
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(generateReceiptHTML())
      printWindow.document.close()
      printWindow.print()
    }
  }

  const generateReceiptHTML = (): string => {
    const receipt = currentTransaction.receipt!
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${receipt.receiptNumber}</title>
          <style>
            body { font-family: monospace; max-width: 300px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .row { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { border-top: 1px solid #000; padding-top: 10px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>PARKING RECEIPT</h2>
            <p>${receipt.parkingName}</p>
            <p>Receipt #: ${receipt.receiptNumber}</p>
          </div>
          
          <div class="row">
            <span>License Plate:</span>
            <span>${receipt.licensePlate}</span>
          </div>
          
          <div class="row">
            <span>Entry:</span>
            <span>${new Date(receipt.entryTime).toLocaleString()}</span>
          </div>
          
          <div class="row">
            <span>Exit:</span>
            <span>${new Date(receipt.exitTime).toLocaleString()}</span>
          </div>
          
          <div class="row">
            <span>Duration:</span>
            <span>${receipt.duration}</span>
          </div>
          
          ${receipt.charges
            .map(
              (charge) => `
            <div class="row">
              <span>${charge.description}:</span>
              <span>${charge.type === "DISCOUNT" ? "-" : ""}$${charge.amount.toFixed(2)}</span>
            </div>
          `,
            )
            .join("")}
          
          <div class="row total">
            <span>TOTAL:</span>
            <span>$${receipt.totalAmount.toFixed(2)}</span>
          </div>
          
          <div class="row">
            <span>Payment:</span>
            <span>${receipt.paymentMethod}</span>
          </div>
          
          <div class="row">
            <span>Operator:</span>
            <span>${receipt.operatorName}</span>
          </div>
          
          <div style="text-align: center; margin-top: 20px; font-size: 12px;">
            <p>Thank you for parking with us!</p>
            <p>${new Date(receipt.timestamp).toLocaleString()}</p>
          </div>
        </body>
      </html>
    `
  }

  if (isLoading || !currentTransaction.receipt) {
    return (
      <div className="text-center py-12">
        <Receipt className="mx-auto h-16 w-16 text-gray-400 mb-4 animate-pulse" />
        <p className="text-gray-600">Generating receipt...</p>
      </div>
    )
  }

  const receipt = currentTransaction.receipt

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Receipt className="mr-3 h-6 w-6" />
          Receipt Generated
        </h2>
        <div className="flex items-center text-green-600">
          <CheckCircle className="mr-1 h-5 w-5" />
          <span className="text-sm font-medium">Transaction Complete</span>
        </div>
      </div>

      {/* Receipt Preview */}
      <Card className="p-6 bg-gray-50">
        <div className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-sm border font-mono text-sm">
          <div className="text-center border-b-2 border-black pb-4 mb-4">
            <h3 className="font-bold text-lg">PARKING RECEIPT</h3>
            <p className="text-gray-600">{receipt.parkingName}</p>
            <p className="text-xs">Receipt #: {receipt.receiptNumber}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>License Plate:</span>
              <span className="font-bold">{receipt.licensePlate}</span>
            </div>

            <div className="flex justify-between">
              <span>Entry:</span>
              <span>{new Date(receipt.entryTime).toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Exit:</span>
              <span>{new Date(receipt.exitTime).toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{receipt.duration}</span>
            </div>

            <div className="border-t pt-2 mt-4">
              {receipt.charges.map((charge, index) => (
                <div key={index} className="flex justify-between">
                  <span>{charge.description}:</span>
                  <span className={charge.type === "DISCOUNT" ? "text-green-600" : ""}>
                    {charge.type === "DISCOUNT" ? "-" : ""}${charge.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-black pt-2 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span>${receipt.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <span>Payment:</span>
              <span>{receipt.paymentMethod}</span>
            </div>

            <div className="flex justify-between">
              <span>Operator:</span>
              <span>{receipt.operatorName}</span>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-gray-500">
            <p>Thank you for parking with us!</p>
            <p>{new Date(receipt.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {/* Receipt Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Print Receipt */}
        <Card className="p-4">
          <div className="text-center">
            <Printer className={`mx-auto h-8 w-8 mb-2 ${printed ? "text-green-600" : "text-gray-400"}`} />
            <h4 className="font-medium mb-2">Print Receipt</h4>
            <Button
              onClick={handlePrint}
              disabled={isPrinting}
              variant={printed ? "outline" : "default"}
              className="w-full"
            >
              {isPrinting ? "Printing..." : printed ? "Printed ✓" : "Print"}
            </Button>
          </div>
        </Card>

        {/* Email Receipt */}
        <Card className="p-4">
          <div className="text-center">
            <Mail className={`mx-auto h-8 w-8 mb-2 ${emailSent ? "text-green-600" : "text-gray-400"}`} />
            <h4 className="font-medium mb-2">Email Receipt</h4>
            {!emailSent ? (
              <div className="space-y-2">
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="customer@email.com"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
                <Button onClick={handleEmailSend} disabled={isEmailSending || !emailAddress} className="w-full">
                  {isEmailSending ? "Sending..." : "Send"}
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full">
                Sent ✓
              </Button>
            )}
          </div>
        </Card>

        {/* Download Receipt */}
        <Card className="p-4">
          <div className="text-center">
            <Download className="mx-auto h-8 w-8 mb-2 text-gray-400" />
            <h4 className="font-medium mb-2">Download</h4>
            <Button onClick={handleDownload} variant="outline" className="w-full">
              Download PDF
            </Button>
          </div>
        </Card>
      </div>

      {/* Complete Transaction */}
      <div className="text-center">
        <Button onClick={onComplete} className="px-8 py-3 bg-green-600 hover:bg-green-700">
          Complete Transaction
        </Button>
      </div>
    </div>
  )
}
