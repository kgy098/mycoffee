"use client";
import React, { useState } from 'react';
import { api } from '@/lib/api';

export default function ScoreScalesPage() {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/api/score-scales', { label, description });
      if (res.status === 201) {
        setMessage('Scale created successfully');
        setLabel('');
        setDescription('');
      } else {
        setMessage('Unexpected response');
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.detail || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:600, margin:'2rem auto', padding:20}}>
      <h1>스케일 추가</h1>
      <form onSubmit={submit}>
        <div style={{marginBottom:12}}>
          <label>라벨</label>
          <input value={label} onChange={e=>setLabel(e.target.value)} style={{width:'100%'}} />
        </div>
        <div style={{marginBottom:12}}>
          <label>설명</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} style={{width:'100%'}} />
        </div>
        <button type="submit" disabled={loading}>{loading ? '저장 중...' : '저장'}</button>
      </form>
      {message && <p style={{marginTop:12}}>{message}</p>}
    </div>
  );
}
