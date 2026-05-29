import { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { getNotes, createNote, updateNote, deleteNote, restoreNote } from '@/api/api';
import { toast } from '@/components/ui/Toast';
import EmptyState from '@/components/ui/EmptyState';

function fmtDateTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}


function encodeNoteValue(title, body) {
    const t = (title || '').trim();
    const b = (body || '').trim();
    return t ? `${t}\n${b}`.trim() : b;
}

function decodeNoteValue(value) {
    const lines = (value || '').split('\n');
    return {
        title: lines[0] || '',
        body: lines.slice(1).join('\n') || ''
    };
}

export default function NotesPage() {
    const { tripId } = useOutletContext();
    const [showComposer, setShowComposer] = useState(false);
    const [composerTitle, setComposerTitle] = useState('');
    const [composerBody, setComposerBody] = useState('');
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editBody, setEditBody] = useState('');
    const [trash, setTrash] = useState([]);
    const autosaveRef = useRef(null);

    const { data, loading, refetch } = useApi(() => getNotes(tripId), [tripId]);
    const notes = data?.data ?? data ?? [];

   

    const saveNote = async () => {
        if (!composerTitle.trim() && !composerBody.trim()) return;
        try {
            await createNote(tripId, {
                value: encodeNoteValue(composerTitle, composerBody), 
                check: false,                                         
                trips_id: tripId                                    
            });
            setComposerTitle('');
            setComposerBody('');
            setShowComposer(false);
            toast('Нотатку збережено', 'success');
            refetch();
        } catch (err) { toast(err.message, 'error'); }
    };

    const startEdit = (note) => {
        const { title, body } = decodeNoteValue(note.value);
        setEditId(note.id);
        setEditTitle(title);
        setEditBody(body);
    };

    const saveEdit = async () => {
        try {
            await updateNote(tripId, editId, {
                value: encodeNoteValue(editTitle, editBody) 
            });
            setEditId(null);
            refetch();
            toast('Нотатку збережено', 'success');
        } catch (err) { toast(err.message, 'error'); }
    };

    const handleEditKeyup = (noteId) => {
        clearTimeout(autosaveRef.current);
        autosaveRef.current = setTimeout(() => {
            updateNote(tripId, noteId, {
                value: encodeNoteValue(editTitle, editBody)
            }).catch(() => { });
        }, 1400);
    };

    const remove = async (note) => {
        try {
            await deleteNote(tripId, note.id);
            setTrash(t => [note, ...t]);
            refetch();
            toast('Нотатку видалено', 'info');
        } catch (err) { toast(err.message, 'error'); }
    };

    const restore = async (note) => {
        try {
            await restoreNote(tripId, note.id);
            setTrash(t => t.filter(x => x.id !== note.id));
            refetch();
            toast('Нотатку відновлено!', 'success');
        } catch (err) { toast(err.message, 'error'); }
    };

    return (
        <div className="notes-container">
            <div className="notes-header">
                <div>
                    <h2 className="notes-title">Нотатки подорожі</h2>
                    <p className="notes-sub">Записуйте свої думки, спогади та відкриття</p>
                </div>
                <button onClick={() => setShowComposer(v => !v)} className="btn btn--buy-cta btn--pill add-note-btn">
                    + Нова нотатка
                </button>
            </div>

            {/* Composer */}
            {showComposer && (
                <div className="composer-card">
                    <input
                        value={composerTitle}
                        onChange={e => setComposerTitle(e.target.value)}
                        placeholder="Заголовок нотатки..."
                        className="composer-title-input"
                    />
                    <textarea
                        value={composerBody}
                        onChange={e => setComposerBody(e.target.value)}
                        placeholder="Ваші думки, спогади, плани..."
                        rows={4}
                        className="composer-body-input"
                    />
                    <div className="composer-actions">
                        <button
                            onClick={() => { setShowComposer(false); setComposerTitle(''); setComposerBody(''); }}
                            className="btn btn--secondary btn--pill btn--sm"
                        >
                            Скасувати
                        </button>
                        <button onClick={saveNote} className="btn btn--buy-cta btn--pill btn--sm">
                            Зберегти
                        </button>
                    </div>
                </div>
            )}

            {loading && <p style={{ color: 'var(--slate)', textAlign: 'center', padding: '20px' }}>Завантаження...</p>}

            {notes.length === 0 && !loading ? (
                <EmptyState icon="📝" title="Нотаток ще немає" subtitle="Натисніть «Нова нотатка», щоб почати" />
            ) : (
                <div className="notes-list">
                    {notes.map(note => {
                        const { title: displayTitle, body: displayBody } = decodeNoteValue(note.value);
                        return (
                            <div key={note.id} className="note-card">
                         
                                <div className="note-card__header">
                                    <div className="note-card__header-info">
                                        <div className="note-card__title-row">
                                            <h4 className="note-card__title">{displayTitle || 'Без назви'}</h4>
                                            <span className="badge-saved">Збережено</span>
                                        </div>
                                        <div className="note-card__date">{fmtDateTime(note.updated_at || note.created_at)}</div>
                                    </div>
                                    <div className="note-card__actions">
                                        <button
                                            onClick={() => editId === note.id ? setEditId(null) : startEdit(note)}
                                            title="Редагувати"
                                            className="note-action-btn"
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => remove(note)} title="Видалити" className="note-action-btn delete-btn">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="note-card__divider" />

                                {/* Edit mode */}
                                {editId === note.id ? (
                                    <div className="note-card__edit-form">
                                        <input
                                            value={editTitle}
                                            onChange={e => setEditTitle(e.target.value)}
                                            onKeyUp={() => handleEditKeyup(note.id)}
                                            className="form-input note-edit-title"
                                        />
                                        <textarea
                                            value={editBody}
                                            onChange={e => setEditBody(e.target.value)}
                                            onKeyUp={() => handleEditKeyup(note.id)}
                                            rows={4}
                                            className="form-input note-edit-body"
                                        />
                                        <div className="note-edit-actions">
                                            <button onClick={() => setEditId(null)} className="btn btn--secondary btn--pill btn--sm">Скасувати</button>
                                            <button onClick={saveEdit} className="btn btn--buy-cta btn--pill btn--sm">Зберегти</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className={`note-card__body ${!displayBody ? 'note-card__body--empty' : ''}`}>
                                        {displayBody || 'Порожня нотатка'}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {trash.length > 0 && (
                <div className="notes-trash-section">
                    <p className="trash-title">Нещодавно видалені ({trash.length})</p>
                    <div className="trash-list">
                        {trash.map(n => {
                            const { title: trashTitle } = decodeNoteValue(n.value);
                            return (
                                <div key={n.id} className="trash-item">
                                    <span className="trash-item-title">{trashTitle || 'Без назви'}</span>
                                    <button onClick={() => restore(n)} className="btn btn--secondary btn--pill btn--sm restore-btn">
                                        Відновити
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <style>{`
                .notes-container {
                    background: var(--canvas);
                    border: 1px solid var(--hairline-soft);
                    border-radius: var(--radius-xl);
                    padding: var(--sp-6);
                }
                .notes-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: var(--sp-6);
                }
                .notes-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--ink-deep);
                }
                .notes-sub {
                    font-size: 13px;
                    color: var(--slate);
                    margin-top: 2px;
                }
                .add-note-btn {
                    padding: 10px 18px;
                    font-weight: 600;
                }
                .composer-card {
                    background: var(--surface-soft);
                    border: 1.5px solid var(--primary-soft);
                    border-radius: var(--radius-xl);
                    padding: var(--sp-4);
                    margin-bottom: var(--sp-6);
                }
                .composer-title-input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-family: var(--font);
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--ink-deep);
                    margin-bottom: var(--sp-2);
                    padding: 4px 0;
                }
                .composer-body-input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-family: var(--font);
                    font-size: 14px;
                    color: var(--ink);
                    line-height: 1.6;
                    resize: none;
                    padding: 4px 0;
                }
                .composer-actions {
                    display: flex;
                    gap: var(--sp-2);
                    padding-top: var(--sp-3);
                    border-top: 1px solid var(--hairline-soft);
                    margin-top: var(--sp-3);
                    justify-content: flex-end;
                }
                .notes-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--sp-4);
                }
                .note-card {
                    background: var(--canvas);
                    border: 1.5px solid var(--hairline-soft);
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    transition: border var(--t-base), transform var(--t-base);
                }
                .note-card:hover {
                    border-color: var(--hairline);
                    transform: translateY(-1px);
                }
                .note-card__header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    padding: var(--sp-4) var(--sp-4) var(--sp-2);
                    gap: var(--sp-3);
                }
                .note-card__header-info {
                    flex: 1;
                    min-width: 0;
                }
                .note-card__title-row {
                    display: flex;
                    align-items: center;
                    gap: var(--sp-2);
                    margin-bottom: 2px;
                }
                .note-card__title {
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--ink-deep);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .badge-saved {
                    font-size: 10px;
                    font-weight: 600;
                    background: rgba(49, 162, 76, 0.1);
                    color: var(--success);
                    padding: 2px 8px;
                    border-radius: var(--radius-full);
                }
                .note-card__date {
                    font-size: 11px;
                    color: var(--slate);
                }
                .note-card__actions {
                    display: flex;
                    gap: 2px;
                }
                .note-action-btn {
                    width: 28px;
                    height: 28px;
                    border-radius: var(--radius-md);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--slate);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background var(--t-fast), color var(--t-fast);
                }
                .note-action-btn:hover {
                    color: var(--ink-deep);
                    background: var(--surface-soft);
                }
                .note-action-btn.delete-btn:hover {
                    color: #EF4444;
                    background: rgba(239, 68, 68, 0.1);
                }
                .note-card__divider {
                    height: 1px;
                    background: var(--hairline-soft);
                    margin: 0 var(--sp-4);
                }
                .note-card__body {
                    padding: var(--sp-3) var(--sp-4) var(--sp-4);
                    font-size: 14px;
                    color: var(--ink);
                    line-height: 1.6;
                    white-space: pre-wrap;
                    word-break: break-word;
                }
                .note-card__body--empty {
                    color: var(--slate);
                    font-style: italic;
                }
                .note-card__edit-form {
                    padding: var(--sp-3) var(--sp-4) var(--sp-4);
                    display: flex;
                    flex-direction: column;
                    gap: var(--sp-2);
                }
                .note-edit-title {
                    font-weight: 600;
                }
                .note-edit-body {
                    resize: vertical;
                }
                .note-edit-actions {
                    display: flex;
                    gap: var(--sp-2);
                    justify-content: flex-end;
                }
                .notes-trash-section {
                    margin-top: var(--sp-8);
                    border-top: 1px solid var(--hairline-soft);
                    padding-top: var(--sp-4);
                }
                .trash-title {
                    font-size: 13px;
                    color: var(--slate);
                    font-weight: 600;
                    margin-bottom: var(--sp-3);
                }
                .trash-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--sp-2);
                }
                .trash-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--surface-soft);
                    padding: 8px var(--sp-3);
                    border-radius: var(--radius-lg);
                    opacity: 0.8;
                }
                .trash-item-title {
                    font-size: 13px;
                    color: var(--charcoal);
                    text-decoration: line-through;
                }
                .restore-btn {
                    font-size: 11px;
                    padding: 4px 10px;
                }
                @media (max-width: 480px) {
                    .notes-header {
                        flex-direction: column;
                        gap: var(--sp-3);
                        align-items: stretch;
                    }
                }
            `}</style>
        </div>
    );
}
