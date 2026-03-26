import { useState } from "react";
import { sendChat } from "../services/chatService";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function sendMessage(text) {
    console.log("Sending message:", text);
    if (!text || !text.trim()) return;
    const userMsg = { role: "user", text };
    setMessages((s) => [...s, userMsg]);
    setLoading(true);
    setError(null);
    try {
      const reply = await sendChat(text);
      const aiMsg = { role: "ai", text: String(reply || "") };
      console.log("Received reply:", aiMsg.text);
      setMessages((s) => [...s, aiMsg]);
      return aiMsg.text;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setMessages([]);
    setError(null);
  }

  return { messages, loading, error, sendMessage, clear, setMessages };
}

export default useChat;
