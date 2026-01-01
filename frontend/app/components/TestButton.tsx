// src/components/TestButton.tsx
'use client';

import { useState } from 'react';

export default function TestButton() {
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
  );
}