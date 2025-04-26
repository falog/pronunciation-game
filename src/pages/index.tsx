import { useState } from 'react';
import { EngineSelector } from '@/components/EngineSelector';
import { Game } from '@/components/Game';

export default function Home() {
  const [engine, setEngine] = useState<'whisper' | 'webspeech' | null>(null);

  return (
    <main style={{ textAlign: 'center', padding: '2em' }}>
      <h1>発音チェックゲーム</h1>
      {engine === null ? (
        <EngineSelector onSelect={setEngine} />
      ) : (
        <Game engine={engine} />
      )}
    </main>
  );
}
