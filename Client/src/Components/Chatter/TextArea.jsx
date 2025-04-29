import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from 'react';

const TextArea = () => {
  const textAreaRef = useRef(null);

  const handleInput = () => {
    const textArea = textAreaRef.current;
    textArea.style.height = "auto"; // Reset height to auto to calculate new height
    textArea.style.height = `${textArea.scrollHeight}px`; // Set height based on scrollHeight

    if (textArea.scrollHeight > 150) { // Example max height: 150px
      textArea.style.height = "150px";
      textArea.style.overflowY = "auto";
    } else {
      textArea.style.overflowY = "hidden";
    }
  };

  return (
    <div className='w-full fixed bottom-0 left-0 right-0 p-2 flex items-end gap-4'>
      <div className='flex-grow'>
        <textarea
          ref={textAreaRef}
          className='rounded-full bg-[#212222] px-4 w-full resize-none overflow-hidden text-white h-12'
          placeholder='Message'
          rows={1} 
          onInput={handleInput} 
          style={{
            minHeight: "3rem", // Equivalent to h-12 in Tailwind
            maxHeight: "80px", 
            outline: "none",
            paddingTop:"0.75rem",
            paddingBottom: "0.75rem"
          }}
        ></textarea>
      </div>
      <div className='flex items-end'>
        <FontAwesomeIcon
          className='text-xl border rounded-full p-3 bg-green-700'
          icon={faPaperPlane}
          style={{ color: "#ffffff" }}
        />
      </div>
    </div>
  );
};

export default TextArea;