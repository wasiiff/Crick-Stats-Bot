"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  BarChart3,
  Activity,
  Trophy,
  Users,
  TrendingUp,
} from "lucide-react";
import { useAskQuestionMutation } from "../services/chatApi";

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<
    Array<{ role: "user" | "assistant"; payload: any }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  const [askQuestion, { isLoading }] = useAskQuestionMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const send = async () => {
    if (!question.trim() || isLoading) return;
    const q = question.trim();
    setHistory((h) => [...h, { role: "user", payload: q }]);
    setQuestion("");

    try {
      const data = await askQuestion({ question: q }).unwrap();
      setHistory((h) => [...h, { role: "assistant", payload: data }]);
    } catch (err) {
      console.error(err);
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          payload: {
            type: "text",
            text: "Error contacting backend. Please try again.",
          },
        },
      ]);
    }
  };

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "number") {
      if (value > 999) return value.toLocaleString();
      return value.toString();
    }
    return value.toString();
  };

  const renderMessage = (m: any) => {
    if (m.role === "user") {
      return (
        <div className="flex justify-end mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-3xl max-w-xs lg:max-w-2xl shadow-lg">
            <p className="text-sm font-medium">{m.payload}</p>
          </div>
        </div>
      );
    }

    if (m.payload.type === "text") {
      return (
        <div className="flex justify-start mb-4">
          <div className="bg-white text-gray-800 px-6 py-4 rounded-3xl shadow-md border border-gray-100 max-w-xs lg:max-w-2xl">
            <p className="text-sm leading-relaxed">{m.payload.text}</p>
          </div>
        </div>
      );
    }

    if (m.payload.type === "table") {
      return (
        <div className="flex justify-start mb-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-full overflow-hidden">
            {m.payload.text && (
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-700 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                  {m.payload.text}
                </p>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    {m.payload.columns.map((c: string, index: number) => (
                      <th
                        key={index}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {m.payload.rows.map((row: any[], rowIndex: number) => (
                    <tr
                      key={rowIndex}
                      className={`${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      } hover:bg-blue-50/50 transition-colors duration-150`}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap font-medium"
                        >
                          {formatCellValue(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {m.payload.rows.length} record
                {m.payload.rows.length !== 1 ? "s" : ""} displayed
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  const quickQuestions = [
    "Show top 10 ODI Teams by average",
    "Latest Test match results",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg mr-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cricket Stats AI
              </h1>
              <p className="text-gray-600 text-lg mt-2">
                Real-time cricket statistics, player records, and match insights
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <Activity className="w-6 h-6 text-green-600 mb-2 mx-auto" />
              <p className="text-sm text-gray-600">Live Matches</p>
              <p className="text-xl font-bold text-gray-800">Real-time</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <Trophy className="w-6 h-6 text-yellow-600 mb-2 mx-auto" />
              <p className="text-sm text-gray-600">Records</p>
              <p className="text-xl font-bold text-gray-800">Historical</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <Users className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
              <p className="text-sm text-gray-600">Players</p>
              <p className="text-xl font-bold text-gray-800">Global</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <TrendingUp className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
              <p className="text-sm text-gray-600">Analytics</p>
              <p className="text-xl font-bold text-gray-800">Advanced</p>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        {history.length === 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
              Try these popular queries:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(q)}
                  className="bg-white hover:bg-blue-50 text-gray-700 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium transition-all duration-200 hover:border-blue-300 hover:shadow-md text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Box */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-6">
          <div className="h-96 lg:h-[500px] overflow-auto p-6">
            {history.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">
                    Ready to explore cricket stats!
                  </p>
                  <p className="text-sm">
                    Ask me anything about cricket statistics and records.
                  </p>
                </div>
              </div>
            ) : (
              history.map((m, i) => <div key={i}>{renderMessage(m)}</div>)
            )}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white px-6 py-4 rounded-3xl shadow-md border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      Analyzing cricket data...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex gap-4">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) send();
              }}
              className="flex-1 border border-gray-300 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 bg-gray-50 focus:bg-white transition-all duration-200"
              placeholder="Ask about cricket stats (e.g., 'Top 5 Test Matches')"
              disabled={isLoading}
            />
            <button
              onClick={send}
              disabled={isLoading || !question.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
              {isLoading ? "Searching..." : "Ask AI"}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>
              Press Enter to send • Real cricket data from official sources
            </span>
            <span>{question.length}/500</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-gray-600 font-medium">
            Powered by Live Cricket Data API • Updated Every Minute
          </p>
          <p className="text-xs text-gray-500">
            Get real-time scores and historical
            records
          </p>
        </div>
      </div>
    </div>
  );
}
