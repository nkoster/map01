import React, {useEffect, useRef, useState} from 'react'
const Timer = () => {

  const [num, setNum] = useState(Date.now())

  let intervalRef = useRef()
  
  useEffect(() => {
    setNum(() => Date.now())
    // @ts-ignore
    intervalRef.current = setInterval(() => {
      setNum(() => Date.now() - num)
    }, 10)
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <span style={{color: '#aaa'}}>
      ({(Math.floor(num / 10) / 100).toFixed(2)}s)
    </span>
  )

}

export default Timer
