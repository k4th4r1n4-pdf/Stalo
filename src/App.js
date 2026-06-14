import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-client';

// !!! ERSETZE DIESE BEIDEN WERTE MIT DEINEN DATEN AUS SCHRITT 1 !!!
const SUPABASE_URL = "https://fsyxdxwvjkkadayinxdr.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzeXhkeHd2amtrYWRheWlueGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzOTIwNjksImV4cCI6MjA5Njk2ODA2OX0.hKGfCm5wA8SzuBsHwTHUmWEUL_SMSAuNgG32BwvfyK4";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const COLORS = [
  { name: 'Rot', value: '#ef4444' },
  { name: 'Blau', value: '#3b82f6' },
  { name: 'Gelb', value: '#eab308' },
  { name: 'Lila', value: '#a855f7' },
  { name: 'Grün', value: '#22c55e' }
];

export default function App() {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [search, setSearch] = useState('');

  // 1. Beiträge aus der Datenbank laden
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setPosts(data);
  };

  // 2. Neuen Beitrag abschicken
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return alert("Bitte fülle alle Felder aus!");

    const { error } = await supabase
      .from('posts')
      .insert([{ name, message, color: selectedColor }]);

    if (!error) {
      setName('');
      setMessage('');
      fetchPosts(); // Liste aktualisieren
    } else {
      alert("Fehler beim Speichern!");
    }
  };

  // 3. Beiträge filtern (Suchfunktion)
  const filteredPosts = posts.filter(post => 
    post.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>The Unsent Project Clone</h1>
        <p style={{ color: '#aaa' }}>Hinterlasse eine Nachricht, die du niemals abgeschickt hast.</p>
      </header>

      {/* Formular zum Posten */}
      <section style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', marginBottom: '40px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Für wen ist diese Nachricht? (Nur Vorname)</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Sarah"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: 'none', background: '#333', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Deine Nachricht</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Was wolltest du schon immer sagen?..."
              rows="4"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: 'none', background: '#333', color: '#fff', resize: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Wähle eine Farbe für dein Gefühl:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {COLORS.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  style={{
                    width: '35px', height: '35px', borderRadius: '50%', backgroundColor: color.value, border: selectedColor === color.value ? '3px solid white' : 'none', cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          <button type="submit" style={{ padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
            Abschicken
          </button>
        </form>
      </section>

      {/* Suchleiste */}
      <section style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Nach einem Namen suchen..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #444', background: '#111', color: '#fff', fontSize: '1rem' }}
        />
      </section>

      {/* Die Kacheln (Das Grid) */}
      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredPosts.map(post => (
          <div 
            key={post.id} 
            style={{ 
              backgroundColor: post.color, 
              color: '#fff', 
              padding: '20px', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '150px'
            }}
          >
            <p style={{ fontSize: '1.1rem', margin: '0 0 15px 0', fontStyle: 'italic', lineHeight: '1.4' }}>
              "{post.message}"
            </p>
            <h3 style={{ margin: 0, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px', opacity: 0.9 }}>
              An: {post.name}
            </h3>
          </div>
        ))}
      </main>
    </div>
  );
}