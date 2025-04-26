import React, { useEffect, useCallback } from 'react';

type Props = {
  engine: 'whisper' | 'webspeech';
  setResult: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<'waiting' | 'listening' | 'done'>>;
  trigger: boolean;
};

const Recorder: React.FC<Props> = ({ engine, setResult, setStatus, trigger }) => {
  const startWhisperRecognition = useCallback(async () => {
    try {
      setStatus('listening');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const data = new Uint8Array(analyser.fftSize);
      const VOLUME_THRESHOLD = 0.02; // 現実的な値に下げる
      const SILENCE_DURATION_MS = 1500; // 無音が続いたら録音終了
      
      let silenceStartTime: number | null = null;
      let startedSpeaking = false;
      const IGNORE_INITIAL_MS = 1000; // 最初の1秒間は何も検出しない
      const startedAt = performance.now(); // チェック開始時刻を記録


      const checkSilence = () => {
        analyser.getByteTimeDomainData(data);
        const volume = data.reduce((acc, val) => acc + Math.abs(val - 128), 0) / data.length;
        const normalizedVolume = volume / 128;
      
        const now = performance.now();
      
  

        // 最初の1秒間はノイズを無視
        if (now - startedAt < IGNORE_INITIAL_MS) {
              requestAnimationFrame(checkSilence);
              return;
          }

        if (normalizedVolume > VOLUME_THRESHOLD) {
          if (!startedSpeaking) {
            startedSpeaking = true;
            console.log('音声を検出、録音開始');
            mediaRecorder.start();
          }
          silenceStartTime = null;
        } else if (startedSpeaking) {
          if (silenceStartTime === null) {
            silenceStartTime = now;
          } else if (now - silenceStartTime > SILENCE_DURATION_MS) {
            console.log('無音が続いたので録音停止');
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
            analyser.disconnect();
            source.disconnect();
            audioContext.close();
            return; // チェック終了
          }
        }
      
        requestAnimationFrame(checkSilence);
      };
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioBlob);

        try {
          const res = await fetch('/whisper-api-url', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          const transcript = data.text.trim().toLowerCase();
          setResult(transcript);
          setStatus('done');
        } catch (error) {
          console.error('Whisperエラー:', error);
          setStatus('waiting');
        }
      };

      // 無音の判定と音声の入力をリアルタイムでチェック
      requestAnimationFrame(checkSilence);

    } catch (e) {
      console.error('マイク使用に失敗しました', e);
      setStatus('waiting');
    }
  }, [setStatus, setResult]);

  useEffect(() => {
    if (trigger && engine === 'whisper') {
      startWhisperRecognition();
    }
  }, [trigger, engine, startWhisperRecognition]);

  return null;
};

export default Recorder;
