import React from 'react';

type Props = {
  onSelect: (engine: 'whisper' | 'webspeech') => void;
};

export const EngineSelector: React.FC<Props> = ({ onSelect }) => (
  <div style={{ textAlign: 'center' }}>
    <h2>音声認識エンジンを選んでください</h2>
    <div style={styles.buttonContainer}>
      <button
        onClick={() => onSelect('whisper')}
        style={styles.whisperButton}
      >
        Whisper（高精度・PC向け）
      </button>
      <button
        onClick={() => onSelect('webspeech')}
        style={styles.webSpeechButton}
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

const styles = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '1rem',
    flexWrap: 'wrap' as React.CSSProperties['flexWrap'],
  },
  whisperButton: {
    ...buttonStyle('#444'),
    '@media (max-width: 600px)': { // 例：画面幅が 600px 以下の場合
      minWidth: 'auto',
      width: '100%',
      marginBottom: '1rem',
    },
  },
  webSpeechButton: {
    ...buttonStyle('#0070f3'),
    '@media (max-width: 600px)': { // 例：画面幅が 600px 以下の場合
      minWidth: 'auto',
      width: '100%',
    },
  },
};