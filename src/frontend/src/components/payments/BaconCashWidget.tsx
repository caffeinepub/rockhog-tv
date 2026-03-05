import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Coins, Loader2, LogIn } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useGetBalance, useRequestBaconCash } from "../../hooks/useQueries";

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000] as const;

export default function BaconCashWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: balance } = useGetBalance();
  const requestMutation = useRequestBaconCash();

  const effectiveAmount = customAmount
    ? Number.parseInt(customAmount, 10)
    : selectedAmount;
  const isValidAmount =
    effectiveAmount !== null &&
    !Number.isNaN(effectiveAmount) &&
    effectiveAmount >= 1;

  const handlePreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleSubmit = async () => {
    if (!isValidAmount || !effectiveAmount) return;
    try {
      await requestMutation.mutateAsync(BigInt(effectiveAmount));
      toast.success("Request submitted! An admin will process it soon.");
      setSelectedAmount(null);
      setCustomAmount("");
    } catch {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-3">
      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-ocid="bacon_cash_widget.panel"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="bacon-cash-panel w-[340px] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{ height: "420px" }}
          >
            {/* Header */}
            <div className="bacon-cash-header flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
                  <Coins className="w-4 h-4 text-white" />
                </span>
                <span className="font-bold text-sm tracking-wide text-foreground">
                  Bacon Cash
                </span>
              </div>
              <button
                type="button"
                data-ocid="bacon_cash_widget.close_button"
                onClick={() => setIsOpen(false)}
                className="rounded-full w-7 h-7 flex items-center justify-center hover:bg-muted/60 transition-colors"
                aria-label="Close Bacon Cash widget"
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <ScrollArea className="flex-1">
              <div className="px-4 py-4 flex flex-col gap-4">
                {!isAuthenticated ? (
                  /* ── Unauthenticated State ── */
                  <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                      <Coins className="w-7 h-7 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        Buy Bacon Cash
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Login to purchase Bacon Cash and support your favourite
                        streamers.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={login}
                      disabled={loginStatus === "logging-in"}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bacon-cash-submit-btn w-full justify-center"
                    >
                      {loginStatus === "logging-in" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <LogIn className="w-3.5 h-3.5" />
                      )}
                      {loginStatus === "logging-in"
                        ? "Logging in..."
                        : "Login to buy Bacon Cash"}
                    </button>
                  </div>
                ) : (
                  /* ── Authenticated State ── */
                  <>
                    {/* Balance */}
                    <div className="bacon-cash-balance-area px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-0.5">
                          Your Balance
                        </p>
                        <p className="text-2xl font-extrabold text-foreground leading-none">
                          {balance !== undefined
                            ? Number(balance).toLocaleString()
                            : "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <Coins className="w-6 h-6" />
                        <span className="text-xs font-bold tracking-wide">
                          BC
                        </span>
                      </div>
                    </div>

                    {/* Preset buttons */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
                        Quick Buy
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_AMOUNTS.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => handlePreset(amount)}
                            className={`bacon-cash-preset-btn${selectedAmount === amount && !customAmount ? " selected" : ""}`}
                          >
                            {amount.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom amount */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
                        Custom Amount
                      </p>
                      <Input
                        data-ocid="bacon_cash_widget.input"
                        type="number"
                        min={1}
                        placeholder="Enter amount..."
                        value={customAmount}
                        onChange={handleCustomChange}
                        className="h-9 text-sm bg-background/60 border-border/60 focus-visible:ring-amber-500/40"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="button"
                      data-ocid="bacon_cash_widget.submit_button"
                      onClick={handleSubmit}
                      disabled={!isValidAmount || requestMutation.isPending}
                      className="bacon-cash-submit-btn w-full h-10 flex items-center justify-center gap-2 text-sm"
                    >
                      {requestMutation.isPending ? (
                        <>
                          <Loader2
                            data-ocid="bacon_cash_widget.loading_state"
                            className="w-4 h-4 animate-spin"
                          />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4" />
                          <span>
                            Buy{" "}
                            {isValidAmount && effectiveAmount
                              ? `${effectiveAmount.toLocaleString()} `
                              : ""}
                            Bacon Cash
                          </span>
                        </>
                      )}
                    </button>

                    {/* Success feedback area */}
                    {requestMutation.isSuccess && (
                      <div
                        data-ocid="bacon_cash_widget.success_state"
                        className="text-center text-xs text-green-600 font-medium py-1"
                      >
                        ✓ Request submitted successfully!
                      </div>
                    )}

                    {/* View history link */}
                    <Link
                      to="/buy-bacon-cash"
                      className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-amber-600 transition-colors font-medium mt-1"
                      onClick={() => setIsOpen(false)}
                    >
                      View request history
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        data-ocid="bacon_cash_widget.toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="bacon-cash-toggle relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        aria-label={isOpen ? "Close Bacon Cash" : "Open Bacon Cash"}
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
              <ChevronDown className="w-6 h-6 text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Coins className="w-6 h-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
