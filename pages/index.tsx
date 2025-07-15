import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Message } from "@/types";
import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";
import { Chat } from "@/components/Chat/Chat";
// import { APIKeyInput } from "@/components/API-Key-Input"; // optional

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = response.body;
      if (!data) return;

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let isFirstChunk = true;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value);

        if (isFirstChunk) {
          isFirstChunk = false;
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: chunk },
          ]);
        } else {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            const updated = { ...last, content: last.content + chunk };
            return [...prev.slice(0, -1), updated];
          });
        }
      }
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: `Wrong Answer Only!`,
      },
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Welcome to WrongAI — I always give wrong answers!`,
      },
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>WrongAI</title>
        <meta
          name="description"
          content="WrongAI — The chatbot that gives wrong answers on purpose."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          {/* Uncomment if API key input needed */}
          {/* <APIKeyInput apiKey={""} onChange={(key) => {}} /> */}

          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
