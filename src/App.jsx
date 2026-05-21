import React, { useEffect, useMemo, useState } from "react";
import {
  Brain,
  CalendarDays,
  CheckCircle2,
  Code2,
  FolderKanban,
  Library,
  Plus,
  RefreshCcw,
  Save,
  Target,
  Trash2,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  ClipboardList,
  Download,
} from "lucide-react";

const STORAGE_KEY = "ai_learning_os_v2";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const defaultState = {
  activePage: "dashboard",
  goals: {
    main: "Za 12 měsíců umět Python, AI, Prompt Engineering, AI appky a mít portfolio.",
    weekly: "Python základy + první mini projekt",
  },
  progress: {
    Python: 15,
    Prompting: 10,
    "AI Tools": 5,
    Projects: 5,
  },
  todayTasks: [
    { id: uid(), text: "60 min Python / Grok Academy", done: false },
    { id: uid(), text: "30 min Prompt Engineering", done: false },
    { id: uid(), text: "30 min vlastní projekt", done: false },
    { id: uid(), text: "Zapsat, co jsem se naučil", done: false },
  ],
  dailyLogs: [
    {
      id: uid(),
      date: new Date().toISOString().slice(0, 10),
      minutes: 90,
      activity: "Setup studijního systému",
      learned: "Vím, jak bude vypadat AI Learning OS.",
      stuck: "Ještě nevím, kde začít s Pythonem.",
      next: "Udělám 5 základních Python úloh.",
    },
  ],
  weeklyReview: {
    done: "",
    learned: "",
    problems: "",
    biggestMistake: "",
    fix: "",
    projectProgress: "",
    rating: "",
    nextWeek: "",
  },
  pythonNotes: [
    {
      id: uid(),
      topic: "Proměnné",
      status: "Hotovo",
      note: "Proměnná ukládá hodnotu, například name = 'Dominik'.",
    },
    {
      id: uid(),
      topic: "Podmínky",
      status: "Probíhá",
      note: "if / else rozhoduje podle pravdivosti podmínky.",
    },
  ],
  prompts: [
    {
      id: uid(),
      name: "Python Tutor",
      category: "Učení",
      rating: 8,
      content:
        "You are my strict but supportive Python tutor. Explain step by step. Do not give the final answer immediately. Give hints first, then test me.",
    },
  ],
  mistakes: [
    {
      id: uid(),
      date: new Date().toISOString().slice(0, 10),
      topic: "Python if statement",
      mistake: "Zapomněl jsem dvojtečku za if.",
      wrongCode: "if age > 18\n    print('adult')",
      fixedCode: "if age > 18:\n    print('adult')",
      memory: "Každý if, for, while a def má na konci dvojtečku.",
    },
  ],
  projects: [
    {
      id: uid(),
      name: "Study Timer",
      status: "Plán",
      skill: "Python",
      deadline: "Týden 2",
      github: "",
      note: "První mini projekt pro portfolio.",
    },
    {
      id: uid(),
      name: "AI Brain System",
      status: "Idea",
      skill: "AI / Web",
      deadline: "Měsíc 6",
      github: "",
      note: "Hlavní dlouhodobý projekt.",
    },
  ],
  resources: [
    { id: uid(), name: "Grok Academy", type: "Kurz", url: "" },
    { id: uid(), name: "OpenAI Prompt Engineering", type: "Dokumentace", url: "" },
  ],
};

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Brain },
  { id: "daily", label: "Daily Log", icon: CalendarDays },
  { id: "weekly", label: "Weekly Review", icon: ClipboardList },
  { id: "python", label: "Python Notes", icon: Code2 },
  { id: "prompts", label: "Prompt Library", icon: Library },
  { id: "mistakes", label: "Mistakes Log", icon: AlertTriangle },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "resources", label: "Resources", icon: BookOpen },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function App() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const stats = useMemo(() => {
    const totalMinutes = state.dailyLogs.reduce((sum, log) => sum + Number(log.minutes || 0), 0);
    const doneTasks = state.todayTasks.filter((task) => task.done).length;
    const progressValues = Object.values(state.progress);
    const averageProgress = Math.round(
      progressValues.reduce((sum, value) => sum + Number(value), 0) / progressValues.length
    );

    return {
      totalMinutes,
      doneTasks,
      totalTasks: state.todayTasks.length,
      averageProgress,
      projectCount: state.projects.length,
      promptCount: state.prompts.length,
    };
  }, [state]);

  const setActivePage = (page) => setState((prev) => ({ ...prev, activePage: page }));

  const updateObject = (section, key, value) => {
    setState((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const addTask = () => {
    const text = prompt("Nový úkol na dnes:");
    if (!text || !text.trim()) return;
    setState((prev) => ({
      ...prev,
      todayTasks: [{ id: uid(), text: text.trim(), done: false }, ...prev.todayTasks],
    }));
  };

  const toggleTask = (id) => {
    setState((prev) => ({
      ...prev,
      todayTasks: prev.todayTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      ),
    }));
  };

  const deleteTask = (id) => {
    setState((prev) => ({ ...prev, todayTasks: prev.todayTasks.filter((task) => task.id !== id) }));
  };

  const addItem = (key, item) => {
    setState((prev) => ({ ...prev, [key]: [{ id: uid(), ...item }, ...prev[key]] }));
  };

  const deleteItem = (key, id) => {
    setState((prev) => ({ ...prev, [key]: prev[key].filter((item) => item.id !== id) }));
  };

  const updateArrayItem = (key, id, field, value) => {
    setState((prev) => ({
      ...prev,
      [key]: prev[key].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-learning-os-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-slate-950 p-4 lg:block">
          <div className="mb-8 flex items-center gap-3 rounded-2xl bg-white/5 p-4 shadow-xl">
            <div className="rounded-2xl bg-white/10 p-3">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-lg font-bold">AI Learning OS</h1>
              <p className="text-sm text-slate-400">Dominik Academy</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition",
                    state.activePage === item.id
                      ? "bg-white text-slate-950 shadow-lg"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 grid grid-cols-2 gap-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm",
                    state.activePage === item.id ? "bg-white text-slate-950" : "bg-white/10 text-slate-200"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mx-auto max-w-7xl">
            {state.activePage === "dashboard" && (
              <Dashboard
                state={state}
                stats={stats}
                setState={setState}
                updateObject={updateObject}
                addTask={addTask}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
                exportData={exportData}
              />
            )}

            {state.activePage === "daily" && (
              <DailyLog logs={state.dailyLogs} addItem={addItem} deleteItem={deleteItem} />
            )}

            {state.activePage === "weekly" && (
              <WeeklyReview review={state.weeklyReview} updateObject={updateObject} />
            )}

            {state.activePage === "python" && (
              <EditableCards
                title="Python Notes"
                description="Tady si ukládáš témata, stav a vlastní vysvětlení."
                icon={Code2}
                items={state.pythonNotes}
                keyName="pythonNotes"
                fields={[
                  ["topic", "Téma"],
                  ["status", "Stav"],
                  ["note", "Poznámka"],
                ]}
                addItem={addItem}
                deleteItem={deleteItem}
                updateArrayItem={updateArrayItem}
              />
            )}

            {state.activePage === "prompts" && (
              <PromptLibrary
                prompts={state.prompts}
                addItem={addItem}
                deleteItem={deleteItem}
                updateArrayItem={updateArrayItem}
              />
            )}

            {state.activePage === "mistakes" && (
              <MistakesLog
                mistakes={state.mistakes}
                addItem={addItem}
                deleteItem={deleteItem}
              />
            )}

            {state.activePage === "projects" && (
              <Projects
                projects={state.projects}
                addItem={addItem}
                deleteItem={deleteItem}
                updateArrayItem={updateArrayItem}
              />
            )}

            {state.activePage === "resources" && (
              <EditableCards
                title="Resources"
                description="Kurzy, dokumentace, videa a odkazy, které používáš."
                icon={BookOpen}
                items={state.resources}
                keyName="resources"
                fields={[
                  ["name", "Název"],
                  ["type", "Typ"],
                  ["url", "URL"],
                ]}
                addItem={addItem}
                deleteItem={deleteItem}
                updateArrayItem={updateArrayItem}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function Dashboard({
  state,
  stats,
  setState,
  updateObject,
  addTask,
  toggleTask,
  deleteTask,
  exportData,
}) {
  return (
    <>
      <PageHeader
        icon={Brain}
        title="Dashboard"
        description="Tvoje hlavní řídící centrum pro učení, progress, úkoly a portfolio."
        action={
          <button onClick={exportData} className="rounded-2xl bg-white px-4 py-2 font-bold text-slate-950">
            <Download className="mr-2 inline h-4 w-4" />
            Export
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={TrendingUp} label="Celkem učení" value={`${stats.totalMinutes} min`} />
        <StatCard icon={CheckCircle2} label="Dnešní úkoly" value={`${stats.doneTasks}/${stats.totalTasks}`} />
        <StatCard icon={FolderKanban} label="Projekty" value={stats.projectCount} />
        <StatCard icon={Library} label="Prompty" value={stats.promptCount} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <Target className="h-6 w-6" />
            <h3 className="text-xl font-bold">Hlavní cíl</h3>
          </div>
          <textarea
            value={state.goals.main}
            onChange={(event) => updateObject("goals", "main", event.target.value)}
            className="min-h-24 w-full rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-white outline-none"
          />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InputField
              label="Tento týden"
              value={state.goals.weekly}
              onChange={(v) => updateObject("goals", "weekly", v)}
            />
            <div>
              <label className="text-sm text-slate-400">Průměrný progress</label>
              <div className="mt-2 rounded-2xl bg-slate-900/70 p-4 text-2xl font-black">
                {stats.averageProgress}%
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold">Dnes</h3>
            <div className="flex gap-2">
              <button onClick={addTask} className="rounded-xl bg-white px-3 py-2 text-slate-950">
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    todayTasks: prev.todayTasks.map((task) => ({ ...task, done: false })),
                  }))
                }
                className="rounded-xl bg-white/10 px-3 py-2 text-white"
              >
                <RefreshCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {state.todayTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 rounded-2xl bg-slate-900/70 p-3">
                <button onClick={() => toggleTask(task.id)}>
                  <CheckCircle2 className={cn("h-5 w-5", task.done ? "text-emerald-300" : "text-slate-500")} />
                </button>
                <span className={cn("flex-1 text-sm", task.done && "text-slate-500 line-through")}>
                  {task.text}
                </span>
                <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-white">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(state.progress).map(([name, value]) => (
          <Panel key={name}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold">{name}</h3>
              <span className="text-sm text-slate-400">{value}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  progress: { ...prev.progress, [name]: Number(event.target.value) },
                }))
              }
              className="w-full"
            />
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-white" style={{ width: `${value}%` }} />
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}

function DailyLog({ logs, addItem, deleteItem }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    minutes: 90,
    activity: "",
    learned: "",
    stuck: "",
    next: "",
  });

  const submit = () => {
    if (!form.activity.trim()) return;
    addItem("dailyLogs", form);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      minutes: 90,
      activity: "",
      learned: "",
      stuck: "",
      next: "",
    });
  };

  return (
    <>
      <PageHeader
        icon={CalendarDays}
        title="Daily Study Log"
        description="Každý den si zapiš, co jsi dělal, co jsi pochopil, kde ses zasekl a další krok."
      />

      <Panel className="mb-6">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Datum" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
          <InputField label="Čas v minutách" type="number" value={form.minutes} onChange={(v) => setForm({ ...form, minutes: v })} />
          <InputField label="Co jsem dělal" value={form.activity} onChange={(v) => setForm({ ...form, activity: v })} />
          <InputField label="Další krok" value={form.next} onChange={(v) => setForm({ ...form, next: v })} />
          <TextAreaField label="Co jsem pochopil" value={form.learned} onChange={(v) => setForm({ ...form, learned: v })} />
          <TextAreaField label="Co nechápu" value={form.stuck} onChange={(v) => setForm({ ...form, stuck: v })} />
        </div>
        <button onClick={submit} className="mt-4 rounded-2xl bg-white px-4 py-2 font-bold text-slate-950">
          <Save className="mr-2 inline h-4 w-4" />
          Uložit denní log
        </button>
      </Panel>

      <div className="space-y-4">
        {logs.map((log) => (
          <Panel key={log.id}>
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{log.date}</h3>
                <p className="text-sm text-slate-400">{log.minutes} minut</p>
              </div>
              <button onClick={() => deleteItem("dailyLogs", log.id)} className="rounded-xl bg-white/10 px-3 py-2">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <InfoBlock title="Aktivita" value={log.activity} />
              <InfoBlock title="Další krok" value={log.next} />
              <InfoBlock title="Pochopeno" value={log.learned} />
              <InfoBlock title="Nejasné" value={log.stuck} />
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}

function WeeklyReview({ review, updateObject }) {
  const fields = [
    ["done", "Co jsem dokončil"],
    ["learned", "Co jsem se naučil"],
    ["problems", "Co mi nešlo"],
    ["biggestMistake", "Největší chyba týdne"],
    ["fix", "Jak ji opravím"],
    ["projectProgress", "Projektový progress"],
    ["rating", "Hodnocení týdne 1–10"],
    ["nextWeek", "Plán na další týden"],
  ];

  return (
    <>
      <PageHeader
        icon={ClipboardList}
        title="Weekly Review"
        description="Každou neděli udělej kontrolu týdne."
      />
      <Panel>
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map(([key, label]) => (
            <TextAreaField
              key={key}
              label={label}
              value={review[key]}
              onChange={(value) => updateObject("weeklyReview", key, value)}
            />
          ))}
        </div>
      </Panel>
    </>
  );
}

function EditableCards({ title, description, icon, items, keyName, fields, addItem, deleteItem, updateArrayItem }) {
  const [form, setForm] = useState(Object.fromEntries(fields.map(([field]) => [field, ""])));

  const submit = () => {
    if (!Object.values(form).some((value) => String(value).trim())) return;
    addItem(keyName, form);
    setForm(Object.fromEntries(fields.map(([field]) => [field, ""])));
  };

  return (
    <>
      <PageHeader icon={icon} title={title} description={description} />
      <Panel className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          {fields.map(([field, label]) => (
            <InputField
              key={field}
              label={label}
              value={form[field]}
              onChange={(value) => setForm({ ...form, [field]: value })}
            />
          ))}
        </div>
        <button onClick={submit} className="mt-4 rounded-2xl bg-white px-4 py-2 font-bold text-slate-950">
          <Plus className="mr-2 inline h-4 w-4" />
          Přidat
        </button>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Panel key={item.id}>
            <div className="space-y-3">
              {fields.map(([field, label]) => (
                <InputField
                  key={field}
                  label={label}
                  value={item[field] || ""}
                  onChange={(value) => updateArrayItem(keyName, item.id, field, value)}
                />
              ))}
            </div>
            <button onClick={() => deleteItem(keyName, item.id)} className="mt-4 rounded-xl bg-white/10 px-3 py-2">
              <Trash2 className="mr-2 inline h-4 w-4" />
              Smazat
            </button>
          </Panel>
        ))}
      </div>
    </>
  );
}

function PromptLibrary({ prompts, addItem, deleteItem, updateArrayItem }) {
  const [form, setForm] = useState({ name: "", category: "", rating: 8, content: "" });

  const submit = () => {
    if (!form.name.trim() || !form.content.trim()) return;
    addItem("prompts", form);
    setForm({ name: "", category: "", rating: 8, content: "" });
  };

  return (
    <>
      <PageHeader
        icon={Library}
        title="Prompt Library"
        description="Tady si ukládáš nejlepší prompty, verze a šablony."
      />
      <Panel className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <InputField label="Název" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <InputField label="Kategorie" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <InputField label="Hodnocení" type="number" value={form.rating} onChange={(v) => setForm({ ...form, rating: Number(v) })} />
        </div>
        <div className="mt-4">
          <TextAreaField label="Prompt" value={form.content} onChange={(v) => setForm({ ...form, content: v })} />
        </div>
        <button onClick={submit} className="mt-4 rounded-2xl bg-white px-4 py-2 font-bold text-slate-950">
          <Plus className="mr-2 inline h-4 w-4" />
          Přidat prompt
        </button>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        {prompts.map((prompt) => (
          <Panel key={prompt.id}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{prompt.name}</h3>
                <p className="text-sm text-slate-400">
                  {prompt.category} · {prompt.rating}/10
                </p>
              </div>
              <button onClick={() => deleteItem("prompts", prompt.id)} className="rounded-xl bg-white/10 px-3 py-2">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <textarea
              value={prompt.content}
              onChange={(e) => updateArrayItem("prompts", prompt.id, "content", e.target.value)}
              className="min-h-40 w-full rounded-2xl border border-white/10 bg-slate-900/70 p-3 font-mono text-sm text-white outline-none"
            />
          </Panel>
        ))}
      </div>
    </>
  );
}

function MistakesLog({ mistakes, addItem, deleteItem }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    topic: "",
    mistake: "",
    wrongCode: "",
    fixedCode: "",
    memory: "",
  });

  const submit = () => {
    if (!form.topic.trim() || !form.mistake.trim()) return;
    addItem("mistakes", form);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      topic: "",
      mistake: "",
      wrongCode: "",
      fixedCode: "",
      memory: "",
    });
  };

  return (
    <>
      <PageHeader
        icon={AlertTriangle}
        title="Mistakes Log"
        description="Zapisuj chyby, aby ses na nich nezasekával pořád dokola."
      />

      <Panel className="mb-6">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Datum" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
          <InputField label="Téma" value={form.topic} onChange={(v) => setForm({ ...form, topic: v })} />
          <TextAreaField label="Co jsem udělal špatně" value={form.mistake} onChange={(v) => setForm({ ...form, mistake: v })} />
          <TextAreaField label="Jak si to zapamatuju" value={form.memory} onChange={(v) => setForm({ ...form, memory: v })} />
          <TextAreaField label="Špatný kód" value={form.wrongCode} onChange={(v) => setForm({ ...form, wrongCode: v })} />
          <TextAreaField label="Správný kód" value={form.fixedCode} onChange={(v) => setForm({ ...form, fixedCode: v })} />
        </div>
        <button onClick={submit} className="mt-4 rounded-2xl bg-white px-4 py-2 font-bold text-slate-950">
          <Plus className="mr-2 inline h-4 w-4" />
          Přidat chybu
        </button>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        {mistakes.map((mistake) => (
          <Panel key={mistake.id}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{mistake.topic}</h3>
                <p className="text-sm text-slate-400">{mistake.date}</p>
              </div>
              <button onClick={() => deleteItem("mistakes", mistake.id)} className="rounded-xl bg-white/10 px-3 py-2">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <InfoBlock title="Chyba" value={mistake.mistake} />
            <InfoBlock title="Zapamatování" value={mistake.memory} />
            <CodeBlock title="Špatný kód" code={mistake.wrongCode} />
            <CodeBlock title="Správný kód" code={mistake.fixedCode} />
          </Panel>
        ))}
      </div>
    </>
  );
}

function Projects({ projects, addItem, deleteItem, updateArrayItem }) {
  const [form, setForm] = useState({
    name: "",
    status: "Plán",
    skill: "",
    deadline: "",
    github: "",
    note: "",
  });

  const submit = () => {
    if (!form.name.trim()) return;
    addItem("projects", form);
    setForm({ name: "", status: "Plán", skill: "", deadline: "", github: "", note: "" });
  };

  return (
    <>
      <PageHeader
        icon={FolderKanban}
        title="Projects"
        description="Tady držíš všechny projekty, které se postupně stanou tvým portfoliem."
      />

      <Panel className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <InputField label="Projekt" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <InputField label="Stav" value={form.status} onChange={(v) => setForm({ ...form, status: v })} />
          <InputField label="Skill" value={form.skill} onChange={(v) => setForm({ ...form, skill: v })} />
          <InputField label="Deadline" value={form.deadline} onChange={(v) => setForm({ ...form, deadline: v })} />
          <InputField label="GitHub" value={form.github} onChange={(v) => setForm({ ...form, github: v })} />
          <InputField label="Poznámka" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
        </div>
        <button onClick={submit} className="mt-4 rounded-2xl bg-white px-4 py-2 font-bold text-slate-950">
          <Plus className="mr-2 inline h-4 w-4" />
          Přidat projekt
        </button>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <Panel key={project.id}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{project.name}</h3>
                <p className="text-sm text-slate-400">
                  {project.skill} · {project.deadline}
                </p>
              </div>
              <button onClick={() => deleteItem("projects", project.id)} className="rounded-xl bg-white/10 px-3 py-2">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {["status", "skill", "deadline", "github", "note"].map((field) => (
              <div key={field} className="mb-3">
                <InputField
                  label={field}
                  value={project[field] || ""}
                  onChange={(value) => updateArrayItem("projects", project.id, field, value)}
                />
              </div>
            ))}
          </Panel>
        ))}
      </div>
    </>
  );
}

function PageHeader({ icon: Icon, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <div className="rounded-3xl bg-white/10 p-4 shadow-xl">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-slate-400">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <div className={cn("rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl", className)}>
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <Panel>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-black">{value}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-3">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Panel>
  );
}

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-white outline-none placeholder:text-slate-600"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-400">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-white outline-none placeholder:text-slate-600"
      />
    </label>
  );
}

function InfoBlock({ title, value }) {
  return (
    <div className="mb-3 rounded-2xl bg-slate-900/70 p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <p className="whitespace-pre-wrap text-sm text-slate-200">{value || "—"}</p>
    </div>
  );
}

function CodeBlock({ title, code }) {
  return (
    <div className="mb-3 rounded-2xl bg-slate-950 p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
      <pre className="overflow-auto whitespace-pre-wrap text-sm text-slate-200">
        <code>{code || "—"}</code>
      </pre>
    </div>
  );
}
