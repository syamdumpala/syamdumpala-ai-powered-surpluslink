import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import type { Role } from "../../context/AuthContext";
import { generateAssistantResponse } from "../../utils/ai";

const prompts: Record<Role, string[]> = {
  restaurant: [
    "I have 50 plates of biryani expiring in 3 hours. What should I do?",
    "Donate 25 meals of rice available until 8 PM.",
  ],
  ngo: [
    "Which donations should we prioritize?",
    "Predict beneficiary impact for today's donations.",
  ],
  volunteer: [
    "Show the most urgent deliveries near me.",
    "Generate my optimized pickup route.",
  ],
  admin: [
    "Find suspicious activity and fraud risks.",
    "Switch to emergency distribution mode.",
  ],
};

export default function SurplusAI({ role }: { role: Role }) {
  const [query, setQuery] = useState(prompts[role][0]);
  const [answer, setAnswer] = useState(() =>
    generateAssistantResponse(role, prompts[role][0])
  );

  const ask = (nextQuery = query) => {
    setQuery(nextQuery);
    setAnswer(generateAssistantResponse(role, nextQuery));
  };

  return (
    <section className="rounded-md border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/40">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-600 text-white">
            <Bot size={20} />
          </span>
          <div>
            <h2 className="text-lg font-bold">SurplusAI Assistant</h2>
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              AI planning for matching, risk, routing, fraud, and emergency response.
            </p>
          </div>
        </div>
        <Sparkles className="text-emerald-600" size={22} />
      </div>

      <div className="flex flex-wrap gap-2">
        {prompts[role].map((prompt) => (
          <button
            key={prompt}
            onClick={() => ask(prompt)}
            className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-left text-sm font-medium text-emerald-900 dark:border-emerald-800 dark:bg-slate-950 dark:text-emerald-100"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 rounded-md border border-emerald-200 bg-white px-3 py-3 outline-none focus:border-emerald-500 dark:border-emerald-800 dark:bg-slate-950"
        />
        <button
          onClick={() => ask()}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 font-semibold text-white hover:bg-emerald-700"
        >
          <Send size={16} />
          Ask
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {answer.map((item) => (
          <div
            key={item}
            className="rounded-md border border-emerald-200 bg-white p-3 text-sm leading-6 dark:border-emerald-900 dark:bg-slate-950"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
