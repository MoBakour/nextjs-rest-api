"use client";

import { useState, useEffect } from "react";

interface User {
    _id: string;
    name: string;
    email: string;
}

export default function Home() {
    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users", {
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
                },
            });
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
                },
                body: JSON.stringify({ name, email }),
            });

            if (!response.ok) throw new Error("Failed to add user");

            setName("");
            setEmail("");
            fetchUsers();
        } catch (err) {
            setError("Failed to add user");
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-white">
                User Management
            </h1>

            {/* Add User Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Add User
                    </button>
                </form>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold p-6 border-b">
                    Users List
                </h2>
                <div className="divide-y">
                    {users.map((user) => (
                        <div key={user._id} className="p-6">
                            <h3 className="text-lg font-medium">{user.name}</h3>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <div className="p-6 text-gray-500">No users found</div>
                    )}
                </div>
            </div>
        </div>
    );
}
