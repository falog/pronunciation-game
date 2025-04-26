import React, { useEffect, useState } from 'react';
import IWindow from '../types/i-window';
import Recorder from './Recorder';

type Props = {
  engine: 'whisper' | 'webspeech';
};

declare const window: IWindow;
const words = ['apple', 'banana', 'grape', 'orange', 'peach'];

export const Game: React.FC<Props> = ({ engine }) => {
  const [targetWord, setTargetWord] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<'waiting' | 'listening' | 'done'>('waiting');
  const [trigger, setTrigger] = useState(false); // 録音トリガー用

  useEffect(() => {
    setTargetWord(words[Math.floor(Math.random() * words.length)]);
  }, []);

  const startListening = () => {
    if (engine === 'webspeech') {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      if (!SpeechRecognition) {
        alert('Web Speech API がサポートされていません');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setStatus('listening');
      recognition.start();

      recognition.onresult = (event) => {
        const firstResult = event.results?.[0];
        const firstAlternative = firstResult?.[0];

        if (firstAlternative?.transcript) {
          const transcript = firstAlternative.transcript.trim().toLowerCase();
          setResult(transcript);
          setStatus('done');
        } else {
          setStatus('waiting');
        }
      };

      recognition.onerror = () => {
        setStatus('waiting');
      };
    } else {
      // whisper の録音トリガー
      setTrigger((prev) => !prev);
    }
  };

  const isCorrect = result === targetWord;

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>発音してみよう！</h2>
      <p style={{ fontSize: '2rem', margin: '1rem' }}>{targetWord}</p>

      {status !== 'listening' && (
        <button onClick={startListening} style={buttonStyle}>
          マイクで発音する
        </button>
      )}

      {status === 'done' && (
        <div style={{ marginTop: '1rem' }}>
          <p>あなたの発音: <strong>{result}</strong></p>
          <p style={{ color: isCorrect ? 'green' : 'red' }}>
            {isCorrect ? '正解！' : 'ちょっと違うかも…'}
          </p>
        </div>
      )}

      <Recorder engine={engine} setResult={setResult} setStatus={setStatus} trigger={trigger} />
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  padding: '1em 2em',
  fontSize: '1rem',
  backgroundColor: '#555',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '1rem',
};
