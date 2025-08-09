import React, { useEffect, useRef, useState } from "react";
import Card from "@/ui/card";

export default function TerminalPortfolio() {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    handleCommand("welcome");

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = async (cmd: string) => {
    const commandLine = `gangothry@portfolio:~$ ${cmd}`;
    setHistory((prev) => [...prev, commandLine]);

    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    try {
      const res = await fetch(`/api/ai?query=${encodeURIComponent(cmd)}`);
      const data = await res.json();
      const lines = data.response
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);

      for (const line of lines) {
        await new Promise((res) => setTimeout(res, 50));
        setHistory((prev) => [...prev, line]);
      }
    } catch {
      setHistory((prev) => [...prev, "⚠️ Error fetching response."]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input.trim());
      setInput("");
    }
  };

  return (
    <div className="terminal-wrapper" onClick={() => inputRef.current?.focus()}>
      {/* Header */}
      <div className="page-header">
        <h1 className="main-heading">Gangothry</h1>
        <h2 className="sub-heading">Software & AI Engineer</h2>
      </div>

      {/* Terminal */}
      <div className="main-terminal">
        <div className="left-panel">
          <Card />
        </div>

        <div className="right-terminal">
          <div className="command-list-wrapper">
            <div className="command-list">
              help | about | projects | skills | experience | contact | education | certifications | sudo | clear
            </div>
            <div className="separator-line" />
          </div>

          <div className="chat-box">
            <div className="terminal-box">
              {history.map((line, idx) => (
                <div key={idx} className="line">
                  {line.startsWith("gangothry@portfolio:~$") ? (
                    <>
                      <span className="prompt">gangothry@portfolio:~$</span>
                      <span className="command">
                        {" "}
                        {line.replace("gangothry@portfolio:~$", "").trim()}
                      </span>
                    </>
                  ) : (
                    <span className="response hoverable">{line}</span>
                  )}
                </div>
              ))}

              <div className="input-line">
                <span className="prompt">gangothry@portfolio:~$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="command-input"
                  autoFocus
                />
              </div>

              <div ref={bottomRef} />
            </div>
          </div>
        </div>
      </div>

      <div className="footer">{currentTime}</div>
    </div>
  );
}
