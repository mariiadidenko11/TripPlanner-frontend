import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { getTasks, createTask, updateTask, deleteTask, restoreTask } from '@/api/api';
import { toast } from '@/components/ui/Toast';
import EmptyState from '@/components/ui/EmptyState';

export default function TodoPage() {
    const { tripId } = useOutletContext();
    const [text, setText] = useState('');
    const [note, setNote] = useState('');
    const [filter, setFilter] = useState('all');
    const [trash, setTrash] = useState([]);

    const { data, loading, refetch } = useApi(() => getTasks(tripId), [tripId]);
    const tasks = data ?? [];

    const visible = tasks.filter(t => filter === 'all' ? true : filter === 'done' ? (t.done || t.check) : !(t.done || t.check));

    const add = async () => {
        if (!text.trim()) return;
        try {
            await createTask(tripId, {
                value: text.trim(),
                note: note.trim(),
                check: false,
                trips_id: tripId
            });
            setText(''); setNote('');
            refetch();
            toast('Завдання додано!', 'success');
        } catch (err) { toast(err.message, 'error'); }
    };

    const toggle = async (task) => {
        const isDone = !(task.done || task.check);
        try {
            await updateTask(tripId, task.id, { done: isDone, check: isDone });
            refetch();
        } catch (err) { toast(err.message, 'error'); }
    };

    const remove = async (task) => {
        try {
            await deleteTask(tripId, task.id);
            setTrash(t => [task, ...t]);
            refetch();
            toast('Завдання видалено', 'info');
        } catch (err) { toast(err.message, 'error'); }
    };

    const restore = async (task) => {
        try {
            await restoreTask(tripId, task.id);
            setTrash(t => t.filter(x => x.id !== task.id));
            refetch();
            toast('Завдання відновлено!', 'success');
        } catch (err) { toast(err.message, 'error'); }
    };

    return (
        <div className="todo-container">
            <div className="todo-header">
                <div>
                    <h2 className="todo-title">Список справ</h2>
                    <p className="todo-sub">Організуйте все, що потрібно зробити</p>
                </div>
                <div className="todo-filters">
                    {[['all', 'Всі'], ['active', 'Активні'], ['done', 'Виконані']].map(([val, lbl]) => (
                        <button key={val} onClick={() => setFilter(val)} className={`filter-btn ${filter === val ? 'filter-btn--active' : ''}`}>{lbl}</button>
                    ))}
                </div>
            </div>

            <div className="todo-composer">
                <div className="todo-composer-row">
                    <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="Що потрібно зробити?" className="composer-input" />
                </div>
                <div className="todo-composer-row" style={{ marginTop: 'var(--sp-2)' }}>
                    <input value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="Додаткова нотатка (необов'язково)" className="composer-input composer-input--secondary" />
                    <button onClick={add} className="btn btn--buy-cta btn--pill add-btn">Додати</button>
                </div>
            </div>

            {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Завантаження...</p>}

            {visible.length === 0 && !loading ? (
                <EmptyState icon="✅" title="Завдань немає" subtitle="Додайте перше завдання" />
            ) : (
                <ul className="todo-list">
                    {visible.map(task => (
                        <li key={task.id} className={`todo-item ${(task.done || task.check) ? 'todo-item--done' : ''}`}>
                            <div onClick={() => toggle(task)} className={`custom-checkbox ${(task.done || task.check) ? 'custom-checkbox--checked' : ''}`}>
                                {(task.done || task.check) && <svg viewBox="0 0 12 12" strokeWidth="3" stroke="#fff" fill="none"><polyline points="1.5,6 4.5,9 10.5,3" /></svg>}
                            </div>
                            <div className="todo-content">
                                <span className="todo-text">{task.text || task.value}</span>
                                {task.note && <span className="todo-note">{task.note}</span>}
                            </div>
                            <button onClick={() => remove(task)} className="todo-delete-btn" title="Видалити">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* ── Нещодавно видалені ──────────────────────────── */}
            {trash.length > 0 && (
                <div className="todo-trash">
                    <p className="todo-trash__title">Нещодавно видалені ({trash.length})</p>
                    <div className="todo-trash__list">
                        {trash.map(t => (
                            <div key={t.id} className="todo-trash__item">
                                <span className="todo-trash__text">{t.value || t.text}</span>
                                <button onClick={() => restore(t)} className="todo-trash__restore">Відновити</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                .todo-container { background: var(--canvas); border: 1px solid var(--hairline-soft); border-radius: var(--radius-xl); padding: var(--sp-6); }
                .todo-header { display: flex; justify-content: space-between; margin-bottom: var(--sp-6); flex-wrap: wrap; gap: var(--sp-3); }
                .todo-title { font-size: 18px; font-weight: 600; color: var(--ink-deep); }
                .todo-sub { font-size: 13px; color: var(--slate); margin-top: 2px; }
                .todo-filters { display: flex; gap: 6px; }
                .filter-btn { padding: 0; width: 90px; height: 36px; border-radius: var(--radius-full); border: 1.5px solid var(--hairline-soft); cursor: pointer; background: var(--canvas); font-size: 13px; font-weight: 600; color: var(--slate); font-family: var(--font, inherit); transition: all 0.15s ease; white-space: nowrap; }
                .filter-btn:hover:not(.filter-btn--active) { border-color: #40B3E0; color: #40B3E0; }
                .filter-btn--active { background: #40B3E0; border-color: #40B3E0; color: #fff; box-shadow: 0 2px 8px rgba(64,179,224,0.3); }
                .todo-composer { background: var(--surface-soft); border-radius: var(--radius-xl); padding: var(--sp-4); margin-bottom: var(--sp-6); }
                .todo-composer-row { display: flex; gap: var(--sp-2); }
                .composer-input { flex: 1; padding: 10px 14px; border: 1px solid var(--hairline); border-radius: var(--radius-lg); outline: none; font-family: var(--font); font-size: 14px; background: var(--canvas); color: var(--ink-deep); }
                .composer-input:focus { border-color: #40B3E0; }
                .todo-list { list-style: none; display: flex; flex-direction: column; gap: var(--sp-2); }
                .todo-item { display: flex; gap: var(--sp-3); padding: 12px var(--sp-4); background: var(--canvas); border-radius: var(--radius-xl); border: 1px solid var(--hairline-soft); transition: opacity 0.2s ease; align-items: center; }
                .todo-item--done { opacity: 0.55; }
                .todo-item--done .todo-text { text-decoration: line-through; text-decoration-thickness: 1px; color: var(--slate); font-weight: 500; }
                .todo-item--done .todo-note { text-decoration: line-through; text-decoration-thickness: 1px; }
                .custom-checkbox { width: 20px; height: 20px; border: 2px solid var(--hairline); border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .custom-checkbox--checked { background: var(--success); border-color: var(--success); }
                .todo-content { flex: 1; }
                .todo-text { font-weight: 600; }
                .todo-note { font-size: 12px; color: var(--slate); display: block; margin-top: 2px; }
                .todo-delete-btn { background: none; border: none; cursor: pointer; color: var(--slate); padding: 4px; border-radius: var(--radius-sm); transition: color 0.15s, background 0.15s; flex-shrink: 0; }
                .todo-delete-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }

                /* ── Trash ── */
                .todo-trash { margin-top: var(--sp-6); padding-top: var(--sp-4); border-top: 1px solid var(--hairline-soft); }
                .todo-trash__title { font-size: 13px; color: var(--slate); font-weight: 600; margin-bottom: var(--sp-2); }
                .todo-trash__list { display: flex; flex-direction: column; gap: 6px; }
                .todo-trash__item { display: flex; justify-content: space-between; align-items: center; background: var(--surface-soft); padding: var(--sp-2) var(--sp-3); border-radius: var(--radius-lg); opacity: 0.8; gap: 8px; }
                .todo-trash__text { font-size: 13px; color: var(--charcoal); text-decoration: line-through; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .todo-trash__restore { font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: var(--radius-full); border: 1.5px solid var(--hairline); background: var(--canvas); color: var(--primary); cursor: pointer; white-space: nowrap; font-family: var(--font); transition: all 0.15s ease; flex-shrink: 0; }
                .todo-trash__restore:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
            `}</style>
        </div>
    );
}
