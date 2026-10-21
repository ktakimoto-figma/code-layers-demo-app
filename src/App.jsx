import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  Circle,
  Leaf,
  Pause,
  Play,
  Plus,
  RefreshCcw,
  Sparkles,
  Trash2,
} from "lucide-react";

const FOCUS_SECONDS = 25 * 60;

const initialTasks = [
  { id: 1, label: "企画書のアウトラインを作る", done: false },
  { id: 2, label: "デザインの参考を3つ集める", done: true },
  { id: 3, label: "午後の打ち合わせを準備する", done: false },
];

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return undefined;

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    document.title = `${formatTime(secondsLeft)} · Focus Garden`;
    return () => {
      document.title = "Focus Garden";
    };
  }, [secondsLeft]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.done).length,
    [tasks],
  );
  const progress = (secondsLeft / FOCUS_SECONDS) * 100;

  const addTask = (event) => {
    event.preventDefault();
    const label = newTask.trim();
    if (!label) return;
    setTasks((current) => [
      ...current,
      { id: Date.now(), label, done: false },
    ]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(FOCUS_SECONDS);
  };

  const toggleTimer = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(FOCUS_SECONDS);
      setIsRunning(true);
      return;
    }
    setIsRunning((current) => !current);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Focus Garden ホーム">
          <span className="brand-mark">
            <Leaf size={19} strokeWidth={2.2} />
          </span>
          <span>Focus Garden</span>
        </a>
        <div className="date-pill">
          <Sparkles size={15} />
          <span>今日も、ひとつずつ。</span>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR DAILY FOCUS</p>
        <h1>
          小さな集中を、
          <br />
          大きな前進に。
        </h1>
        <p className="hero-copy">
          今やることをひとつ選んで、25分だけ集中してみましょう。
        </p>
      </section>

      <section className="workspace" aria-label="フォーカスワークスペース">
        <article className="timer-card">
          <div className="card-heading">
            <div>
              <p className="card-kicker">FOCUS SESSION</p>
              <h2>集中タイマー</h2>
            </div>
            <span className={`status-dot ${isRunning ? "is-active" : ""}`}>
              {isRunning ? "集中中" : "準備完了"}
            </span>
          </div>

          <div className="timer-wrap">
            <div
              className="timer-ring"
              style={{ "--progress": `${progress * 3.6}deg` }}
            >
              <div className="timer-face">
                <span className="timer-label">残り時間</span>
                <strong>{formatTime(secondsLeft)}</strong>
                <span className="timer-caption">25分セッション</span>
              </div>
            </div>
          </div>

          <div className="timer-actions">
            <button
              className="primary-button"
              type="button"
              onClick={toggleTimer}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
              {isRunning ? "一時停止" : secondsLeft === 0 ? "もう一度" : "スタート"}
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={resetTimer}
              aria-label="タイマーをリセット"
              title="リセット"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </article>

        <article className="tasks-card">
          <div className="card-heading tasks-heading">
            <div>
              <p className="card-kicker">TODAY’S LIST</p>
              <h2>今日のタスク</h2>
            </div>
            <span className="task-count">
              {completedCount}/{tasks.length} 完了
            </span>
          </div>

          <form className="task-form" onSubmit={addTask}>
            <label className="sr-only" htmlFor="new-task">
              新しいタスク
            </label>
            <input
              id="new-task"
              type="text"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="タスクを追加する"
              maxLength={80}
            />
            <button type="submit" aria-label="タスクを追加">
              <Plus size={19} />
            </button>
          </form>

          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.done ? "is-done" : ""}>
                <button
                  className="check-button"
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={`${task.label}を${task.done ? "未完了" : "完了"}にする`}
                >
                  {task.done ? (
                    <span className="checked-icon">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  ) : (
                    <Circle size={22} />
                  )}
                </button>
                <span className="task-label">{task.label}</span>
                <button
                  className="delete-button"
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`${task.label}を削除`}
                >
                  <Trash2 size={17} />
                </button>
              </li>
            ))}
          </ul>

          {tasks.length === 0 && (
            <div className="empty-state">
              <Leaf size={24} />
              <p>タスクはありません。ゆっくり始めましょう。</p>
            </div>
          )}
        </article>
      </section>

      <footer>
        <span>今日は昨日より、少しだけ前へ。</span>
        <span className="footer-leaf"><Leaf size={14} /> Focus Garden</span>
      </footer>
    </main>
  );
}

export default App;
