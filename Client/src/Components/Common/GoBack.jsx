import React from 'react'
import { Link } from 'react-router-dom'

const GoBack = ({topmargin}) => {
  return (
    <div className={`w-full flex justify-center mt-${topmargin} `}>
        <Link to={`/home`}><button className="rounded-xl border text-white active:bg-black  bg-slate-800 px-4 p-2">  Go back</button></Link>
    </div>
  )
}

export default GoBack