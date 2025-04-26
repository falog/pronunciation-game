import React from 'react';

type Props = {
  onSelect: (engine: 'whisper' | 'webspeech') => void;
};

export const EngineSelector: React.FC<Props> = ({ onSelect }) => (
  <div style={{ textAlign: 'center' }}>
    <h2>音声認識エンジンを選んでください</h2>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
      <button
        onClick={() => onSelect('whisper')}
        style={buttonStyle('#444')}
      >
        Whisper（高精度・PC向け）
      </button>
      <button
        onClick={() => onSelect('webspeech')}
        style={buttonStyle('#0070f3')}
      >
        Web Speech API（軽量・スマホ向け）
      </button>
    </div>
  </div>
);

const buttonStyle = (bgColor: string): React.CSSProperties => ({
  padding: '1em 2em',
  fontSize: '1rem',
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  minWidth: '200px',
  transition: 'background-color 0.3s',
});
