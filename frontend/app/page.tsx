// src/app/page.tsx
'use client'; // Add this at the top

import { useState } from 'react';

export default function HomePage() {
  const [testResult, setTestResult] = useState<string>('');

  const testBackend = async () => {
    try {
      const res = await fetch('http://localhost:3000/auth/users');
      const data = await res.json();
      setTestResult(`✅ Backend connected! Found ${data.length} users`);
    } catch (error) {
      setTestResult('❌ Backend connection failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🔐 Authentication System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Full-stack authentication with Next.js 14 & NestJS
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              Frontend: http://localhost:3001
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              Backend: http://localhost:3000
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login</h2>
            <p className="text-gray-600 mb-6">
              Access your existing account with email and password
            </p>
            <a
              href="/login"
              className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              Go to Login
            </a>
          </div>

          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Register</h2>
            <p className="text-gray-600 mb-6">
              Create a new account with name, email and password
            </p>
            <a
              href="/register"
              className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
            >
              Go to Register
            </a>
          </div>
        </div>

        {/* API Test Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">API Testing</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Test Backend Connection</h3>
                <p className="text-sm text-gray-500">Check if backend is running</p>
                {testResult && (
                  <p className={`mt-2 text-sm ${testResult.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {testResult}
                  </p>
                )}
              </div>
              <button
                onClick={testBackend}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Test
              </button>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Built With</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-gray-800 text-white rounded-lg">Next.js 14</span>
            <span className="px-4 py-2 bg-green-600 text-white rounded-lg">NestJS</span>
            <span className="px-4 py-2 bg-blue-500 text-white rounded-lg">TypeScript</span>
            <span className="px-4 py-2 bg-cyan-500 text-white rounded-lg">Tailwind CSS</span>
            <span className="px-4 py-2 bg-purple-600 text-white rounded-lg">PostgreSQL</span>
            <span className="px-4 py-2 bg-red-500 text-white rounded-lg">JWT Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
}