import React, { useState, useEffect } from 'react';

const TodoApp = () => {
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [currentFilter, setCurrentFilter] = useState('all');
    const [newTodoText, setNewTodoText] = useState('');
    const [editingTodo, setEditingTodo] = useState(null);
    const [deletingTodo, setDeletingTodo] = useState(null);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = newTodoText.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };
            setTodos([newTodo, ...todos]);
            setNewTodoText('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const handleEdit = (e) => {
        e.preventDefault();
        if (editingTodo && editingTodo.text.trim()) {
            setTodos(todos.map(todo =>
                todo.id === editingTodo.id ? { ...todo, text: editingTodo.text } : todo
            ));
            setEditingTodo(null);
        }
    };

    const handleDelete = () => {
        if (deletingTodo) {
            setTodos(todos.filter(todo => todo.id !== deletingTodo.id));
            setDeletingTodo(null);
        }
    };

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    const completedCount = todos.filter(todo => todo.completed).length;
    const totalCount = todos.length;

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white p-5">
            <div className="max-w-2xl mx-auto bg-[#242424] p-6 rounded-xl shadow-lg">
                <header className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">List of tasks</h1>
                    <span className="text-[#a0a0a0]">{completedCount}/{totalCount} tasks</span>
                </header>

                <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
                    <input
                        type="text"
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        className="flex-1 px-3 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#4a9eff]"
                        placeholder="Add a new todo..."
                    />
                    <button
                        type="submit"
                        className="px-5 py-3 bg-[#4a9eff] text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Add
                    </button>
                </form>

                <div className="flex gap-2 mb-6">
                    {['all', 'active', 'completed'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setCurrentFilter(filter)}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${currentFilter === filter
                                    ? 'bg-[#4a9eff] text-white'
                                    : 'bg-[#1a1a1a] text-[#a0a0a0]'
                                }`}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>

                <ul className="space-y-2">
                    {filteredTodos.map(todo => (
                        <li
                            key={todo.id}
                            className={`flex items-center bg-[#1a1a1a] p-4 rounded-lg transition-all ${todo.completed ? 'completed' : ''
                                }`}
                        >
                            <div className="flex items-center flex-1 min-w-0">
                                <div
                                    onClick={() => toggleTodo(todo.id)}
                                    className="relative w-6 h-6 cursor-pointer"
                                >
                                    <div className={`w-6 h-6 border-2 rounded-md transition-colors ${todo.completed ? 'bg-[#00cc66] border-[#00cc66]' : 'border-[#4a9eff]'
                                        }`}>
                                        {todo.completed && (
                                            <svg viewBox="0 0 16 16" className="absolute top-0.5 left-0.5 w-4 h-4">
                                                <path
                                                    d="M3.5 8.5l3 3 6-6"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className={`ml-3 truncate ${todo.completed ? 'line-through text-[#a0a0a0]' : ''
                                    }`}>
                                    {todo.text}
                                </span>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => setEditingTodo({ ...todo })}
                                    className="w-8 h-8 flex items-center justify-center bg-[#ffd700] text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    ✎
                                </button>
                                <button
                                    onClick={() => setDeletingTodo(todo)}
                                    className="w-8 h-8 flex items-center justify-center bg-[#ff4444] text-white rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    ×
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {editingTodo && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-[#242424] p-6 rounded-xl w-[90%] max-w-lg">
                            <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
                            <form onSubmit={handleEdit}>
                                <input
                                    type="text"
                                    value={editingTodo.text}
                                    onChange={(e) => setEditingTodo({ ...editingTodo, text: e.target.value })}
                                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white mb-4"
                                    autoFocus
                                />
                                <div className="flex justify-center gap-3">
                                    <button type="submit" className="px-4 py-2 bg-[#4a9eff] rounded-lg">
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingTodo(null)}
                                        className="px-4 py-2 bg-[#1a1a1a] text-[#a0a0a0] rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {deletingTodo && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-[#242424] p-6 rounded-xl w-[90%] max-w-lg text-center">
                            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-[#ff4444] rounded-lg"
                                >
                                    Yes, delete
                                </button>
                                <button
                                    onClick={() => setDeletingTodo(null)}
                                    className="px-4 py-2 bg-[#1a1a1a] text-[#a0a0a0] rounded-lg"
                                >
                                    No, cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoApp;