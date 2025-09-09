import React, { useState, useEffect } from 'react'
    import Select from 'react-select'
    import moment from 'moment-timezone'

    function App() {
      const [time, setTime] = useState(0)
      const [isRunning, setIsRunning] = useState(false)
      const [recordedTimes, setRecordedTimes] = useState([])
      const [selectedTimezone, setSelectedTimezone] = useState(null)

      // Generate timezone options
      const timezoneOptions = moment.tz.names().map(tz => ({
        value: tz,
        label: tz
      }))

      // Default to system timezone
      useEffect(() => {
        const systemTimezone = moment.tz.guess()
        setSelectedTimezone({
          value: systemTimezone,
          label: systemTimezone
        })
      }, [])

      // Stopwatch logic
      useEffect(() => {
        let intervalId
        if (isRunning) {
          intervalId = setInterval(() => {
            setTime(prevTime => prevTime + 10)
          }, 10)
        }
        return () => clearInterval(intervalId)
      }, [isRunning])

      // Format time
      const formatTime = (milliseconds) => {
        const hours = Math.floor(milliseconds / 3600000)
        const minutes = Math.floor((milliseconds % 3600000) / 60000)
        const seconds = Math.floor((milliseconds % 60000) / 1000)
        const ms = milliseconds % 1000

        return `${hours.toString().padStart(2, '0')}:${
          minutes.toString().padStart(2, '0')}:${
          seconds.toString().padStart(2, '0')}.${
          ms.toString().padStart(3, '0')}`
      }

      // Start stopwatch
      const handleStart = () => {
        setIsRunning(true)
      }

      // Pause stopwatch
      const handlePause = () => {
        setIsRunning(false)
      }

      // Reset stopwatch
      const handleReset = () => {
        setTime(0)
        setIsRunning(false)
        setRecordedTimes([])
      }

      // Record time
      const handleRecord = () => {
        const formattedTime = formatTime(time)
        const timezoneTime = moment().tz(selectedTimezone.value).format('YYYY-MM-DD HH:mm:ss z')
        setRecordedTimes([...recordedTimes, `${formattedTime} (${timezoneTime})`])
      }

      return (
        <div className="stopwatch-container">
          <div className="timezone-select">
            <Select
              value={selectedTimezone}
              onChange={setSelectedTimezone}
              options={timezoneOptions}
              placeholder="Select Timezone"
            />
          </div>

          <div className="time-display">
            {formatTime(time)}
          </div>

          <div className="controls">
            {!isRunning ? (
              <button onClick={handleStart}>Start</button>
            ) : (
              <button onClick={handlePause}>Pause</button>
            )}
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleRecord}>Record</button>
          </div>

          {recordedTimes.length > 0 && (
            <div className="recorded-times">
              <h3>Recorded Times</h3>
              {recordedTimes.map((recordedTime, index) => (
                <div key={index}>{recordedTime}</div>
              ))}
            </div>
          )}
        </div>
      )
    }

    export default App
