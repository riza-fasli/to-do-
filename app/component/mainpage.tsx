"use client";
import React, { useState, useEffect } from 'react';
import { Check, Trash2, Plus, LogOut, User } from 'lucide-react';

type User = { username: string };
type Todo = { id: number; text: string; completed: boolean; createdAt: string };

export default function TodoApp(): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const savedUser = localStorage.getItem('todoUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      loadTodos(userData.username);
    }
  }, []);

  function loadTodos(username: string) {
    const allTodos = JSON.parse(localStorage.getItem('todos') || '{}') as Record<string, Todo[]>;
    setTodos(allTodos[username] || []);
  }

  const saveTodos = (username: string, updatedTodos: Todo[]) => {
    const allTodos = JSON.parse(localStorage.getItem('todos') || '{}') as Record<string, Todo[]>;
    allTodos[username] = updatedTodos;
    localStorage.setItem('todos', JSON.stringify(allTodos));
    setTodos(updatedTodos);
  };

  const handleAuth = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (isRegistering) {
      if (users[username]) {
        setError('Username already exists');
        return;
      }
      users[username] = { password };
      localStorage.setItem('users', JSON.stringify(users));
    } else {
      if (!users[username] || users[username].password !== password) {
        setError('Invalid username or password');
        return;
      }
    }

    const userData = { username };
    setUser(userData);
    localStorage.setItem('todoUser', JSON.stringify(userData));
    loadTodos(username);
    setUsername('');
    setPassword('');
  };

  const handleLogout = () => {
    setUser(null);
    setTodos([]);
    localStorage.removeItem('todoUser');
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedTodos = [...todos, todo];
    if (user) saveTodos(user.username, updatedTodos);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    if (user) saveTodos(user.username, updatedTodos);
  };

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    if (user) saveTodos(user.username, updatedTodos);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isRegistering ? 'Sign up to get started' : 'Sign in to your account'}
            </p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth(e)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth(e)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={handleAuth}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-[1.02]"
            >
              {isRegistering ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">My Tasks</h1>
                <p className="text-indigo-100 mt-1">Welcome back, {user.username}!</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <button
                onClick={addTodo}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>

            <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
              {(['all', 'active', 'completed'] as ('all' | 'active' | 'completed')[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === f
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg">No tasks found</p>
                  <p className="text-sm mt-2">Add a task to get started!</p>
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                        todo.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-indigo-500'
                      }`}
                    >
                      {todo.completed && <Check className="w-4 h-4 text-white" />}
                    </button>

                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-800'
                      }`}
                    >
                      {todo.text}
                    </span>

                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {todos.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-600">
                <span>{todos.filter(t => !t.completed).length} active tasks</span>
                <span>{todos.filter(t => t.completed).length} completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}