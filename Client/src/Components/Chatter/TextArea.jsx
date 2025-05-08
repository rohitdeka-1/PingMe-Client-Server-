
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { useRef, useState } from "react"

const TextArea = ({ onSendMessage }) => {
  const textAreaRef = useRef(null)
  const [message, setMessage] = useState("")

  const handleInput = () => {
    const textArea = textAreaRef.current
    if (!textArea) return

    textArea.style.height = "auto"
    textArea.style.height = `${textArea.scrollHeight}px`

    if (textArea.scrollHeight > 150) {
      textArea.style.height = "150px"
      textArea.style.overflowY = "auto"
    } else {
      textArea.style.overflowY = "hidden"
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submitMessage()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitMessage()
  }

  const submitMessage = () => {
    if (!message.trim()) return

    onSendMessage(message)
    setMessage("")

    if (textAreaRef.current) {
      textAreaRef.current.style.height = "3rem"
      textAreaRef.current.style.overflowY = "hidden"
    }
  }

  return (
    <div className="w-full fixed bottom-0 left-0 right-0 p-2 flex items-end bg-[#1E1E1E]">
      <form onSubmit={handleSubmit} className="flex w-full gap-3">
        <div className="flex-grow relative">
          <textarea
            ref={textAreaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="rounded-full bg-[#212222] px-4 py-3 w-full resize-none overflow-hidden text-white"
            placeholder="Message"
            rows={1}
            style={{
              minHeight: "3rem",
              maxHeight: "150px",
              outline: "none",
            }}
          />
        </div>
        <div className="flex items-end pb-0.5">
          <button
            type="submit"
            className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            aria-label="Send message"
          >
            <FontAwesomeIcon
              className="text-xl border rounded-full p-3 bg-white"
              icon={faPaperPlane}
              style={{ color: "#000000" }}
            />
          </button>
        </div>
      </form>
    </div>
  )
}

export default TextArea
