import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  ChevronDown,
  Loader2,
  LogIn,
  MessageCircle,
  Send,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ChatMessage } from "../../backend";
import { useActor } from "../../hooks/useActor";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../../hooks/useQueries";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomLoading, setRoomLoading] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);

  const { actor, isFetching: actorFetching } = useActor();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const scrollRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevCountRef = useRef(0);

  // Fetch room ID once actor is ready
  useEffect(() => {
    if (!actor || actorFetching) return;
    let cancelled = false;
    setRoomLoading(true);
    setRoomError(null);
    actor
      .createDefaultChatRoom()
      .then((id) => {
        if (!cancelled) setRoomId(id);
      })
      .catch(() => {
        if (!cancelled) setRoomError("Could not connect to chat.");
      })
      .finally(() => {
        if (!cancelled) setRoomLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [actor, actorFetching]);

  // Fetch messages helper
  const fetchMessages = useCallback(async () => {
    if (!actor || !roomId) return;
    try {
      const data = await actor.getChatRoomMessages(roomId);
      setMessages(data);
      setMessagesError(null);
    } catch {
      setMessagesError("Failed to load messages.");
    }
  }, [actor, roomId]);

  // Poll messages when we have a room ID
  useEffect(() => {
    if (!roomId || !actor) return;
    setMessagesLoading(true);
    fetchMessages().finally(() => setMessagesLoading(false));
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [roomId, actor, fetchMessages]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > prevCountRef.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      prevCountRef.current = messages.length;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !roomId || sending || !isAuthenticated || !actor)
      return;
    const senderName = userProfile?.name || "Guest";
    const text = inputValue.trim();
    setInputValue("");
    setSending(true);
    try {
      await actor.postMessage(roomId, senderName, text);
      await fetchMessages();
    } catch {
      setInputValue(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-ocid="chat.panel"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="chat-widget-panel w-[360px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border/60"
            style={{ height: "480px" }}
          >
            {/* Header */}
            <div className="chat-widget-header flex items-center justify-between px-4 py-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="chat-widget-live-dot" />
                <span className="font-semibold text-sm tracking-wide text-foreground">
                  RockHog Live Chat
                </span>
              </div>
              <button
                type="button"
                data-ocid="chat.close_button"
                onClick={() => setIsOpen(false)}
                className="chat-widget-close-btn rounded-full w-7 h-7 flex items-center justify-center hover:bg-muted/60 transition-colors"
                aria-label="Close chat"
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden bg-card/60">
              {roomLoading || messagesLoading ? (
                <div
                  data-ocid="chat.loading_state"
                  className="flex items-center justify-center h-full gap-2 text-muted-foreground text-sm"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to chat...</span>
                </div>
              ) : roomError || messagesError ? (
                <div
                  data-ocid="chat.error_state"
                  className="flex flex-col items-center justify-center h-full gap-2 text-destructive text-sm px-4 text-center"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>{roomError || messagesError}</span>
                </div>
              ) : messages.length === 0 ? (
                <div
                  data-ocid="chat.empty_state"
                  className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground text-sm px-4 text-center"
                >
                  <MessageCircle className="w-8 h-8 opacity-30" />
                  <span>No messages yet. Be the first to say hello! 👋</span>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div
                    data-ocid="chat.message_list"
                    className="flex flex-col gap-2 px-3 py-3"
                  >
                    {messages.map((msg, idx) => {
                      const ts = new Date(Number(msg.timestamp) / 1_000_000);
                      const timeStr = ts.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <motion.div
                          key={`${msg.id}-${idx}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18 }}
                          className="chat-widget-bubble rounded-xl px-3 py-2"
                        >
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-primary truncate max-w-[140px]">
                              {msg.senderName}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">
                              {timeStr}
                            </span>
                          </div>
                          <p className="text-sm text-foreground break-words leading-snug">
                            {msg.message}
                          </p>
                        </motion.div>
                      );
                    })}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Input Area */}
            <div className="chat-widget-input-area px-3 py-3 border-t border-border/40">
              {isAuthenticated ? (
                <div className="flex gap-2 items-center">
                  <Input
                    data-ocid="chat.input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Say something..."
                    disabled={sending || !roomId}
                    className="text-sm h-9 bg-background/60 border-border/60 focus-visible:ring-primary/40"
                    maxLength={500}
                  />
                  <Button
                    data-ocid="chat.submit_button"
                    onClick={handleSend}
                    disabled={sending || !inputValue.trim() || !roomId}
                    size="icon"
                    className="h-9 w-9 flex-shrink-0 bg-primary hover:bg-accent text-primary-foreground rounded-lg"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-1">
                  <p className="text-xs text-muted-foreground">
                    Login to join the conversation
                  </p>
                  <Button
                    onClick={login}
                    disabled={loginStatus === "logging-in"}
                    size="sm"
                    variant="outline"
                    className="gap-2 text-xs h-8 w-full border-primary/30 hover:bg-primary/10"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    {loginStatus === "logging-in"
                      ? "Logging in..."
                      : "Login to Chat"}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        data-ocid="chat.toggle_button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="chat-widget-toggle relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <ChevronDown className="w-6 h-6 text-primary-foreground" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Live pulse indicator */}
        {!isOpen && messages.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-background animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
