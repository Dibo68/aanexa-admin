// src/app/dashboard/debug/page.tsx
'use client';

import { useState } from 'react';
// WICHTIG: Stellen Sie sicher, dass runServerDebug in actions.ts existiert
import { runServerDebug } from '@/lib/actions'; 
import Navigation from '@/components/Navigation';

export default function DebugPage() {
    const [debugResult, setDebugResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRunDebug = async () => {
        setIsLoading(true);
        // Die Funktion gibt jetzt ein Objekt zurück, wir greifen auf .data oder .error zu
        const result = await runServerDebug();
        if (result.error) {
            setDebugResult(`FEHLER: ${result.error}\n\n${result.data}`);
        } else {
            setDebugResult(result.data || 'Keine Daten zurückgegeben.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation currentPath="/dashboard/debug" />
            <main className="max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-4">Server Debug Page</h1>
                <p className="mb-4">
                    Klicken Sie auf den Button, um die Verifizierungs-Funktion auf dem Server auszuführen und das Ergebnis hier anzuzeigen.
                </p>
                <button
                    onClick={handleRunDebug}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                    {isLoading ? 'Running...' : 'Run Server-Side Debug'}
                </button>

                {debugResult && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-2">Ergebnis vom Server:</h2>
                        <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                            {debugResult}
                        </pre>
                    </div>
                )}
            </main>
        </div>
    );
}
