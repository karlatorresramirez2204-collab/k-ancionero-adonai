import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';

// --- SELF-CONTAINED INLINE SVG ICONS (Avoids React 18/19 $$typeof symbol mismatches) ---
const Icon = ({ children, className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

const Music = ({ className }) => (<Icon className={className}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></Icon>);
const ListMusic = ({ className }) => (<Icon className={className}><path d="M21 15V6" /><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /><path d="M12 12H3" /><path d="M16 6H3" /><path d="M12 18H3" /></Icon>);
const BookOpen = ({ className }) => (<Icon className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></Icon>);
const Headphones = ({ className }) => (<Icon className={className}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" /></Icon>);
const Calendar = ({ className }) => (<Icon className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></Icon>);
const Plus = ({ className }) => (<Icon className={className}><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></Icon>);
const Moon = ({ className }) => (<Icon className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></Icon>);
const Sun = ({ className }) => (<Icon className={className}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></Icon>);
const Zap = ({ className }) => (<Icon className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon>);
const SkipBack = ({ className }) => (<Icon className={className}><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" x2="5" y1="19" y2="5" /></Icon>);
const SkipForward = ({ className }) => (<Icon className={className}><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" x2="19" y1="5" y2="19" /></Icon>);
const Play = ({ className }) => (<Icon className={className}><polygon points="5 3 19 12 5 21 5 3" /></Icon>);
const Pause = ({ className }) => (<Icon className={className}><rect width="4" height="16" x="6" y="4" /><rect width="4" height="16" x="14" y="4" /></Icon>);
const Edit3 = ({ className }) => (<Icon className={className}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></Icon>);
const Share2 = ({ className }) => (<Icon className={className}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></Icon>);
const User = ({ className }) => (<Icon className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>);
const X = ({ className }) => (<Icon className={className}><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></Icon>);
const ChevronUp = ({ className }) => (<Icon className={className}><polyline points="18 15 12 9 6 15" /></Icon>);
const ChevronDown = ({ className }) => (<Icon className={className}><polyline points="6 9 12 15 18 9" /></Icon>);
const Trash2 = ({ className }) => (<Icon className={className}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></Icon>);
const Search = ({ className }) => (<Icon className={className}><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></Icon>);
const Eye = ({ className }) => (<Icon className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></Icon>);
const EyeOff = ({ className }) => (<Icon className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></Icon>);
const ExternalLink = ({ className }) => (<Icon className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></Icon>);
const Check = ({ className }) => (<Icon className={className}><polyline points="20 6 9 17 4 12" /></Icon>);
const Upload = ({ className }) => (<Icon className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></Icon>);
const FileAudio = ({ className }) => (<Icon className={className}><path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3" /><polyline points="14 2 14 8 20 8" /><path d="M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0Z" /><path d="M6 20v-1a2 2 0 1 0-4 0v1a2 2 0 1 0 4 0Z" /><path d="M2 19v-3a6 6 0 0 1 12 0v3" /></Icon>);
const Repeat = ({ className }) => (<Icon className={className}><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></Icon>);
const Youtube = ({ className }) => (<Icon className={className}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></Icon>);
const Maximize2 = ({ className }) => (<Icon className={className}><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" x2="14" y1="3" y2="10" /><line x1="3" x2="10" y1="21" y2="14" /></Icon>);
const Minimize2 = ({ className }) => (<Icon className={className}><polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" x2="21" y1="10" y2="3" /><line x1="3" x2="10" y1="21" y2="14" /></Icon>);
const Sparkles = ({ className }) => (<Icon className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></Icon>);
const Sliders = ({ className }) => (<Icon className={className}><line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" /><line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" /><line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" /><line x1="1" x2="7" y1="14" y2="14" /><line x1="9" x2="15" y1="8" y2="8" /><line x1="17" x2="23" y1="16" y2="16" /></Icon>);

// --- INDEXEDDB HELPER ---
const AUDIO_DB_NAME = 'kancionero_nuevo_audio_db';
const AUDIO_STORE_NAME = 'song_audios';
const APP_STATE_STORE_NAME = 'app_state';
const APP_STATE_KEY = 'current';
const memoryAudioFallback = new Map();
const AUDIO_ACCEPTED_EXTENSIONS = new Set(['mp3', 'wav', 'm4a', 'aac', 'ogg', 'opus', 'flac', 'wma']);
const AUDIO_MAX_BYTES = 250 * 1024 * 1024;

function validateAudioFile(file) {
  if (!file || typeof file.name !== 'string') return 'Archivo no válido.';
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const hasAudioMime = typeof file.type === 'string' && file.type.toLowerCase().startsWith('audio/');
  if (!hasAudioMime && !AUDIO_ACCEPTED_EXTENSIONS.has(extension)) return 'Formato no compatible. Usa MP3, WAV, M4A, AAC, OGG, OPUS, FLAC o WMA.';
  if (file.size <= 0) return 'El archivo está vacío.';
  if (file.size > AUDIO_MAX_BYTES) return 'El archivo supera el límite local de 250 MB.';
  return '';
}

function openAudioDB() {
  return new Promise<any>((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) { reject(new Error('IndexedDB no disponible')); return; }
    try {
      const req = window.indexedDB.open(AUDIO_DB_NAME, 2);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(AUDIO_STORE_NAME)) db.createObjectStore(AUDIO_STORE_NAME);
        if (!db.objectStoreNames.contains(APP_STATE_STORE_NAME)) db.createObjectStore(APP_STATE_STORE_NAME);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) { reject(err); }
  });
}

async function saveAppStateSnapshot(snapshot) {
  try {
    const db = await openAudioDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(APP_STATE_STORE_NAME, 'readwrite');
      tx.objectStore(APP_STATE_STORE_NAME).put(snapshot, APP_STATE_KEY);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
    return true;
  } catch (error) {
    console.warn('IndexedDB no pudo guardar el estado del cancionero.', error);
    return false;
  }
}

async function getAppStateSnapshot() {
  try {
    const db = await openAudioDB();
    return await new Promise<any>((resolve, reject) => {
      const tx = db.transaction(APP_STATE_STORE_NAME, 'readonly');
      const req = tx.objectStore(APP_STATE_STORE_NAME).get(APP_STATE_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn('IndexedDB no pudo leer el estado del cancionero.', error);
    return null;
  }
}
async function saveSongAudioFile(songId, file) {
  const validationError = validateAudioFile(file);
  if (validationError) throw new Error(validationError);
  memoryAudioFallback.set(songId, file);
  try {
    const db = await openAudioDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(AUDIO_STORE_NAME, 'readwrite');
      tx.objectStore(AUDIO_STORE_NAME).put(file, songId);
      tx.oncomplete = () => resolve(true); tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.warn('IndexedDB no pudo guardar el audio; se conserva en memoria durante esta sesión.', error);
  }
  return true;
}
async function getSongAudioFile(songId) {
  if (memoryAudioFallback.has(songId)) return memoryAudioFallback.get(songId);
  try {
    const db = await openAudioDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(AUDIO_STORE_NAME, 'readonly');
      const req = tx.objectStore(AUDIO_STORE_NAME).get(songId);
      req.onsuccess = () => resolve(req.result || null); req.onerror = () => reject(req.error);
    });
  } catch { return memoryAudioFallback.get(songId) || null; }
}
async function deleteSongAudioFile(songId) {
  memoryAudioFallback.delete(songId);
  try {
    const db = await openAudioDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(AUDIO_STORE_NAME, 'readwrite');
      tx.objectStore(AUDIO_STORE_NAME).delete(songId);
      tx.oncomplete = () => resolve(true); tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.warn('IndexedDB no pudo eliminar el audio.', error);
  }
  return true;
}

function readLocalStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`No se pudo leer ${key}. Se usarán los datos disponibles.`, error);
    return fallback;
  }
}

function writeLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`No se pudo guardar ${key}.`, error);
    return false;
  }
}

function extractYouTubeId(url) {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// --- INITIAL DEMO DATA ---
const INITIAL_SONGS = [
  { id: '1', title: 'Way Maker / Aquí Estás', artist: 'Sinach / Priscilla Bueno', key: 'E', link: 'https://www.youtube.com/watch?v=iJCV_l9Tq5o', tags: ['Adoración', 'Ministración'], rawText: `[INTRO]\nA   E   B   C#m\n\n[VERSO 1]\nA                          E\nAquí estás, te vemos mover\n             B               C#m\nTe adoraré, te adoraré\nA                          E\nAquí estás, obrando en mí\n             B               C#m\nTe adoraré, te adoraré\n\n[CORO]\n           A\nMilagroso, abres camino\n              E\nCumples promesas, luz en tinieblas\nB                   C#m\nMi Dios, así eres Tú\n\n[PUENTE]\nA\nAunque no pueda ver estás obrando\nE\nAunque no pueda ver estás obrando\nB\nSiempre estás, siempre estás obrando\nC#m\nSiempre estás, siempre estás obrando`, voiceNotes: 'Entrar suave en el verso. Subir intensidad en el puente.' },
  { id: '2', title: 'Cantaré de Tu Amor', artist: 'Danilo Montero / Hillsong', key: 'G', link: 'https://www.youtube.com/results?search_query=Cantare+de+Tu+Amor+Danilo+Montero', tags: ['Alabanza', 'Júbilo'], rawText: `[VERSO 1]\nG                        C\nPor mucho tiempo busqué una razón de vivir\nEm                       D\nEn medio de mil preguntas Tu amor me respondió\n\n[CORO]\nG                 D\nCantaré de Tu amor\nEm                C\nRendirémos nuestro corazón ante Ti`, voiceNotes: 'Ritmo alegre desde el inicio. Palmas en el segundo verso.' },
  { id: '3', title: 'Digno', artist: 'Marcos Brunet', key: 'D', link: 'https://www.youtube.com/results?search_query=Digno+Marcos+Brunet', tags: ['Adoración', 'Profunda'], rawText: `[VERSO 1]\nD                   G\nNo tengo nada para ofrecer\nBm                  A\nNada que Te pueda sorprender\n\n[CORO]\nD                   A/C#\nY no hay nada que me haga más feliz\nBm                  G\nQue estar aquí a Tus pies`, voiceNotes: 'Bajar dinámica en el segundo coro.' },
  { id: '4', title: 'Bueno Es Dios', artist: 'Don Moen / Marcos Witt', key: 'A', link: 'https://www.youtube.com/results?search_query=Bueno+es+Dios+Marcos+Witt', tags: ['Alabanza', 'Clásico'], rawText: `[CORO]\nA            E\nBueno es Dios, siempre fiel\nD                 A        E\nPuso un canto nuevo en mi corazón\n\n[VERSO 1]\nD                 A\nSi vas por el valle y hay sombras alrededor\nD                 E\nDi adiós al temor pues seguro en Él estás`, voiceNotes: 'Entrada directa al coro con toda la banda.' }
];
const INITIAL_SETLISTS = [{ id: 'set-1', date: '2026-11-15', title: 'Servicio Dominical - General', director: 'Carlos Ramírez', notes: 'Probar Modo Escenario en vertical.', alabanza: [{ songId: '2', tone: 'G', notes: 'Entrada con batería y guitarras' }, { songId: '4', tone: 'A', notes: 'Pegada directo desde el coro' }], adoracion: [{ songId: '1', tone: 'E', notes: 'Ministración abierta en el puente' }, { songId: '3', tone: 'D', notes: 'Cierre íntimo solo teclado y voces' }] }];
const INITIAL_EVENTS = [{ id: 'ev-1', date: '2026-11-15', title: 'Servicio Dominical', director: 'Carlos Ramírez', setlistId: 'set-1', type: 'servicio' }, { id: 'ev-2', date: '2026-11-13', title: 'Ensayo General de Alabanza', director: 'Carlos Ramírez', setlistId: 'set-1', type: 'ensayo' }];
const INITIAL_TUTOR = [
  { pregunta: '¿Cómo se define un intervalo de semitono?', respuesta: 'En guitarra equivale a un traste. En teclado corresponde a una tecla contigua.' },
  { pregunta: '¿Cómo se forma un acorde tríada mayor?', respuesta: 'Con tónica, tercera mayor y quinta justa. Por ejemplo: C-E-G.' },
  { pregunta: '¿Cómo se obtiene el relativo mayor de un acorde menor?', respuesta: 'Sube tres semitonos. Por ejemplo: Am → C.' }
];

function createVersionId() {
  return `version-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeSongRecord(song) {
  if (!song || song.id == null) return null;
  const sourceVersions = Array.isArray(song.versions) && song.versions.length ? song.versions : [{ id: 'version-original', title: 'Original', key: song.key || 'C', rawText: song.rawText || '', voiceNotes: song.voiceNotes || '' }];
  const versions = sourceVersions.filter(Boolean).map((version, index) => ({
    id: String(version.id || (index === 0 ? 'version-original' : createVersionId())),
    title: String(version.title || version.keyName || (index === 0 ? 'Original' : `Versión ${index + 1}`)),
    key: String(version.key || song.key || 'C').trim().toUpperCase(),
    rawText: String(version.rawText ?? version.content ?? song.rawText ?? ''),
    voiceNotes: String(version.voiceNotes ?? song.voiceNotes ?? '')
  }));
  const active = versions.find(version => version.id === song.activeVersionId) || versions[0];
  return { ...song, id: String(song.id), key: active.key, rawText: active.rawText, voiceNotes: active.voiceNotes, activeVersionId: active.id, versions };
}

function normalizeSongList(value) {
  return Array.isArray(value) ? value.map(normalizeSongRecord).filter(Boolean) : [];
}

function getSongVersion(song, versionId) {
  if (!song) return null;
  const versions = normalizeSongRecord(song).versions;
  return versions.find(version => version.id === versionId) || versions[0] || null;
}

function normalizeSetlistList(value, songs) {
  if (!Array.isArray(value)) return [];
  const validIds = new Set(songs.map(song => String(song.id)));
  return value.filter(Boolean).map(setlist => ({
    ...setlist,
    id: String(setlist.id || `set-${Date.now()}`),
    alabanza: normalizeSetlistItems(setlist.alabanza, songs, validIds),
    adoracion: normalizeSetlistItems(setlist.adoracion, songs, validIds)
  }));
}

function normalizeSetlistItems(items, songs, validIds) {
  return (Array.isArray(items) ? items : []).filter(item => item && validIds.has(String(item.songId))).map(item => {
    const song = songs.find(candidate => String(candidate.id) === String(item.songId));
    return { ...item, songId: String(item.songId), versionId: String(item.versionId || song?.activeVersionId || song?.versions?.[0]?.id || 'version-original'), tone: String(item.tone || song?.key || 'C') };
  });
}

function getSetlistSongIds(setlist) {
  return [...(setlist?.alabanza || []), ...(setlist?.adoracion || [])].map(item => String(item.songId)).filter((id, index, all) => all.indexOf(id) === index);
}

function safeFilePart(value) {
  return String(value || 'audio').replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'audio';
}

async function createSetlistPackage(setlist, songs) {
  const zip = new JSZip();
  const packageSongs = [];
  for (const songId of getSetlistSongIds(setlist)) {
    const song = songs.find(candidate => String(candidate.id) === songId);
    if (!song) continue;
    const copy = normalizeSongRecord(song);
    const audio = copy.hasAudioFile ? await getSongAudioFile(copy.id) : null;
    let audioPath = '';
    if (audio) {
      audioPath = `audio/${safeFilePart(copy.id)}-${safeFilePart(audio.name || copy.audioFileName || 'pista')}`;
      zip.file(audioPath, audio);
    }
    packageSongs.push({ ...copy, audioPath });
  }
  zip.file('manifest.json', JSON.stringify({ format: 'kancionero-setlist', version: 1, exportedAt: new Date().toISOString(), setlist, songs: packageSongs }, null, 2));
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

async function readSetlistPackage(file) {
  const zip = await JSZip.loadAsync(file);
  const manifestFile = zip.file('manifest.json');
  if (!manifestFile) throw new Error('El paquete no contiene manifest.json.');
  const manifest = JSON.parse(await manifestFile.async('string'));
  if (manifest.format !== 'kancionero-setlist' || !manifest.setlist || !Array.isArray(manifest.songs)) throw new Error('El archivo no es un setlist válido.');
  const audioFiles = [];
  for (const song of manifest.songs) {
    if (!song.audioPath) continue;
    const audioEntry = zip.file(song.audioPath);
    if (!audioEntry) continue;
    const blob = await audioEntry.async('blob');
    audioFiles.push({ songId: String(song.id), file: new File([blob], song.audioFileName || song.audioPath.split('/').pop() || 'audio', { type: blob.type || 'audio/mpeg' }) });
  }
  return { manifest, audioFiles };
}

// --- MUSIC THEORY ---
const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function transposeToken(token, semitones) {
  if (!token || semitones === 0) return token;
  const match = token.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return token;
  let root = match[1], suffix = match[2], slashPart = '';
  const slashIndex = suffix.indexOf('/');
  if (slashIndex !== -1) {
    const slashRoot = suffix.substring(slashIndex + 1);
    suffix = suffix.substring(0, slashIndex);
    slashPart = '/' + transposeToken(slashRoot, semitones);
  }
  let idx = SHARP_NOTES.indexOf(root);
  if (idx === -1) idx = FLAT_NOTES.indexOf(root);
  if (idx === -1) return token;
  let newIdx = (idx + semitones) % 12;
  if (newIdx < 0) newIdx += 12;
  return SHARP_NOTES[newIdx] + suffix + slashPart;
}

function isChordLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) return false;
  const tokens = trimmed.split(/\s+/);
  if (tokens.length === 0) return false;
  const chordPattern = /^([A-G][#b]?(m|maj|min|dim|aug|sus|add|[0-9])*(?:\/[A-G][#b]?)?|N\.C\.|intro|coro|verso)$/i;
  let chordCount = 0;
  for (const t of tokens) {
    const cleanToken = t.replace(/[(),]/g, '');
    if (chordPattern.test(cleanToken)) chordCount++;
  }
  return chordCount > 0 && chordCount / tokens.length >= 0.6;
}

function transposeLine(line, semitones) {
  if (!line || semitones === 0) return line;
  return line.replace(/\b([A-G][#b]?(?:m|maj|min|dim|aug|sus|add|[0-9])*(?:\/[A-G][#b]?)?)\b/g, (match) => transposeToken(match, semitones));
}

// ==========================================
// MAIN APP
// ==========================================
export default function App() {
  const [songs, setSongs] = useState(() => normalizeSongList(readLocalStorage('kancionero_songs', INITIAL_SONGS)));
  const [setlists, setSetlists] = useState(() => normalizeSetlistList(readLocalStorage('kancionero_setlists', INITIAL_SETLISTS), normalizeSongList(readLocalStorage('kancionero_songs', INITIAL_SONGS))));
  const [events, setEvents] = useState(() => readLocalStorage('kancionero_events', INITIAL_EVENTS));
  const [activeTab, setActiveTab] = useState('setlists');
  const [isStageOpen, setIsStageOpen] = useState(false);
  const [activeSetlistId, setActiveSetlistId] = useState(() => setlists[0]?.id || INITIAL_SETLISTS[0]?.id || null);
  const [activeStageSongIndex, setActiveStageSongIndex] = useState(0);
  const [playlistIds, setPlaylistIds] = useState(() => readLocalStorage('kancionero_playlist', ['1', '2', '3', '4']));
  const [editingSong, setEditingSong] = useState(null);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const backupInputRef = useRef(null);
  const [playerTrackIndex, setPlayerTrackIndex] = useState(0);
  const [isPlayerPlaying, setIsPlayerPlaying] = useState(false);
  const [playerAutoNext, setPlayerAutoNext] = useState(true);
  const [playerRepeatAll, setPlayerRepeatAll] = useState(false);
  const [playerAudioUrl, setPlayerAudioUrl] = useState(null);
  const [playerAudioName, setPlayerAudioName] = useState('');
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [playerDuration, setPlayerDuration] = useState(0);
  const globalAudioRef = useRef(null);
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('kancionero_theme') || 'dark'; } catch { return 'dark'; } });
  const hydratedFromIndexedDbRef = useRef(false);
  const isLight = theme === 'light';
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  useEffect(() => { localStorage.setItem('kancionero_theme', theme); }, [theme]);
  useEffect(() => { writeLocalStorage('kancionero_songs', songs); }, [songs]);
  useEffect(() => { writeLocalStorage('kancionero_setlists', setlists); }, [setlists]);
  useEffect(() => { writeLocalStorage('kancionero_events', events); }, [events]);
  useEffect(() => { writeLocalStorage('kancionero_playlist', playlistIds); }, [playlistIds]);

  useEffect(() => {
    let cancelled = false;
    getAppStateSnapshot().then(snapshot => {
      if (cancelled) return;
      if (snapshot) {
        if (Array.isArray(snapshot.songs)) setSongs(normalizeSongList(snapshot.songs));
        if (Array.isArray(snapshot.setlists)) setSetlists(normalizeSetlistList(snapshot.setlists, normalizeSongList(snapshot.songs || songs)));
        if (Array.isArray(snapshot.events)) setEvents(snapshot.events);
        if (Array.isArray(snapshot.playlistIds)) setPlaylistIds(snapshot.playlistIds);
        if (snapshot.theme === 'light' || snapshot.theme === 'dark') setTheme(snapshot.theme);
      }
      hydratedFromIndexedDbRef.current = true;
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hydratedFromIndexedDbRef.current) return;
    saveAppStateSnapshot({ songs, setlists, events, playlistIds, theme });
  }, [songs, setlists, events, playlistIds, theme]);

  const activeSetlist = setlists.find(s => s.id === activeSetlistId) || setlists[0];
  const playlistSongs = playlistIds.map(id => songs.find(s => s.id === id)).filter(Boolean);
  const currentPlayerSong = playlistSongs[playerTrackIndex] || playlistSongs[0] || null;

  useEffect(() => {
    if (playlistSongs.length > 0 && playerTrackIndex >= playlistSongs.length) setPlayerTrackIndex(0);
  }, [playlistSongs.length, playerTrackIndex]);

  useEffect(() => {
    let activeUrl = null, cancelled = false;
    setPlayerCurrentTime(0); setPlayerDuration(0);
    if (!currentPlayerSong) { setPlayerAudioUrl(null); setPlayerAudioName(''); return; }
    getSongAudioFile(currentPlayerSong.id).then(file => {
      if (cancelled) return;
      if (file) { activeUrl = URL.createObjectURL(file); setPlayerAudioUrl(activeUrl); setPlayerAudioName(file.name || currentPlayerSong.audioFileName || 'Audio MP3'); }
      else { setPlayerAudioUrl(null); setPlayerAudioName(''); }
    }).catch(() => { if (!cancelled) { setPlayerAudioUrl(null); setPlayerAudioName(''); } });
    return () => { cancelled = true; if (activeUrl) URL.revokeObjectURL(activeUrl); };
  }, [currentPlayerSong?.id, currentPlayerSong?.hasAudioFile]);

  useEffect(() => {
    const el = globalAudioRef.current;
    if (!el || !playerAudioUrl) return;
    if (isPlayerPlaying) el.play().catch(() => setIsPlayerPlaying(false)); else el.pause();
  }, [isPlayerPlaying, playerAudioUrl]);

  const handleGlobalNextTrack = () => {
    if (playlistSongs.length === 0) return;
    if (playerTrackIndex < playlistSongs.length - 1) { setPlayerTrackIndex(playerTrackIndex + 1); setIsPlayerPlaying(true); }
    else if (playerRepeatAll) { setPlayerTrackIndex(0); setIsPlayerPlaying(true); }
    else setIsPlayerPlaying(false);
  };
  const handleGlobalPrevTrack = () => {
    if (playlistSongs.length === 0) return;
    if (globalAudioRef.current && globalAudioRef.current.currentTime > 3) { globalAudioRef.current.currentTime = 0; return; }
    setPlayerTrackIndex(prev => (prev > 0 ? prev - 1 : playlistSongs.length - 1));
    setIsPlayerPlaying(true);
  };

  const [uploadStatusMsg, setUploadStatusMsg] = useState('');
  const handleBatchMp3Upload = async (fileList: FileList | File[]) => {
    const files: File[] = Array.from(fileList || []);
    if (files.length === 0) return;
    const createdSongs = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const validationError = validateAudioFile(f);
      if (validationError) {
        setUploadStatusMsg(`${f.name}: ${validationError}`);
        continue;
      }
      const cleanTitle = f.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
      const newId = `song-${Date.now()}-${i}`;
      try {
        await saveSongAudioFile(newId, f);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo guardar el audio.';
        setUploadStatusMsg(`${f.name}: ${message}`);
        continue;
      }
      createdSongs.push({ id: newId, title: cleanTitle || `Alabanza ${i + 1}`, artist: 'Archivo MP3 Local', key: 'C', link: '', hasAudioFile: true, audioFileName: f.name, tags: ['MP3'], rawText: `[LETRA PENDIENTE]\nPista de audio: ${f.name}\n\nToca "Editar" para pegar o escribir la letra y acordes.`, voiceNotes: '' });
    }
    if (createdSongs.length > 0) {
      setSongs(prev => [...createdSongs.map(normalizeSongRecord), ...prev]);
      const newIds = createdSongs.map(s => s.id);
      setPlaylistIds(prev => [...newIds, ...prev]);
      setPlayerTrackIndex(0); setIsPlayerPlaying(true); setActiveTab('player');
      setUploadStatusMsg(createdSongs.length === 1 ? `¡Listo! Se cargó "${createdSongs[0].title}" y empezó a sonar.` : `¡Listo! Se cargaron ${createdSongs.length} alabanzas.`);
      setTimeout(() => setUploadStatusMsg(''), 4500);
    }
  };

  const openStageMode = (setlistId, songIndex = 0) => { setActiveSetlistId(setlistId); setActiveStageSongIndex(songIndex); setIsStageOpen(true); };
  const openInMusicPlayer = (songId) => {
    const idx = playlistIds.indexOf(songId);
    if (idx !== -1) setPlayerTrackIndex(idx);
    else { setPlaylistIds(prev => [songId, ...prev]); setPlayerTrackIndex(0); }
    setIsPlayerPlaying(true); setActiveTab('player');
  };

  const makeCurrentSetlistPackage = async () => {
    if (!activeSetlist) throw new Error('No hay un setlist seleccionado.');
    return createSetlistPackage(activeSetlist, songs);
  };

  const exportCurrentSetlist = async () => {
    try {
      const blob = await makeCurrentSetlistPackage();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeFilePart(activeSetlist.title)}-setlist.ksetlist`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'No se pudo exportar el setlist.');
    }
  };

  const shareCurrentSetlist = async () => {
    try {
      const blob = await makeCurrentSetlistPackage();
      const file = new File([blob], `${safeFilePart(activeSetlist.title)}-setlist.ksetlist`, { type: 'application/zip' });
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ title: activeSetlist.title, text: 'Setlist de ALABANZASKANCIONERO', files: [file] });
      } else {
        await navigator.clipboard?.writeText('El navegador no permite adjuntar el paquete directamente. Usa Exportar setlist y compártelo desde Descargas.');
        await exportCurrentSetlist();
      }
    } catch (error) {
      if (error?.name !== 'AbortError') window.alert(error instanceof Error ? error.message : 'No se pudo compartir el setlist.');
    }
  };

  const importSetlistPackage = async (file) => {
    if (!file) return;
    try {
      const { manifest, audioFiles } = await readSetlistPackage(file);
      const importedSongs = normalizeSongList(manifest.songs);
      const mergedSongs = normalizeSongList([...songs.filter(song => !importedSongs.some(incoming => incoming.id === song.id)), ...importedSongs]);
      const importedSetlist = normalizeSetlistList([manifest.setlist], mergedSongs)[0];
      if (!importedSetlist) throw new Error('El setlist no contiene canciones reconocibles.');
      setSongs(mergedSongs);
      setSetlists(previous => normalizeSetlistList(previous.some(item => item.id === importedSetlist.id) ? previous.map(item => item.id === importedSetlist.id ? importedSetlist : item) : [importedSetlist, ...previous], mergedSongs));
      setActiveSetlistId(importedSetlist.id);
      for (const audio of audioFiles) await saveSongAudioFile(audio.songId, audio.file);
      setUploadStatusMsg(`Setlist “${importedSetlist.title}” importado con ${importedSongs.length} canciones.`);
      setTimeout(() => setUploadStatusMsg(''), 5000);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'No se pudo importar el setlist.');
    }
  };

  const exportBackup = () => {
    const backup = { version: 1, exportedAt: new Date().toISOString(), songs, setlists, events, playlistIds, theme };
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `kancionero-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const backup = JSON.parse(String(reader.result || '{}'));
        if (!Array.isArray(backup.songs) || !Array.isArray(backup.setlists) || !Array.isArray(backup.events)) throw new Error('El archivo no contiene un respaldo válido.');
        if (!window.confirm('Esto reemplazará canciones, setlists, agenda y playlist locales. ¿Continuar?')) return;
        setSongs(backup.songs);
        setSetlists(backup.setlists);
        setEvents(backup.events);
        if (Array.isArray(backup.playlistIds)) setPlaylistIds(backup.playlistIds);
        if (backup.theme === 'light' || backup.theme === 'dark') setTheme(backup.theme);
      } catch (error) {
        window.alert(error instanceof Error ? error.message : 'No se pudo importar el respaldo.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`h-[100dvh] w-full overflow-hidden flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500 selection:text-zinc-950 ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-[#09090b] text-zinc-100'}`}>
      <header className={`border-b shrink-0 z-30 transition-colors ${isLight ? 'bg-white/95 border-slate-200' : 'bg-zinc-950/95 border-zinc-800/80'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 cursor-pointer min-w-0" onClick={() => setActiveTab('setlists')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-zinc-950 font-bold shadow-md shadow-amber-500/20 shrink-0"><Music className="w-5 h-5" /></div>
            <div className="truncate">
              <h1 className={`font-extrabold text-base sm:text-lg tracking-tight truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>K-ancionero-<span className={`font-light ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>Adonaí</span></h1>
              <p className={`text-[11px] hidden sm:block ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Biblioteca nueva • En Vivo</p>
            </div>
          </div>
          <nav className={`hidden md:flex items-center gap-1.5 p-1 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-800'}`}>
            {[['setlists', 'Setlist', ListMusic], ['library', 'Biblioteca', BookOpen], ['player', 'Escuchar Música', Headphones], ['calendar', 'Calendario', Calendar], ['tutor', 'Tutor', Sparkles]].map(([tab, label, IconComp]) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-amber-500 text-zinc-950 shadow font-bold' : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-white/70' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'}`}>
                <IconComp className="w-4 h-4" /><span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button onClick={exportBackup} title="Exportar respaldo JSON" className={`p-2 rounded-xl border transition active:scale-95 ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'}`}><Upload className="w-4 h-4 rotate-180" /></button>
            <button onClick={() => backupInputRef.current?.click()} title="Importar respaldo JSON" className={`p-2 rounded-xl border transition active:scale-95 ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'}`}><Upload className="w-4 h-4" /></button>
            <input ref={backupInputRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { importBackup(e.target.files?.[0]); e.target.value = ''; }} />
            <button onClick={() => { setEditingSong(null); setIsSongModalOpen(true); }} className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-extrabold px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1 shadow transition shrink-0">
              <Plus className="w-4 h-4 stroke-[2.5]" /><span className="hidden sm:inline">Nueva Alabanza</span><span className="sm:hidden">Nueva</span>
            </button>
            <button onClick={toggleTheme} className={`p-2 rounded-xl border transition active:scale-95 ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-amber-400'}`}>
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button onClick={() => openStageMode(activeSetlist?.id, 0)} className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-extrabold px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1 shadow-lg shadow-emerald-500/20 transition shrink-0">
              <Zap className="w-4 h-4 fill-current" /><span className="hidden xs:inline sm:inline">Escenario</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-7xl w-full mx-auto px-2 sm:px-6 py-3 sm:py-6 pb-6">
          {activeTab === 'setlists' && (<SetlistTab setlists={setlists} setSetlists={setSetlists} songs={songs} activeSetlist={activeSetlist} setActiveSetlistId={setActiveSetlistId} onOpenStage={openStageMode} onListenSong={openInMusicPlayer} onEditSong={(song) => { setEditingSong(song); setIsSongModalOpen(true); }} onOpenNewSong={() => { setEditingSong(null); setIsSongModalOpen(true); }} onExportSetlist={exportCurrentSetlist} onShareSetlist={shareCurrentSetlist} onImportSetlist={importSetlistPackage} theme={theme} />)}
          {activeTab === 'library' && (<SongLibraryTab songs={songs} setSongs={setSongs} onListenSong={openInMusicPlayer} onEditSong={(song) => { setEditingSong(song); setIsSongModalOpen(true); }} onNewSong={() => { setEditingSong(null); setIsSongModalOpen(true); }} theme={theme} />)}
          {activeTab === 'player' && (<MusicPlayerTab songs={songs} activeSetlist={activeSetlist} playlistIds={playlistIds} setPlaylistIds={setPlaylistIds} playlistSongs={playlistSongs} currentTrackIndex={playerTrackIndex} setCurrentTrackIndex={setPlayerTrackIndex} isPlayingAudio={isPlayerPlaying} setIsPlayingAudio={setIsPlayerPlaying} autoNext={playerAutoNext} setAutoNext={setPlayerAutoNext} repeatAll={playerRepeatAll} setRepeatAll={setPlayerRepeatAll} audioUrl={playerAudioUrl} audioFileName={playerAudioName} currentTime={playerCurrentTime} duration={playerDuration} onSeek={(val) => { setPlayerCurrentTime(val); if (globalAudioRef.current) globalAudioRef.current.currentTime = val; }} onNextTrack={handleGlobalNextTrack} onPrevTrack={handleGlobalPrevTrack} onBatchUploadMp3={handleBatchMp3Upload} uploadStatusMsg={uploadStatusMsg} onNewSong={() => { setEditingSong(null); setIsSongModalOpen(true); }} onEditSong={(song) => { setEditingSong(song); setIsSongModalOpen(true); }} onOpenStage={() => openStageMode(activeSetlist?.id, 0)} theme={theme} />)}
          {activeTab === 'calendar' && (<CalendarTab events={events} setEvents={setEvents} setlists={setlists} onSelectSetlist={(id) => { setActiveSetlistId(id); setActiveTab('setlists'); }} theme={theme} />)}
          {activeTab === 'tutor' && (<TutorTab theme={theme} />)}
        </div>
      </main>

      {playerAudioUrl && (<audio ref={globalAudioRef} src={playerAudioUrl} onTimeUpdate={(e) => setPlayerCurrentTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setPlayerDuration(e.currentTarget.duration)} onEnded={() => { if (playerAutoNext) handleGlobalNextTrack(); else setIsPlayerPlaying(false); }} />)}

      {activeTab !== 'player' && playerAudioUrl && currentPlayerSong && (
        <div className={`border-t px-3 py-2 flex items-center justify-between gap-2 shrink-0 z-30 ${isLight ? 'bg-amber-50 border-amber-200 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-white'}`}>
          <div onClick={() => setActiveTab('player')} className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0"><Headphones className="w-4 h-4" /></div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold truncate">{currentPlayerSong.title}</p>
              <p className="text-[10px] opacity-75 truncate">Tocando MP3 • Toca para ver letra</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={handleGlobalPrevTrack} className="p-1.5 rounded-lg hover:bg-black/10"><SkipBack className="w-4 h-4" /></button>
            <button onClick={() => setIsPlayerPlaying(!isPlayerPlaying)} className="w-8 h-8 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow">
              {isPlayerPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button onClick={handleGlobalNextTrack} className="p-1.5 rounded-lg hover:bg-black/10"><SkipForward className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <nav className={`md:hidden border-t shrink-0 grid grid-cols-5 px-1 py-1.5 z-30 transition-colors ${isLight ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-800/90'}`}>
        {[['setlists', 'Setlist', ListMusic], ['library', 'Biblioteca', BookOpen], ['player', 'Música', Headphones], ['calendar', 'Agenda', Calendar], ['tutor', 'Tutor', Sparkles]].map(([tab, label, IconComp]) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${activeTab === tab ? isLight ? 'text-amber-600 bg-amber-500/15' : 'text-amber-400 bg-amber-500/10' : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'}`}>
            <IconComp className="w-5 h-5" /><span className="text-[11px] font-bold mt-0.5">{label}</span>
          </button>
        ))}
      </nav>

      {isStageOpen && (<StageTeleprompterTab setlist={activeSetlist} songs={songs} initialIndex={activeStageSongIndex} onEditSong={(song) => { setEditingSong(song); setIsSongModalOpen(true); }} onRemixSong={(song) => { if (!activeSetlist) return; setSetlists(prev => prev.map(item => item.id === activeSetlist.id ? { ...item, adoracion: [...(item.adoracion || []), { songId: song.id, versionId: song.activeVersionId || song.versions?.[0]?.id || 'version-original', tone: song.key, notes: 'Improvisada en vivo' }] } : item)); }} onClose={() => setIsStageOpen(false)} theme={theme} onToggleTheme={toggleTheme} />)}

      {isSongModalOpen && (<SongEditorModal song={editingSong} onSave={(savedSong) => { if (editingSong) setSongs(songs.map(s => s.id === savedSong.id ? savedSong : s)); else setSongs([savedSong, ...songs]); setIsSongModalOpen(false); }} onClose={() => setIsSongModalOpen(false)} theme={theme} />)}
    </div>
  );
}

// ==========================================
// 1. SETLIST TAB
// ==========================================
function SetlistTab({ setlists, setSetlists, songs, activeSetlist, setActiveSetlistId, onOpenStage, onListenSong, onEditSong, onOpenNewSong, onExportSetlist, onShareSetlist, onImportSetlist, theme }) {
  const isLight = theme === 'light';
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [songPickerSection, setSongPickerSection] = useState(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [copiedAlert, setCopiedAlert] = useState(false);
  const setlistImportRef = useRef(null);

  const handleCreateSetlist = () => {
    const newSet = { id: 'set-' + Date.now(), date: new Date().toISOString().split('T')[0], title: 'Nuevo Servicio', director: 'Por asignar', notes: '', alabanza: [], adoracion: [] };
    setSetlists([newSet, ...setlists]); setActiveSetlistId(newSet.id); setIsEditingHeader(true);
  };
  const updateSetlistField = (field, value) => { if (!activeSetlist) return; setSetlists(setlists.map(s => (s.id === activeSetlist.id ? { ...s, [field]: value } : s))); };
  const addSongToSection = (section, song) => { if (!activeSetlist) return; updateSetlistField(section, [...(activeSetlist[section] || []), { songId: song.id, versionId: song.activeVersionId || song.versions?.[0]?.id || 'version-original', tone: song.key || 'C', notes: '' }]); setSongPickerSection(null); setPickerSearch(''); };
  const updateItemInSection = (section, idx, field, value) => { if (!activeSetlist) return; const list = [...(activeSetlist[section] || [])]; list[idx] = { ...list[idx], [field]: value }; updateSetlistField(section, list); };
  const removeItemFromSection = (section, idx) => { if (!activeSetlist) return; const list = [...(activeSetlist[section] || [])]; list.splice(idx, 1); updateSetlistField(section, list); };
  const moveItemInSection = (section, idx, direction) => { if (!activeSetlist) return; const list = [...(activeSetlist[section] || [])]; const target = idx + direction; if (target < 0 || target >= list.length) return; const temp = list[idx]; list[idx] = list[target]; list[target] = temp; updateSetlistField(section, list); };

  const handleShareWhatsApp = () => {
    if (!activeSetlist) return;
    const formatSection = (items) => (items || []).map((it, idx) => { const s = songs.find(x => x.id === it.songId); return s ? `${idx + 1}. ${s.title} (${it.tone || s.key})` : ''; }).filter(Boolean).join('\n');
    const msg = `*${activeSetlist.title}*\nFecha: ${activeSetlist.date}\nDirector: ${activeSetlist.director}\n\n*ALABANZA:*\n${formatSection(activeSetlist.alabanza) || 'Sin canciones'}\n\n*ADORACIÓN:*\n${formatSection(activeSetlist.adoracion) || 'Sin canciones'}`;
    if (navigator.clipboard) navigator.clipboard.writeText(msg).catch(() => {});
    setCopiedAlert(true); setTimeout(() => setCopiedAlert(false), 3000);
  };

  if (!activeSetlist) return (<div className="text-center py-12 space-y-3"><p className="text-sm text-zinc-500">No hay setlists creados.</p><button onClick={handleCreateSetlist} className="bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-sm">+ Crear Primer Setlist</button></div>);

  return (
    <div className="space-y-4">
      <div className={`p-3.5 sm:p-5 rounded-2xl border space-y-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <select value={activeSetlist.id} onChange={(e) => setActiveSetlistId(e.target.value)} className={`flex-1 border rounded-xl px-3 py-2 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'}`}>
              {setlists.map(s => (<option key={s.id} value={s.id}>{s.date} — {s.title}</option>))}
            </select>
            <button onClick={handleCreateSetlist} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0"><Plus className="w-4 h-4" /> Nuevo</button>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => setIsEditingHeader(!isEditingHeader)} className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-200'}`}><Edit3 className="w-3.5 h-3.5 text-amber-500" /><span>{isEditingHeader ? 'Listo' : 'Editar Datos'}</span></button>
            <button onClick={handleShareWhatsApp} className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-200'}`}><Share2 className="w-3.5 h-3.5 text-emerald-500" /><span>{copiedAlert ? '¡Copiado!' : 'Copiar Lista'}</span></button>
            <button onClick={onExportSetlist} className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-200'}`}><Upload className="w-3.5 h-3.5 rotate-180 text-amber-500" /><span>Exportar</span></button>
            <button onClick={onShareSetlist} className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-200'}`}><Share2 className="w-3.5 h-3.5 text-emerald-500" /><span>Compartir</span></button>
            <button onClick={() => setlistImportRef.current?.click()} className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-200'}`}><Upload className="w-3.5 h-3.5 text-amber-500" /><span>Importar</span></button>
            <input ref={setlistImportRef} type="file" accept=".ksetlist,application/zip,.zip" className="hidden" onChange={(e) => { onImportSetlist(e.target.files?.[0]); e.target.value = ''; }} />
            <button onClick={() => onOpenStage(activeSetlist.id, 0)} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 shadow"><Play className="w-3.5 h-3.5 fill-current" /> Teleprompter</button>
          </div>
        </div>
        {isEditingHeader ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-800/40">
            <div><label className="text-[11px] font-bold opacity-70 block mb-1">Nombre</label><input type="text" value={activeSetlist.title} onChange={(e) => updateSetlistField('title', e.target.value)} className={`w-full border rounded-xl px-3 py-1.5 text-xs font-bold ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'}`} /></div>
            <div><label className="text-[11px] font-bold opacity-70 block mb-1">Director</label><input type="text" value={activeSetlist.director} onChange={(e) => updateSetlistField('director', e.target.value)} className={`w-full border rounded-xl px-3 py-1.5 text-xs font-bold ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'}`} /></div>
            <div><label className="text-[11px] font-bold opacity-70 block mb-1">Fecha</label><input type="date" value={activeSetlist.date} onChange={(e) => updateSetlistField('date', e.target.value)} className={`w-full border rounded-xl px-3 py-1.5 text-xs font-bold ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'}`} /></div>
            <div className="sm:col-span-3"><label className="text-[11px] font-bold opacity-70 block mb-1">Notas</label><input type="text" placeholder="Notas del servicio..." value={activeSetlist.notes || ''} onChange={(e) => updateSetlistField('notes', e.target.value)} className={`w-full border rounded-xl px-3 py-1.5 text-xs ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'}`} /></div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs pt-1">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-amber-500" /> Director: <strong>{activeSetlist.director}</strong></span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-500" /> Fecha: <strong>{activeSetlist.date}</strong></span>
            {activeSetlist.notes && (<span className={`italic ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>• {activeSetlist.notes}</span>)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SetlistSectionCard title="1. Bloque de Alabanza" subtitle="Cantos de júbilo y entrada" sectionKey="alabanza" items={activeSetlist.alabanza || []} startIndexOffset={0} songs={songs} onAddClick={() => setSongPickerSection('alabanza')} onUpdateItem={updateItemInSection} onRemoveItem={removeItemFromSection} onMoveItem={moveItemInSection} onOpenStage={(idx) => onOpenStage(activeSetlist.id, idx)} onListenSong={onListenSong} onEditSong={onEditSong} theme={theme} />
        <SetlistSectionCard title="2. Bloque de Adoración" subtitle="Ministración y adoración profunda" sectionKey="adoracion" items={activeSetlist.adoracion || []} startIndexOffset={(activeSetlist.alabanza || []).length} songs={songs} onAddClick={() => setSongPickerSection('adoracion')} onUpdateItem={updateItemInSection} onRemoveItem={removeItemFromSection} onMoveItem={moveItemInSection} onOpenStage={(idx) => onOpenStage(activeSetlist.id, idx)} onListenSong={onListenSong} onEditSong={onEditSong} theme={theme} />
      </div>

      {songPickerSection && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3">
          <div className={`w-full max-w-lg rounded-2xl border p-4 space-y-3 shadow-2xl ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-white'}`}>
            <div className="flex items-center justify-between"><h3 className="font-extrabold text-sm sm:text-base">Agregar a {songPickerSection === 'alabanza' ? 'Alabanza' : 'Adoración'}</h3><button onClick={() => setSongPickerSection(null)} className="p-1 text-zinc-400 hover:text-amber-500"><X className="w-5 h-5" /></button></div>
            <div className="flex gap-2">
              <input type="text" autoFocus placeholder="Buscar alabanza..." value={pickerSearch} onChange={(e) => setPickerSearch(e.target.value)} className={`flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'}`} />
              <button onClick={() => { setSongPickerSection(null); onOpenNewSong(); }} className="bg-amber-500 text-zinc-950 font-bold px-3 py-2 rounded-xl text-xs shrink-0">+ Nueva</button>
            </div>
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {songs.filter(s => s.title.toLowerCase().includes(pickerSearch.toLowerCase())).map(song => (
                <button key={song.id} onClick={() => addSongToSection(songPickerSection, song)} className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${isLight ? 'bg-slate-50 hover:bg-amber-50 border-slate-200' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800'}`}>
                  <div className="min-w-0"><div className="text-xs sm:text-sm font-bold truncate">{song.title}</div><div className="text-[11px] opacity-65 truncate">{song.artist || 'Sin autor'}</div></div>
                  <span className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded shrink-0 ${isLight ? 'bg-red-50 text-red-600' : 'bg-zinc-900 text-amber-400'}`}>{song.key}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SetlistSectionCard({ title, subtitle, sectionKey, items, startIndexOffset, songs, onAddClick, onUpdateItem, onRemoveItem, onMoveItem, onOpenStage, onListenSong, onEditSong, theme }) {
  const isLight = theme === 'light';
  return (
    <div className={`border rounded-2xl p-4 space-y-3 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
      <div className="flex items-center justify-between gap-2">
        <div><h3 className={`font-extrabold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h3><p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{subtitle}</p></div>
        <button onClick={onAddClick} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow"><Plus className="w-4 h-4" /> Agregar</button>
      </div>
      <div className="space-y-2.5">
        {items.length === 0 ? (
          <div className={`border border-dashed rounded-xl p-6 text-center text-xs ${isLight ? 'border-slate-300 text-slate-400' : 'border-zinc-800 text-zinc-500'}`}>No hay canciones. Toca "+ Agregar".</div>
        ) : (
          items.map((item, idx) => {
            const song = songs.find(s => s.id === item.songId);
            if (!song) return null;
            const globalIndex = startIndexOffset + idx;
            return (
              <div key={`${item.songId}-${idx}`} className={`border rounded-xl p-3 space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-500 font-extrabold text-xs flex items-center justify-center shrink-0">{globalIndex + 1}</span>
                    <div className="min-w-0"><h4 className={`font-bold text-sm truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{song.title}</h4><p className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{song.artist || 'Sin autor'}</p></div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {song.versions?.length > 1 && (<select value={item.versionId || song.activeVersionId || song.versions[0].id} onChange={(e) => onUpdateItem(sectionKey, idx, 'versionId', e.target.value)} className={`max-w-28 border rounded-lg px-1 py-1 text-[10px] font-bold ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-900 border-zinc-700 text-zinc-200'}`} title="Versión de la canción">{song.versions.map(version => <option key={version.id} value={version.id}>{version.title}</option>)}</select>)}
                    <span className="text-[10px] opacity-60">Tono:</span>
                    <input type="text" value={item.tone || song.key || 'C'} onChange={(e) => onUpdateItem(sectionKey, idx, 'tone', e.target.value.toUpperCase())} className={`w-12 border rounded-lg px-1 py-1 text-xs font-mono font-extrabold text-center uppercase ${isLight ? 'bg-red-50 border-red-200 text-red-600' : 'bg-zinc-900 border-zinc-700 text-amber-400'}`} />
                  </div>
                </div>
                <input type="text" placeholder="Nota rápida para ensayo o voces..." value={item.notes || ''} onChange={(e) => onUpdateItem(sectionKey, idx, 'notes', e.target.value)} className={`w-full border rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-zinc-900/80 border-zinc-800 text-zinc-200'}`} />
                <div className="flex items-center justify-between gap-1 pt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button onClick={() => onOpenStage(globalIndex)} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1"><Play className="w-3 h-3 fill-current" /> Ver Letra</button>
                    <button onClick={() => onListenSong(song.id)} className={`px-2 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 ${isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-zinc-900 border-zinc-800 text-zinc-300'}`}><Headphones className="w-3 h-3 text-amber-500" /> Escuchar</button>
                    <button onClick={() => onEditSong(song)} className={`p-1.5 rounded-lg border ${isLight ? 'bg-white border-slate-300 text-amber-600' : 'bg-zinc-900 border-zinc-800 text-amber-400'}`}><Edit3 className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onMoveItem(sectionKey, idx, -1)} disabled={idx === 0} className="p-1 rounded hover:bg-amber-500/20 disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => onMoveItem(sectionKey, idx, 1)} disabled={idx === items.length - 1} className="p-1 rounded hover:bg-amber-500/20 disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => onRemoveItem(sectionKey, idx)} className="p-1 rounded text-red-500/75 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. SONG LIBRARY TAB
// ==========================================
function SongLibraryTab({ songs, setSongs, onListenSong, onEditSong, onNewSong, theme }) {
  const isLight = theme === 'light';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSongId, setSelectedSongId] = useState(songs[0]?.id || null);
  const [showChordsInPreview, setShowChordsInPreview] = useState(true);

  const filteredSongs = songs.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || (s.artist || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.rawText || '').toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedSong = songs.find(s => s.id === selectedSongId) || filteredSongs[0] || null;
  const handleDeleteSong = (id) => { setSongs(songs.filter(s => s.id !== id)); deleteSongAudioFile(id).catch(() => {}); };

  return (
    <div className="space-y-4">
      <div className={`p-3.5 sm:p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-2.5 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input type="text" placeholder="Buscar alabanza..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'}`} />
        </div>
        <button onClick={onNewSong} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow"><Plus className="w-4 h-4" /> Nueva / Importar Docs</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className={`lg:col-span-5 border rounded-2xl p-3 space-y-2 max-h-[65dvh] overflow-y-auto ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          <div className="text-xs font-extrabold uppercase px-1 opacity-60">Repertorio Guardado ({filteredSongs.length})</div>
          {filteredSongs.length === 0 ? (<p className="text-xs text-zinc-500 text-center py-8">No se encontraron alabanzas.</p>) : (
            filteredSongs.map(song => {
              const isSelected = selectedSong?.id === song.id;
              return (
                <div key={song.id} onClick={() => setSelectedSongId(song.id)} className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-2 ${isSelected ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold shadow' : isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-100'}`}>
                  <div className="min-w-0"><div className="text-sm font-bold truncate">{song.title}</div><div className="text-[11px] opacity-75 flex items-center gap-1.5 truncate"><span>{song.artist || 'Sin autor'}</span>{song.hasAudioFile && <span>• 🎵 MP3</span>}</div></div>
                  <span className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded shrink-0 ${isSelected ? 'bg-zinc-950/20 text-zinc-950' : isLight ? 'bg-red-50 text-red-600' : 'bg-zinc-900 text-amber-400'}`}>{song.key}</span>
                </div>
              );
            })
          )}
        </div>

        <div className={`lg:col-span-7 border rounded-2xl p-4 sm:p-6 space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          {selectedSong ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-3 border-zinc-800/30">
                <div className="min-w-0"><h2 className={`text-xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedSong.title}</h2><p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{selectedSong.artist || 'Sin autor'} • Tono: <strong className={isLight ? 'text-red-600' : 'text-amber-400'}>{selectedSong.key}</strong></p></div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button onClick={() => onListenSong(selectedSong.id)} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"><Headphones className="w-3.5 h-3.5" /> Escuchar</button>
                  <button onClick={() => onEditSong(selectedSong)} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"><Edit3 className="w-3.5 h-3.5" /> Editar</button>
                  <button onClick={() => handleDeleteSong(selectedSong.id)} className="p-1.5 rounded-xl text-red-500 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button onClick={() => setShowChordsInPreview(!showChordsInPreview)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-zinc-950 border-zinc-800 text-amber-400'}`}>
                  {showChordsInPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showChordsInPreview ? 'Ocultar Acordes' : 'Mostrar Acordes'}</span>
                </button>
                {selectedSong.link && (<a href={selectedSong.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"><ExternalLink className="w-3.5 h-3.5" /> Ver Video</a>)}
              </div>
              {selectedSong.voiceNotes && (<div className={`p-3 rounded-xl border text-xs ${isLight ? 'bg-amber-50 border-amber-200 text-amber-950' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'}`}><strong>Notas:</strong> {selectedSong.voiceNotes}</div>)}
              <div className={`p-4 rounded-xl border max-h-[50dvh] overflow-y-auto space-y-1 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
                {(selectedSong.rawText || '').split('\n').map((line, idx) => {
                  const isChord = isChordLine(line);
                  const isHeader = line.trim().startsWith('[') && line.trim().endsWith(']');
                  if (!showChordsInPreview && isChord) return null;
                  if (isHeader) return (<div key={idx} className={`text-xs font-extrabold uppercase pt-2 ${isLight ? 'text-slate-500' : 'text-amber-400'}`}>{line}</div>);
                  if (isChord) return (<div key={idx} className={`font-mono text-xs sm:text-sm font-bold whitespace-pre-wrap ${isLight ? 'text-red-600' : 'text-amber-400'}`}>{line}</div>);
                  return (<div key={idx} className={`font-mono text-sm sm:text-base font-medium whitespace-pre-wrap ${isLight ? 'text-slate-900' : 'text-white'}`}>{line}</div>);
                })}
              </div>
            </>
          ) : (<div className="text-center py-12 text-xs text-zinc-500">Selecciona una alabanza o crea una nueva.</div>)}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2B. MUSIC PLAYER TAB
// ==========================================
function MusicPlayerTab({ songs, activeSetlist, playlistIds, setPlaylistIds, playlistSongs, currentTrackIndex, setCurrentTrackIndex, isPlayingAudio, setIsPlayingAudio, autoNext, setAutoNext, repeatAll, setRepeatAll, audioUrl, audioFileName, currentTime, duration, onSeek, onNextTrack, onPrevTrack, onBatchUploadMp3, uploadStatusMsg, onNewSong, onEditSong, onOpenStage, theme }) {
  const isLight = theme === 'light';
  const [addSearch, setAddSearch] = useState('');
  const [showAddSongs, setShowAddSongs] = useState(false);
  const [lyricsMode, setLyricsMode] = useState('voces');
  const batchAudioInputRef = useRef(null);
  const legacyAudioInputRef = useRef(null);

  const currentSong = playlistSongs[currentTrackIndex] || playlistSongs[0] || null;
  const youtubeId = currentSong ? extractYouTubeId(currentSong.link) : null;

  const handleLoadTodaySetlist = () => {
    if (!activeSetlist) return;
    const ids = [...(activeSetlist.alabanza || []).map(i => i.songId), ...(activeSetlist.adoracion || []).map(i => i.songId)];
    const uniqueIds = [...new Set(ids)];
    if (uniqueIds.length > 0) { setPlaylistIds(uniqueIds); setCurrentTrackIndex(0); setIsPlayingAudio(true); }
  };
  const formatTime = (sec) => { if (!sec || isNaN(sec)) return '0:00'; const m = Math.floor(sec / 60); const s = Math.floor(sec % 60); return `${m}:${s < 10 ? '0' : ''}${s}`; };

  return (
    <div className="space-y-4">
      {uploadStatusMsg && (<div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"><Check className="w-4 h-4 shrink-0" /><span>{uploadStatusMsg}</span></div>)}

      <div className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
        <div>
          <h2 className={`text-lg font-extrabold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}><Headphones className="w-5 h-5 text-amber-500" /> Escuchar Música & Cantar</h2>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Sube tus MP3 o arma tu lista libre</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* ✅ FIX MÓVIL + AYUDA VISIBLE */}
          <div className="flex flex-col">
            <button type="button" onClick={() => batchAudioInputRef.current?.click()} className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-extrabold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer transition select-none min-h-11">
              <Upload className="w-4 h-4 shrink-0" /><span>Subir MP3s (Descargas / Música)</span>
            </button>
            <input ref={batchAudioInputRef} id="mobile-batch-mp3-input" type="file" multiple accept="audio/*" onChange={(e) => { if (e.target.files && e.target.files.length > 0) { onBatchUploadMp3(e.target.files); e.target.value = ''; } }} className="mt-1.5 w-full min-h-11 text-[11px] file:mr-2 file:py-2 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-emerald-500/20 file:text-emerald-500 text-zinc-400 max-w-[250px]" />
            {/* ✅ AYUDA MÓVIL */}
            <p className={`text-[10px] mt-1 max-w-[230px] leading-tight ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              📱 <strong>Android:</strong> abre tu carpeta Música/Descargas.<br />
              🍎 <strong>iPhone:</strong> toca "Elegir Archivo" → "En mi iPhone" → Descargas.
            </p>
            <div className="mt-2 border-t border-zinc-700/40 pt-2">
              <p className={`text-[10px] mb-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>¿El teléfono es antiguo y no abre el selector?</p>
              <a href="/legacy-upload.html" className={`block min-h-11 w-full rounded-xl border px-3 py-2 text-[11px] font-bold flex items-center ${isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-zinc-950 border-zinc-700 text-zinc-300'}`}>Abrir selector sencillo para teléfono antiguo</a>
              <input ref={legacyAudioInputRef} type="file" accept="" onChange={(e) => { if (e.target.files && e.target.files.length > 0) { onBatchUploadMp3([e.target.files[0]]); e.target.value = ''; } }} className={`w-full min-h-11 text-[11px] rounded-xl border p-2 file:mr-2 file:py-2 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-amber-500 file:text-zinc-950 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-700' : 'bg-zinc-950 border-zinc-700 text-zinc-300'}`} />
            </div>
          </div>
          {activeSetlist && (<button onClick={handleLoadTodaySetlist} className={`text-xs font-bold px-3 py-2 rounded-xl border flex items-center gap-1.5 transition ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'}`}><ListMusic className="w-3.5 h-3.5 text-amber-500" /> Setlist Hoy</button>)}
          <button type="button" onClick={onOpenStage} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow min-h-11"><Maximize2 className="w-4 h-4" /> Pantalla completa</button>
          <button onClick={() => setShowAddSongs(!showAddSongs)} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition"><Plus className="w-4 h-4" /> Elegir Lista ({playlistSongs.length})</button>
        </div>
      </div>

      {showAddSongs && (
        <div className={`border rounded-2xl p-4 space-y-3 ${isLight ? 'bg-white border-amber-300 shadow-md' : 'bg-zinc-900 border-amber-500/40'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Marca las alabanzas:</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => { setShowAddSongs(false); onNewSong(); }} className="text-xs font-bold text-amber-500 hover:underline">+ Crear Nueva</button>
              <button onClick={() => setShowAddSongs(false)} className="text-zinc-400 hover:text-amber-500"><X className="w-5 h-5" /></button>
            </div>
          </div>
          <input type="text" placeholder="Buscar..." value={addSearch} onChange={(e) => setAddSearch(e.target.value)} className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
            {songs.filter(s => s.title.toLowerCase().includes(addSearch.toLowerCase())).map(song => {
              const inList = playlistIds.includes(song.id);
              return (
                <button key={song.id} type="button" onClick={() => { if (inList) setPlaylistIds(playlistIds.filter(id => id !== song.id)); else setPlaylistIds([...playlistIds, song.id]); }} className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 ${inList ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-300 font-bold' : isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-zinc-950 border-zinc-800 text-zinc-300'}`}>
                  <div className="min-w-0"><div className="text-xs truncate">{song.title}</div><div className="text-[10px] opacity-70 flex items-center gap-1.5"><span>{song.key}</span>{song.hasAudioFile && <span className="text-emerald-500 font-bold">• MP3</span>}{song.link && !song.hasAudioFile && <span>• YouTube</span>}</div></div>
                  {inList ? <Check className="w-4 h-4 text-amber-500 shrink-0" /> : <Plus className="w-4 h-4 opacity-50 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className={`lg:col-span-7 border rounded-2xl p-4 sm:p-6 space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          {currentSong ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-500">Pista {currentTrackIndex + 1} de {playlistSongs.length}</span>
                  <h3 className={`text-xl sm:text-2xl font-extrabold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentSong.title}</h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{currentSong.artist || 'Sin autor'} • Tono: <strong className={isLight ? 'text-red-600' : 'text-amber-400'}>{currentSong.key}</strong></p>
                </div>
                <button onClick={() => onEditSong(currentSong)} className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1 shrink-0 ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'}`}><Edit3 className="w-3.5 h-3.5 text-amber-500" /> Editar / MP3</button>
              </div>

              {audioUrl ? (
                <div className={`p-4 rounded-2xl border space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-500 truncate"><FileAudio className="w-4 h-4 shrink-0" /><span className="truncate">{audioFileName}</span></span>
                    <span className="font-mono text-[11px] opacity-75 shrink-0">{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                  <input type="range" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={(e) => onSeek(parseFloat(e.target.value))} className="w-full accent-amber-500 cursor-pointer h-2 rounded-lg" />
                  <div className="flex items-center justify-center gap-4 pt-1">
                    <button onClick={() => setRepeatAll(!repeatAll)} className={`p-2 rounded-xl transition ${repeatAll ? 'text-amber-500 bg-amber-500/15' : 'text-zinc-400 hover:text-zinc-200'}`}><Repeat className="w-4 h-4" /></button>
                    <button onClick={onPrevTrack} className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-white'}`}><SkipBack className="w-5 h-5" /></button>
                    <button onClick={() => setIsPlayingAudio(!isPlayingAudio)} className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/25 transition active:scale-95">
                      {isPlayingAudio ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                    </button>
                    <button onClick={onNextTrack} className={`p-2.5 rounded-xl border ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-white'}`}><SkipForward className="w-5 h-5" /></button>
                    <button onClick={() => setAutoNext(!autoNext)} className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition ${autoNext ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500' : 'border-zinc-700 text-zinc-400'}`}>Auto-Sig</button>
                  </div>
                </div>
              ) : youtubeId ? (
                <div className="space-y-2">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black">
                    <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${youtubeId}?rel=0`} title={currentSong.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button onClick={onPrevTrack} className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 ${isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-zinc-950 border-zinc-800 text-zinc-200'}`}><SkipBack className="w-3.5 h-3.5" /> Anterior</button>
                      <button onClick={onNextTrack} className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 ${isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-zinc-950 border-zinc-800 text-zinc-200'}`}>Siguiente <SkipForward className="w-3.5 h-3.5" /></button>
                    </div>
                    <a href={currentSong.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"><Youtube className="w-4 h-4" /> YouTube</a>
                  </div>
                </div>
              ) : currentSong.link ? (
                <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
                  <div className="text-xs"><p className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Enlace externo</p><p className={`truncate max-w-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>{currentSong.link}</p></div>
                  <div className="flex items-center gap-2"><a href={currentSong.link} target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"><ExternalLink className="w-3.5 h-3.5" /> Abrir</a><button onClick={onNextTrack} className={`px-3 py-2 rounded-xl text-xs font-bold border ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-zinc-900 border-zinc-800 text-zinc-200'}`}>Siguiente →</button></div>
                </div>
              ) : (
                <div className={`p-5 rounded-2xl border border-dashed text-center space-y-2 ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-zinc-950 border-zinc-800'}`}>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Aún no tiene MP3 ni link.</p>
                  <button onClick={() => onEditSong(currentSong)} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Subir MP3 o Link</button>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold uppercase ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Letra</span>
                  <div className={`border rounded-xl p-0.5 flex text-[11px] ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
                    <button onClick={() => setLyricsMode('voces')} className={`px-2 py-0.5 rounded-lg font-bold ${lyricsMode === 'voces' ? 'bg-amber-500 text-zinc-950' : isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Solo Letra</button>
                    <button onClick={() => setLyricsMode('musicos')} className={`px-2 py-0.5 rounded-lg font-bold ${lyricsMode === 'musicos' ? 'bg-amber-500 text-zinc-950' : isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Con Acordes</button>
                  </div>
                </div>
                <div className={`border rounded-xl p-4 max-h-64 overflow-y-auto space-y-1 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
                  {(currentSong.rawText || '').split('\n').map((line, i) => {
                    const isChord = isChordLine(line);
                    const isHeader = line.trim().startsWith('[') && line.trim().endsWith(']');
                    if (lyricsMode === 'voces' && isChord) return null;
                    if (isHeader) return (<div key={i} className={`text-[11px] font-extrabold uppercase pt-2 ${isLight ? 'text-slate-500' : 'text-amber-400'}`}>{line}</div>);
                    if (isChord) return (<div key={i} className={`font-mono text-xs font-bold whitespace-pre-wrap ${isLight ? 'text-red-600' : 'text-amber-400'}`}>{line}</div>);
                    return (<div key={i} className={`font-mono text-sm font-medium whitespace-pre-wrap ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>{line}</div>);
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-14 space-y-3"><p className="text-sm text-zinc-500">Tu lista está vacía.</p><button onClick={() => setShowAddSongs(true)} className="bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs">+ Seleccionar Alabanzas</button></div>
          )}
        </div>

        <div className={`lg:col-span-5 border rounded-2xl p-4 space-y-3 h-fit ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
            <h3 className={`font-extrabold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Cola ({playlistSongs.length})</h3>
            {playlistSongs.length > 0 && (<button onClick={() => setPlaylistIds([])} className="text-[11px] text-red-500 hover:underline font-semibold">Limpiar</button>)}
          </div>
          <div className="space-y-1.5 max-h-[55dvh] overflow-y-auto pr-1">
            {playlistSongs.length === 0 ? (<p className="text-xs text-zinc-500 text-center py-8">Sube MP3s o elige lista.</p>) : (
              playlistSongs.map((song, idx) => {
                const isCurrent = idx === currentTrackIndex;
                return (
                  <div key={`${song.id}-${idx}`} onClick={() => { setCurrentTrackIndex(idx); setIsPlayingAudio(true); }} className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-2 ${isCurrent ? 'bg-amber-500 text-zinc-950 border-amber-500 font-bold shadow' : isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-200'}`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xs font-mono opacity-75 w-4">{idx + 1}.</span>
                      <div className="min-w-0"><div className="text-xs sm:text-sm font-bold truncate">{song.title}</div><div className="text-[10px] opacity-80 flex items-center gap-1.5"><span>Tono: {song.key}</span>{song.hasAudioFile && <span>• 🎵 MP3</span>}{!song.hasAudioFile && song.link && <span>• ▶ Link</span>}</div></div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setPlaylistIds(playlistIds.filter((_, i) => i !== idx)); }} className={`p-1 rounded-lg ${isCurrent ? 'hover:bg-zinc-950/20 text-zinc-950' : 'text-zinc-400 hover:text-red-500'}`}><X className="w-4 h-4" /></button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. STAGE TELEPROMPTER
// ==========================================
function StageTeleprompterTab({ setlist, songs, initialIndex, onEditSong, onRemixSong, onClose, theme, onToggleTheme }) {
  const isLight = theme === 'light';
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [fontSize, setFontSize] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 640 ? 20 : 28));
  const [viewMode, setViewMode] = useState('voces');
  const [semitones, setSemitones] = useState(0);
  const [hideControls, setHideControls] = useState(false);
  const [isRemixDrawerOpen, setIsRemixDrawerOpen] = useState(false);
  const [remixSearch, setRemixSearch] = useState('');
  const scrollRef = useRef(null);
  const speedRef = useRef(speedMultiplier);
  const isPlayingRef = useRef(isPlaying);
  const scrollAccumulatorRef = useRef(0);

  useEffect(() => { speedRef.current = speedMultiplier; }, [speedMultiplier]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const allSetlistItems = [...(setlist?.alabanza?.map(i => ({ ...i, section: 'Alabanza' })) || []), ...(setlist?.adoracion?.map(i => ({ ...i, section: 'Adoración' })) || [])];
  const currentItem = allSetlistItems[currentIndex];
  const currentSong = songs.find(s => s.id === currentItem?.songId);
  const currentVersion = getSongVersion(currentSong, currentItem?.versionId);

  useEffect(() => { setSemitones(0); scrollAccumulatorRef.current = 0; if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [currentIndex]);

  useEffect(() => {
    let animId; let lastTime = performance.now();
    const scrollLoop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1); lastTime = now;
      if (isPlayingRef.current && scrollRef.current) {
        const deltaPixels = 38 * speedRef.current * dt;
        scrollAccumulatorRef.current += deltaPixels;
        if (scrollAccumulatorRef.current >= 1) {
          const wholePixels = Math.floor(scrollAccumulatorRef.current);
          scrollRef.current.scrollTop += wholePixels;
          scrollAccumulatorRef.current -= wholePixels;
        }
      }
      animId = requestAnimationFrame(scrollLoop);
    };
    animId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!currentSong) return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center h-[100dvh] w-screen ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-[#09090b] text-white'}`}>
      <p className={`mb-4 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>No hay canciones en el setlist.</p>
      <button onClick={onClose} className="bg-amber-500 text-zinc-950 font-bold px-5 py-2.5 rounded-xl">Volver</button>
    </div>
  );

  const lines = currentVersion?.rawText ? currentVersion.rawText.split('\n') : [];
  const adjustSpeed = (delta) => setSpeedMultiplier(prev => Math.min(5.0, Math.max(0.2, Math.round((prev + delta) * 10) / 10)));

  return (
    <div className={`fixed inset-0 z-50 flex flex-col h-[100dvh] w-screen overflow-hidden select-none transition-colors ${isLight ? 'bg-white text-slate-900' : 'bg-[#09090b] text-white'}`}>
      <div className={`border-b px-2.5 sm:px-4 py-2 flex items-center justify-between gap-2 shrink-0 ${isLight ? 'bg-slate-50/95 border-slate-200' : 'bg-zinc-950/95 border-zinc-800'}`}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button onClick={onClose} className={`p-2 rounded-xl border shrink-0 ${isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800'}`}><X className="w-5 h-5" /></button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs bg-amber-500 text-zinc-950 font-extrabold px-1.5 py-0.5 rounded shrink-0">#{currentIndex + 1}</span>
              <h2 className={`text-sm sm:text-lg font-extrabold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentSong.title}</h2>
            <span className={`text-[11px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${isLight ? 'bg-red-50 text-red-600 border-red-200' : 'bg-zinc-900 text-amber-400 border-zinc-700'}`}>{currentVersion?.title || 'Original'} · {transposeToken(currentItem.tone || currentVersion?.key || currentSong.key || 'C', semitones)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className={`border rounded-xl p-0.5 flex text-[11px] sm:text-xs ${isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-zinc-900 border-zinc-800'}`}>
            <button onClick={() => setViewMode('voces')} className={`px-2 sm:px-3 py-1.5 rounded-lg font-bold transition ${viewMode === 'voces' ? 'bg-amber-500 text-zinc-950' : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}`}>Solo Letra</button>
            <button onClick={() => setViewMode('musicos')} className={`px-2 sm:px-3 py-1.5 rounded-lg font-bold transition ${viewMode === 'musicos' ? 'bg-amber-500 text-zinc-950' : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}`}>Con Acordes</button>
          </div>
          <button onClick={() => setIsRemixDrawerOpen(true)} className="bg-amber-500/20 hover:bg-amber-500 text-amber-600 dark:text-amber-300 hover:text-zinc-950 border border-amber-500/40 font-extrabold px-2.5 sm:px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow transition"><Zap className="w-4 h-4 fill-amber-500" /><span className="hidden xs:inline sm:inline">Remix</span></button>
          {onToggleTheme && (<button onClick={onToggleTheme} className={`p-2 rounded-xl border ${isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border-zinc-800'}`}>{isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}</button>)}
          {onEditSong && (<button onClick={() => onEditSong(currentSong)} className={`p-2 rounded-xl border ${isLight ? 'bg-white hover:bg-slate-100 text-amber-600 border-slate-300' : 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border-zinc-800'}`}><Edit3 className="w-4 h-4" /></button>)}
          <button onClick={() => setHideControls(!hideControls)} className={`p-2 rounded-xl border ${isLight ? 'bg-white hover:bg-slate-100 text-slate-600 border-slate-300' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800'}`}>{hideControls ? <Maximize2 className="w-4 h-4 text-amber-500" /> : <Minimize2 className="w-4 h-4" />}</button>
        </div>
      </div>

      {!hideControls && (
        <div className={`border-b px-3 py-1.5 flex items-center justify-between gap-2 text-xs shrink-0 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900/90 border-zinc-800/80'}`}>
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Texto:</span>
            <button onClick={() => setFontSize(s => Math.max(14, s - 2))} className={`px-2.5 py-1 border rounded-lg font-bold ${isLight ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-200'}`}>A-</button>
            <span className={`w-7 text-center font-mono font-bold ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>{fontSize}</span>
            <button onClick={() => setFontSize(s => Math.min(48, s + 2))} className={`px-2.5 py-1 border rounded-lg font-bold ${isLight ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-200'}`}>A+</button>
          </div>
          {viewMode === 'musicos' ? (
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Tono:</span>
              <button onClick={() => setSemitones(s => s - 1)} className={`w-7 h-7 border rounded-lg font-extrabold ${isLight ? 'bg-white hover:bg-slate-50 border-slate-300 text-red-600' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-amber-400'}`}>-1</button>
              <span className={`w-7 text-center font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{semitones > 0 ? `+${semitones}` : semitones}</span>
              <button onClick={() => setSemitones(s => s + 1)} className={`w-7 h-7 border rounded-lg font-extrabold ${isLight ? 'bg-white hover:bg-slate-50 border-slate-300 text-red-600' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-amber-400'}`}>+1</button>
            </div>
          ) : (<span className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>{currentItem.section}</span>)}
        </div>
      )}

      <div ref={scrollRef} className={`flex-1 overflow-y-auto overflow-x-hidden px-3 sm:px-10 md:px-20 py-4 transition-colors ${isLight ? 'bg-white' : 'bg-[#09090b]'}`}>
        {(currentItem.notes || currentSong.voiceNotes) && (
          <div className={`max-w-4xl mx-auto mb-5 border px-3 py-2.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${isLight ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-amber-500/15 border-amber-500/40 text-amber-200'}`}>
            <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
            <div className="min-w-0">
              {currentItem.notes && <p className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentItem.notes}</p>}
              {currentSong.voiceNotes && <p className={`text-xs mt-0.5 ${isLight ? 'text-amber-800' : 'text-amber-300/90'}`}>{currentSong.voiceNotes}</p>}
            </div>
          </div>
        )}
        <div className="max-w-4xl mx-auto space-y-1.5 break-words" style={{ fontSize: `${fontSize}px` }}>
          {lines.map((line, idx) => {
            const isChord = isChordLine(line);
            const isHeader = line.trim().startsWith('[') && line.trim().endsWith(']');
            if (viewMode === 'voces' && isChord) return null;
            if (isHeader) return (<div key={idx} className={`font-extrabold mt-6 mb-1.5 text-xs sm:text-sm tracking-widest uppercase border-b pb-0.5 ${isLight ? 'text-slate-500 border-slate-200' : 'text-amber-400 border-amber-500/20'}`}>{line}</div>);
            if (isChord && viewMode === 'musicos') {
              const transposed = transposeLine(line, semitones);
              return (<div key={idx} style={{ fontSize: `${Math.max(13, Math.round(fontSize * 0.85))}px` }} className={`font-mono font-extrabold leading-tight whitespace-pre-wrap break-words tracking-tight pt-1 ${isLight ? 'text-red-600' : 'text-amber-400'}`}>{transposed}</div>);
            }
            return (<div key={idx} className={`font-mono font-semibold leading-snug whitespace-pre-wrap break-words ${isLight ? 'text-slate-900' : 'text-white'}`}>{line}</div>);
          })}
        </div>
        <div className="h-[65dvh]"></div>
      </div>

      <div className={`border-t px-2.5 sm:px-4 py-2 shrink-0 space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <button onClick={() => setIsPlaying(!isPlaying)} className={`px-3.5 py-2 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition shrink-0 ${isPlaying ? 'bg-amber-500 text-zinc-950' : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'}`}>
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pausar' : 'Play'}</span>
          </button>
          <div className={`flex-1 flex items-center gap-1.5 border rounded-xl px-2 py-1.5 ${isLight ? 'bg-white border-slate-300' : 'bg-zinc-900 border-zinc-800'}`}>
            <button onClick={() => adjustSpeed(-0.2)} className={`w-7 h-7 active:scale-95 rounded-lg font-extrabold text-sm flex items-center justify-center shrink-0 ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-amber-700' : 'bg-zinc-800 hover:bg-zinc-700 text-amber-400'}`}>-</button>
            <input type="range" min="0.2" max="5.0" step="0.1" value={speedMultiplier} onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))} className="flex-1 min-w-0 accent-amber-500 cursor-pointer h-2 bg-zinc-700 rounded-lg" />
            <button onClick={() => adjustSpeed(0.2)} className={`w-7 h-7 active:scale-95 rounded-lg font-extrabold text-sm flex items-center justify-center shrink-0 ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-amber-700' : 'bg-zinc-800 hover:bg-zinc-700 text-amber-400'}`}>+</button>
            <span className={`w-11 text-right font-mono font-extrabold text-xs shrink-0 ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>{speedMultiplier.toFixed(1)}x</span>
          </div>
        </div>
        {!hideControls && (
          <div className="flex items-center justify-between max-w-4xl mx-auto pt-0.5">
            <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0} className={`disabled:opacity-35 font-bold px-3 py-1.5 rounded-xl text-xs border ${isLight ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800'}`}>← Anterior</button>
            <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Canción <strong className={isLight ? 'text-slate-900' : 'text-white'}>{currentIndex + 1}</strong> de {allSetlistItems.length}</span>
            <button onClick={() => setCurrentIndex(i => Math.min(allSetlistItems.length - 1, i + 1))} disabled={currentIndex === allSetlistItems.length - 1} className={`disabled:opacity-35 font-bold px-3 py-1.5 rounded-xl text-xs border ${isLight ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800'}`}>Siguiente →</button>
          </div>
        )}
      </div>

      {isRemixDrawerOpen && (
        <div className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md z-50 flex justify-end">
          <div className={`w-full max-w-md border-l h-[100dvh] p-4 sm:p-6 flex flex-col shadow-2xl ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-white'}`}>
            <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
              <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500 fill-amber-500" /><h3 className="font-extrabold text-base sm:text-lg">Salto Rápido / Remix</h3></div>
              <button onClick={() => setIsRemixDrawerOpen(false)} className={`p-1.5 rounded-xl ${isLight ? 'bg-slate-100 text-slate-700 hover:text-slate-900' : 'bg-zinc-800 text-zinc-300 hover:text-white'}`}><X className="w-5 h-5" /></button>
            </div>
            <p className={`text-xs mt-2 mb-3 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Toca para saltar al instante.</p>
            <div className="mb-4">
              <h4 className={`text-[11px] uppercase font-extrabold mb-2 ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>Setlist Hoy</h4>
              <div className="space-y-1.5 max-h-[35dvh] overflow-y-auto">
                {allSetlistItems.map((item, idx) => {
                  const s = songs.find(x => x.id === item.songId); if (!s) return null;
                  const isActive = idx === currentIndex;
                  return (
                    <div key={idx} onClick={() => { setCurrentIndex(idx); setIsRemixDrawerOpen(false); }} className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between ${isActive ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' : isLight ? 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800' : 'bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-200'}`}>
                      <div className="flex items-center gap-2 min-w-0"><span className="text-xs opacity-75">#{idx + 1}</span><span className="text-sm font-semibold truncate">{s.title}</span></div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0 ${isActive ? 'bg-zinc-950/20 text-zinc-950' : isLight ? 'bg-red-50 text-red-600' : 'bg-zinc-900/80 text-amber-400'}`}>{item.tone || s.key}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`flex-1 flex flex-col border-t pt-3 min-h-0 ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
              <h4 className={`text-[11px] uppercase font-extrabold mb-2 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Biblioteca completa</h4>
              <input type="text" placeholder="Buscar..." value={remixSearch} onChange={(e) => setRemixSearch(e.target.value)} className={`w-full border rounded-xl px-3 py-2 text-xs mb-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'}`} />
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {songs.filter(s => s.title.toLowerCase().includes(remixSearch.toLowerCase())).map(song => (
                    <div key={song.id} onClick={() => { const existingIdx = allSetlistItems.findIndex(i => i.songId === song.id); if (existingIdx !== -1) setCurrentIndex(existingIdx); else { onRemixSong?.(song); setCurrentIndex(allSetlistItems.length); } setIsRemixDrawerOpen(false); }} className={`p-2.5 border rounded-xl cursor-pointer transition text-xs flex items-center justify-between ${isLight ? 'bg-slate-50 hover:bg-amber-50 border-slate-200 hover:border-amber-400' : 'bg-zinc-950 hover:bg-amber-500/10 border-zinc-800 hover:border-amber-500/30'}`}>
                    <span className={`font-semibold truncate ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>{song.title}</span>
                    <span className={`font-mono font-bold shrink-0 ${isLight ? 'text-red-600' : 'text-amber-400'}`}>{song.key}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. CALENDAR TAB
// ==========================================
function CalendarTab({ events, setEvents, setlists, onSelectSetlist, theme }) {
  const isLight = theme === 'light';
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEventDirector, setNewEventDirector] = useState('');
  const [selectedSetlistId, setSelectedSetlistId] = useState('');

  const handleCreateEvent = (e) => {
    e.preventDefault(); if (!newEventTitle) return;
    setEvents([...events, { id: 'ev-' + Date.now(), title: newEventTitle, date: newEventDate, director: newEventDirector || 'Por asignar', setlistId: selectedSetlistId || null, type: 'servicio' }]);
    setNewEventTitle('');
  };
  const handleDeleteEvent = (id) => setEvents(events.filter(e => e.id !== id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className={`lg:col-span-7 border rounded-2xl p-6 space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
        <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div><h2 className={`font-bold text-lg flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}><Calendar className="w-5 h-5 text-amber-500" /> Agenda de Servicios</h2><p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Fechas y directores asignados</p></div>
        </div>
        <div className="space-y-3">
          {events.length === 0 ? (<p className="text-xs text-slate-500 text-center py-8">No hay eventos.</p>) : (
            events.map(ev => {
              const linkedSetlist = setlists.find(s => s.id === ev.setlistId);
              return (
                <div key={ev.id} className={`border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 transition ${isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{ev.date}</span>
                      <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{ev.title}</h3>
                    </div>
                    <p className={`text-xs flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}><User className="w-3.5 h-3.5" /> Director: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{ev.director}</strong></p>
                  </div>
                  <div className="flex items-center gap-2">
                    {linkedSetlist && (<button onClick={() => onSelectSetlist(linkedSetlist.id)} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition shadow"><ListMusic className="w-3.5 h-3.5" /> Ver Setlist</button>)}
                    <button onClick={() => handleDeleteEvent(ev.id)} className="text-red-500/70 hover:text-red-500 p-1.5"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className={`lg:col-span-5 border rounded-2xl p-6 h-fit space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
        <h3 className={`font-bold text-base border-b pb-2 ${isLight ? 'text-slate-900 border-slate-200' : 'text-white border-slate-800'}`}>Programar Nuevo Evento</h3>
        <form onSubmit={handleCreateEvent} className="space-y-3">
          <div><label className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Título</label><input type="text" required placeholder="Ej: Servicio Dominical Noche" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`} /></div>
          <div><label className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Fecha</label><input type="date" required value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`} /></div>
          <div><label className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Director</label><input type="text" placeholder="Nombre del director" value={newEventDirector} onChange={(e) => setNewEventDirector(e.target.value)} className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`} /></div>
          <div><label className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Setlist (Opcional)</label><select value={selectedSetlistId} onChange={(e) => setSelectedSetlistId(e.target.value)} className={`w-full border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-slate-50 border-slate-300 text-amber-700' : 'bg-slate-950 border-slate-800 text-amber-400'}`}><option value="">-- Sin Vincular --</option>{setlists.map(s => (<option key={s.id} value={s.id}>{s.date} - {s.title}</option>))}</select></div>
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20"><Plus className="w-4 h-4" /> Guardar</button>
        </form>
      </div>
    </div>
  );
}

function TutorTab({ theme }) {
  const isLight = theme === 'light';
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [jsonText, setJsonText] = useState('');
  const [knowledge, setKnowledge] = useState(() => readLocalStorage('kancionero_tutor', INITIAL_TUTOR));
  const [status, setStatus] = useState('');

  const ask = () => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return;
    let best = null;
    let bestScore = 0;
    knowledge.forEach(item => {
      const score = words.filter(word => `${item.pregunta} ${item.respuesta}`.toLowerCase().includes(word)).length;
      if (score > bestScore) { best = item; bestScore = score; }
    });
    setResult(bestScore > 0 ? best : null);
  };

  const importKnowledge = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const items = Array.isArray(parsed) ? parsed : parsed.preguntas;
      if (!Array.isArray(items)) throw new Error('Usa un arreglo o un objeto con la propiedad preguntas.');
      const clean = items.filter(item => item && item.pregunta != null && item.respuesta != null).map(item => ({ pregunta: String(item.pregunta), respuesta: String(item.respuesta) }));
      if (!clean.length) throw new Error('No hay preguntas válidas.');
      setKnowledge(clean);
      writeLocalStorage('kancionero_tutor', clean);
      setStatus(`Importadas ${clean.length} preguntas.`);
      setJsonText('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'JSON inválido.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className={`border rounded-2xl p-5 space-y-4 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900 border-zinc-800'}`}>
        <div><h2 className="font-extrabold text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500" /> Tutor Musical</h2><p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Consulta la base local de aprendizaje del cancionero.</p></div>
        <div className="flex gap-2"><input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') ask(); }} placeholder="Ej. ¿Cómo se forma un acorde menor?" className={`flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'}`} /><button onClick={ask} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 rounded-xl text-sm">Consultar</button></div>
        <div className={`rounded-xl border p-4 min-h-24 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
          {result ? (<><p className="text-xs font-bold text-amber-500">{result.pregunta}</p><p className="text-sm mt-2 whitespace-pre-wrap">{result.respuesta}</p></>) : <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>{query ? 'No encontré una respuesta local.' : 'Aquí aparecerán las respuestas.'}</p>}
        </div>
      </div>
      <details className={`border rounded-2xl p-4 ${isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-zinc-800'}`}>
        <summary className="cursor-pointer text-sm font-bold">Importar base de conocimientos JSON</summary>
        <textarea value={jsonText} onChange={e => setJsonText(e.target.value)} placeholder='[{"pregunta":"...","respuesta":"..."}]' className={`mt-3 w-full min-h-32 border rounded-xl p-3 font-mono text-xs ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'}`} />
        <div className="flex items-center gap-3 mt-2"><button onClick={importKnowledge} className="bg-amber-500 text-zinc-950 font-bold px-3 py-2 rounded-xl text-xs">Importar</button><span className="text-xs text-emerald-500">{status}</span></div>
      </details>
    </div>
  );
}

// ==========================================
// 5. SONG EDITOR MODAL
// ==========================================
function SongEditorModal({ song, onSave, onClose, theme }) {
  const isLight = theme === 'light';
  const normalizedSong = song ? normalizeSongRecord(song) : normalizeSongRecord({ id: 'new', title: '', key: 'C', rawText: '', voiceNotes: '' });
  const initialVersion = getSongVersion(normalizedSong, normalizedSong?.activeVersionId);
  const [title, setTitle] = useState(song?.title || '');
  const [artist, setArtist] = useState(song?.artist || '');
  const [key, setKey] = useState(initialVersion?.key || 'C');
  const [link, setLink] = useState(song?.link || '');
  const [rawText, setRawText] = useState(initialVersion?.rawText || '');
  const [voiceNotes, setVoiceNotes] = useState(initialVersion?.voiceNotes || '');
  const [versions, setVersions] = useState(normalizedSong?.versions || []);
  const [selectedVersionId, setSelectedVersionId] = useState(initialVersion?.id || 'version-original');
  const [versionTitle, setVersionTitle] = useState(initialVersion?.title || 'Original');
  const [errorMsg, setErrorMsg] = useState('');
  const [editorTab, setEditorTab] = useState('edit');
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState(song?.audioFileName || '');
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [removeExistingAudio, setRemoveExistingAudio] = useState(false);
  const previewUrlRef = useRef(null);
  const audioPickerRef = useRef(null);

  const commitCurrentVersion = (nextVersions = versions) => nextVersions.map(version => version.id === selectedVersionId ? { ...version, title: versionTitle.trim() || 'Original', key: key.trim().toUpperCase() || 'C', rawText, voiceNotes } : version);
  const selectVersion = (versionId) => {
    const committed = commitCurrentVersion();
    const next = committed.find(version => version.id === versionId) || committed[0];
    if (!next) return;
    setVersions(committed);
    setSelectedVersionId(next.id);
    setVersionTitle(next.title);
    setKey(next.key);
    setRawText(next.rawText);
    setVoiceNotes(next.voiceNotes);
  };
  const addVersion = () => {
    const committed = commitCurrentVersion();
    const next = { id: createVersionId(), title: `Versión ${committed.length + 1}`, key: key.trim().toUpperCase() || 'C', rawText, voiceNotes };
    setVersions([...committed, next]);
    setSelectedVersionId(next.id);
    setVersionTitle(next.title);
  };

  useEffect(() => {
    let objUrl = null;
    if (song?.id && song?.hasAudioFile) {
      getSongAudioFile(song.id).then(existing => { if (existing) { objUrl = URL.createObjectURL(existing); previewUrlRef.current = objUrl; setAudioPreviewUrl(objUrl); setAudioFileName(existing.name || song.audioFileName || 'Audio guardado'); } }).catch(() => {});
    }
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    };
  }, [song?.id, song?.hasAudioFile]);

  const handleAudioFilePick = (e) => {
    const picked = e.target.files?.[0]; if (!picked) return;
    const validationError = validateAudioFile(picked);
    if (validationError) { setErrorMsg(validationError); e.target.value = ''; return; }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(picked);
    previewUrlRef.current = url;
    setAudioFile(picked); setAudioFileName(picked.name); setAudioPreviewUrl(url); setRemoveExistingAudio(false); e.target.value = '';
  };
  const openAudioPicker = () => audioPickerRef.current?.click();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setErrorMsg('Por favor escribe el título.'); return; }
    if (!rawText.trim() && !audioFile && !song?.hasAudioFile) { setErrorMsg('Por favor escribe la letra o sube un MP3.'); return; }
    setErrorMsg('');
    const songId = song?.id || 'song-' + Date.now();
    let hasAudioFile = Boolean(song?.hasAudioFile && !removeExistingAudio);
    if (audioFile) {
      try { await saveSongAudioFile(songId, audioFile); hasAudioFile = true; }
      catch (error) { setErrorMsg(error.message || 'No se pudo guardar el audio.'); return; }
    }
    else if (removeExistingAudio && song?.id) { await deleteSongAudioFile(song.id).catch(() => {}); hasAudioFile = false; }
    const finalRawText = rawText.trim() ? rawText : `[LETRA PENDIENTE]\nPista de audio: ${audioFileName || 'MP3 cargado'}`;
    const committedVersions = commitCurrentVersion().map(version => version.id === selectedVersionId ? { ...version, rawText: finalRawText } : version);
    onSave({ id: songId, title: title.trim(), artist: artist.trim(), key: key.trim().toUpperCase() || 'C', link: link.trim(), hasAudioFile, audioFileName: hasAudioFile ? audioFileName : '', rawText: finalRawText, voiceNotes: voiceNotes.trim(), activeVersionId: selectedVersionId, versions: committedVersions, tags: song?.tags || ['General'] });
  };

  return (
    <div className={`fixed inset-0 sm:backdrop-blur-sm z-[60] flex items-center justify-center sm:p-4 h-[100dvh] w-screen overflow-hidden ${isLight ? 'bg-slate-100 sm:bg-slate-900/60' : 'bg-[#09090b] sm:bg-zinc-950/85'}`}>
      <form onSubmit={handleSave} className={`sm:border sm:rounded-2xl w-full h-[100dvh] sm:h-[92dvh] sm:max-w-4xl flex flex-col shadow-2xl overflow-hidden ${isLight ? 'bg-white sm:border-slate-200' : 'bg-zinc-900 sm:border-zinc-800'}`}>
        <div className={`px-3 sm:px-5 py-2.5 border-b flex items-center justify-between gap-2 shrink-0 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
          <div className="flex items-center gap-2 min-w-0">
            <button type="button" onClick={onClose} className={`p-2 rounded-xl border shrink-0 ${isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'}`}><X className="w-5 h-5" /></button>
            <div className="min-w-0"><h3 className={`font-extrabold text-sm sm:text-base truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{song ? 'Editar Alabanza' : 'Nueva / Importar Alabanza'}</h3><p className={`text-[11px] hidden sm:block ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Edita en pantalla completa</p></div>
          </div>
          <button type="submit" className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-extrabold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition"><Check className="w-4 h-4 stroke-[2.5]" /><span>Guardar</span></button>
        </div>

        <div className={`px-3 sm:px-5 py-2.5 border-b shrink-0 space-y-2 ${isLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-zinc-800'}`}>
          {errorMsg && (<div className="bg-red-500/15 border border-red-500/40 text-red-600 dark:text-red-300 text-xs px-3 py-1.5 rounded-xl">{errorMsg}</div>)}
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0"><input type="text" required placeholder="Título *" value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500'}`} /></div>
            <div className="w-16 shrink-0"><input type="text" placeholder="Tono" value={key} onChange={(e) => setKey(e.target.value)} className={`w-full border rounded-xl px-1.5 py-2 text-sm font-mono font-extrabold text-center uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-red-50 border-red-200 text-red-600' : 'bg-zinc-950 border-zinc-800 text-amber-400'}`} /></div>
            {/* ✅ FIX MÓVIL: input DENTRO del label + accept */}
            <button type="button" onClick={openAudioPicker} className={`px-2.5 py-2 rounded-xl border text-xs font-extrabold cursor-pointer flex items-center gap-1 shrink-0 transition select-none min-h-11 ${audioPreviewUrl && !removeExistingAudio ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400' : isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-amber-400'}`}>
              <Upload className="w-3.5 h-3.5 shrink-0" /><span>{audioPreviewUrl && !removeExistingAudio ? 'MP3 ✓' : 'Subir MP3'}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className={`text-[11px] font-bold shrink-0 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Versión</label>
            <select value={selectedVersionId} onChange={(e) => selectVersion(e.target.value)} className={`flex-1 border rounded-xl px-2 py-1.5 text-xs font-bold ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'}`}>{versions.map(version => <option key={version.id} value={version.id}>{version.title}</option>)}</select>
            <input value={versionTitle} onChange={e => setVersionTitle(e.target.value)} placeholder="Nombre" className={`w-28 border rounded-xl px-2 py-1.5 text-xs ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'}`} />
            <button type="button" onClick={addVersion} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-2.5 py-1.5 rounded-xl text-xs shrink-0">+ Versión</button>
          </div>
          <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl border text-xs ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
            <button type="button" onClick={() => setEditorTab('edit')} className={`py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${editorTab === 'edit' ? 'bg-amber-500 text-zinc-950' : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}`}><Edit3 className="w-3.5 h-3.5" /> Letra / Acordes</button>
            <button type="button" onClick={() => setEditorTab('preview')} className={`py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${editorTab === 'preview' ? 'bg-amber-500 text-zinc-950' : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}`}><Eye className="w-3.5 h-3.5" /> Vista Previa</button>
            <button type="button" onClick={() => setEditorTab('details')} className={`py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${editorTab === 'details' ? 'bg-amber-500 text-zinc-950' : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}`}><Sliders className="w-3.5 h-3.5" /> Audio y Notas</button>
          </div>
        </div>

        <div className={`flex-1 flex flex-col min-h-0 p-3 sm:p-5 overflow-y-auto ${isLight ? 'bg-slate-50' : 'bg-zinc-950'}`}>
          {editorTab === 'edit' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-1.5 shrink-0"><span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Pega desde Google Docs o edita abajo:</span><span className={`text-[11px] font-semibold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>✨ Auto-detección</span></div>
              <textarea placeholder={`[VERSO 1]\nG                        C\nTe amo Dios, Tu misericordia nunca falla...`} value={rawText} onChange={(e) => setRawText(e.target.value)} className={`flex-1 w-full min-h-[45dvh] border rounded-xl p-3 sm:p-4 font-mono text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed resize-none ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900/90 border-zinc-800 text-zinc-100'}`} />
            </div>
          )}
          {editorTab === 'preview' && (
            <div className={`flex-1 overflow-y-auto border rounded-xl p-4 space-y-1 ${isLight ? 'bg-white border-slate-200' : 'bg-zinc-900/70 border-zinc-800'}`}>
              <p className={`text-[11px] font-bold mb-3 pb-2 border-b ${isLight ? 'text-slate-600 border-slate-200' : 'text-amber-400 border-zinc-800'}`}>{isLight ? 'Así se verá:' : 'Así se verá:'}</p>
              {(rawText || '').split('\n').map((line, idx) => {
                const isChord = isChordLine(line);
                const isHeader = line.trim().startsWith('[') && line.trim().endsWith(']');
                if (isHeader) return (<div key={idx} className={`text-xs font-extrabold uppercase pt-3 pb-0.5 ${isLight ? 'text-slate-500' : 'text-amber-400'}`}>{line}</div>);
                if (isChord) return (<div key={idx} className={`font-mono text-xs sm:text-sm font-bold whitespace-pre-wrap ${isLight ? 'text-red-600' : 'text-amber-400'}`}>{line}</div>);
                return (<div key={idx} className={`font-mono text-sm sm:text-base font-medium whitespace-pre-wrap ${isLight ? 'text-slate-900' : 'text-white'}`}>{line}</div>);
              })}
            </div>
          )}
          {editorTab === 'details' && (
            <div className="space-y-4 max-w-2xl w-full mx-auto py-2">
              <div><label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Autor / Versión</label><input type="text" placeholder="Ej. Miel San Marcos, Hillsong..." value={artist} onChange={(e) => setArtist(e.target.value)} className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-white'}`} /></div>
              <div>
                <label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Enlace de YouTube / Audio</label>
                <input type="url" placeholder="https://www.youtube.com/watch?v=..." value={link} onChange={(e) => setLink(e.target.value)} className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-white'}`} />
                {link && (<div className="mt-1.5 flex items-center justify-between text-[11px]"><span className="text-emerald-500 font-semibold">{extractYouTubeId(link) ? '✓ YouTube detectado' : '✓ Enlace detectado'}</span><a href={link} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline flex items-center gap-1 font-bold">Probar <ExternalLink className="w-3 h-3" /></a></div>)}
              </div>

              {/* ✅ FIX MÓVIL + AYUDA VISIBLE */}
              <div className={`p-3.5 rounded-xl border space-y-2.5 ${isLight ? 'bg-white border-slate-300' : 'bg-zinc-900 border-zinc-800'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <label className={`text-xs font-bold block ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>Archivo de Audio Local (MP3 / WAV / M4A)</label>
                    <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Selecciona un archivo de Descargas, Documentos o Música</p>
                  </div>
                  <button type="button" onClick={openAudioPicker} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-3 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shrink-0 shadow select-none min-h-11">
                    <Upload className="w-3.5 h-3.5 shrink-0" /><span>{audioPreviewUrl ? 'Cambiar MP3' : 'Elegir Archivo'}</span>
                  </button>
                </div>

                <input ref={audioPickerRef} id="mobile-details-mp3-input" type="file" accept="" onChange={handleAudioFilePick} className={`w-full min-h-11 text-xs rounded-xl border p-2 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-zinc-950 cursor-pointer ${isLight ? 'bg-slate-50 border-slate-300 text-slate-700' : 'bg-zinc-950 border-zinc-800 text-zinc-300'}`} />
                <a href="/legacy-upload.html" className={`block min-h-11 rounded-xl border px-3 py-2 text-[11px] font-bold flex items-center ${isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-zinc-950 border-zinc-700 text-zinc-300'}`}>Abrir selector sencillo para teléfono antiguo</a>

                {/* ✅ AYUDA MÓVIL */}
                <p className={`text-[10px] leading-tight ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                  📱 <strong>Android:</strong> abre tu carpeta Música/Descargas.<br />
                  🍎 <strong>iPhone:</strong> toca "Elegir Archivo" → "En mi iPhone" → Descargas/Música.
                </p>

                {audioPreviewUrl && !removeExistingAudio && (
                  <div className={`p-2.5 rounded-xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950 border-zinc-800'}`}>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-emerald-500 truncate flex items-center gap-1.5"><FileAudio className="w-4 h-4 shrink-0" /><span className="truncate">{audioFileName}</span></span>
                      <button type="button" onClick={() => { if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current); previewUrlRef.current = null; setAudioFile(null); setAudioPreviewUrl(null); setAudioFileName(''); setRemoveExistingAudio(true); }} className="text-red-500 hover:underline text-[11px] font-bold shrink-0">Quitar</button>
                    </div>
                    <audio controls src={audioPreviewUrl} className="w-full h-9" />
                  </div>
                )}
              </div>

              <div><label className={`text-xs font-semibold block mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>Notas para las Voces</label><textarea rows={4} placeholder="Ej: Entran chicas en el verso 2..." value={voiceNotes} onChange={(e) => setVoiceNotes(e.target.value)} className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${isLight ? 'bg-white border-slate-300 text-amber-900' : 'bg-zinc-900 border-zinc-800 text-amber-200'}`} /></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
