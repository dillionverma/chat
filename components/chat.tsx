"use client";

import LineChart from "@/components/ai/LineChart";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useAutosizeTextArea from "@/lib/useAutosizeTextArea";
import { cn } from "@/lib/utils";
import { ChevronRightIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useChat } from "ai/react";
import { Bot, User } from "lucide-react";
import OpenAI from "openai";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const RenderAIComponent = ({
  function_call,
}: {
  function_call: OpenAI.Chat.ChatCompletionMessage.FunctionCall;
}) => {
  if (function_call.name === "render_line_chart") {
    const props = JSON.parse(function_call.arguments);
    console.log("props", props);
    return <LineChart {...props} />;
  }

  return null;
};

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      experimental_onFunctionCall: async (function_call) => {
        console.log(function_call);
      },
    });
  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, input);

  const disabled = isLoading || input.length === 0;

  console.log("messages", messages);

  return (
    <div className="flex flex-col items-center justify-between pb-40">
      {messages.map((message, i) => (
        <div
          key={i}
          className={cn(
            "flex w-full items-center justify-center border-b border-gray-200 py-8",
            message.role === "user" ? "bg-white" : "bg-gray-100"
          )}
        >
          <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
            <div
              className={cn(
                "p-1.5 rounded-full",
                message.role === "assistant" ? "bg-gray-500" : "bg-black"
              )}
            >
              {message.role === "user" ? (
                <User width={20} className=" h-5 w-5 m-auto text-white " />
              ) : (
                <Bot width={20} className=" h-5 w-5 m-auto text-white " />
              )}
            </div>

            {/* Render Content*/}
            {!message.function_call && (
              <ReactMarkdown
                className="prose w-full break-words prose-p:leading-relaxed"
                remarkPlugins={[remarkGfm]}
                components={{
                  // open links in new tab
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}

            {/* Render AI Component */}
            {message.function_call && (
              <RenderAIComponent
                function_call={
                  message.function_call as OpenAI.Chat.ChatCompletionMessage.FunctionCall
                }
              />
            )}
          </div>
        </div>
      ))}

      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-200 py-8">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full max-w-screen-md"
        >
          <Textarea
            className="bg-white"
            placeholder="Send a message"
            autoFocus
            required
            rows={1}
            spellCheck={false}
            ref={textAreaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
          />
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled
                ? "cursor-not-allowed bg-white"
                : "bg-primary/80 hover:bg-primary"
            )}
            disabled={disabled}
          >
            {isLoading ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ChevronRightIcon
                className={cn(
                  "h-4 w-4",
                  input.length === 0 ? "text-primary" : "text-white"
                )}
              />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
