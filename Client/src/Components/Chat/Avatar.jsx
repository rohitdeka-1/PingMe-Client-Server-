import React from 'react'

const Avatar = () => {
return (
    <div>
            <img 
                src='./src/assets/react.svg' 
                className='border border-slate-600 bg-slate-700 p-3 rounded-full object-fit' 
                style={{ objectFit: 'contain' }} 
            />  
    </div>
)
}

export default Avatar