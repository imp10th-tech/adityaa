import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadFile, isVideoFile, isImageFile, formatBytes } from '@/lib/upload';
import { useAuth } from '@/context/AuthContext';
import { AdminDynamicIcon } from '@/components/AdminDynamicIcon';
import {
  LogOut, Plus, Trash2, Save, Upload, Image as ImageIcon, Music,
  Settings, MessageSquare, Users, MapPin, Mic, Swords, Home, Loader2,
  BarChart3, IdCard, Video, FileUp, Instagram, X, Calendar, Rocket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ---- Types ----
interface TextRow { id: string; [key: string]: any }
interface SettingItem { key: string; value: string; category: string }

const TABS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'launch', label: 'Launch Control', icon: Rocket },
  { id: 'hero', label: 'Hero Section', icon: Home },
  { id: 'legend', label: 'The Legend', icon: Swords },
  { id: 'anthem', label: 'Anthem', icon: Music },
  { id: 'stats', label: 'Char Stats', icon: BarChart3 },
  { id: 'dialogues', label: 'Dialogues', icon: MessageSquare },
  { id: 'lyrics', label: 'Song Lyrics', icon: Mic },
  { id: 'origin', label: 'Origin Story', icon: MapPin },
  { id: 'darbar', label: 'Darbar', icon: Users },
  { id: 'sidekick', label: 'Gang Members', icon: IdCard },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'hyderabad', label: 'Hyderabad', icon: MapPin },
  { id: 'settings', label: 'Site Text', icon: Settings },
];

export function AdminApp() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('launch');

  return (
    <div className="min-h-screen bg-katana-black text-katana-bone flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-64 bg-gradient-to-b from-katana-coal to-katana-black border-r border-katana-crimson/20 md:min-h-screen flex-shrink-0 md:sticky md:top-0 md:h-screen">
        <div className="p-4 border-b border-katana-crimson/20">
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-katana-crimson" />
            <h1 className="font-display font-700 text-katana-crimson text-lg tracking-wider">
              KATANA ADMIN
            </h1>
          </div>
          <p className="text-katana-silver/40 text-xs mt-1 ml-8">Control panel, miya</p>
        </div>
        <nav className="p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto md:flex-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded text-sm font-body transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-katana-crimson/15 text-katana-crimson border-l-2 border-katana-crimson'
                  : 'text-katana-silver/50 hover:text-katana-bone hover:bg-katana-ash/20 border-l-2 border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-katana-crimson/10 hidden md:block">
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-3 py-2 text-sm text-katana-silver/50 hover:text-katana-crimson transition-colors w-full rounded"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-katana-silver/50 hover:text-katana-crimson transition-colors rounded"
          >
            <Home className="w-4 h-4" /> View Site
          </a>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden bg-gradient-to-b from-katana-black to-katana-coal/30">
        <div className="max-w-3xl mx-auto">
          {activeTab === 'launch' && <LaunchEditor />}
          {activeTab === 'hero' && <HeroEditor />}
          {activeTab === 'legend' && <LegendEditor />}
          {activeTab === 'anthem' && <AnthemEditor />}
          {activeTab === 'stats' && <CharStatsEditor />}
          {activeTab === 'dialogues' && <DialoguesEditor />}
          {activeTab === 'lyrics' && <LyricsEditor />}
          {activeTab === 'origin' && <OriginEditor />}
          {activeTab === 'darbar' && <DarbarEditor />}
          {activeTab === 'sidekick' && <SidekickEditor />}
          {activeTab === 'gallery' && <GalleryEditor />}
          {activeTab === 'hyderabad' && <HyderabadEditor />}
          {activeTab === 'settings' && <SiteTextEditor />}
        </div>
      </main>
    </div>
  );
}

// ---- Shared UI helpers ----

function SaveButton({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="flex items-center gap-2 px-5 py-2.5 bg-katana-crimson/15 border border-katana-crimson/40 text-katana-crimson rounded text-sm font-body font-semibold hover:bg-katana-crimson/25 hover:border-katana-crimson/60 transition-all disabled:opacity-50"
    >
      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      Save Changes
    </button>
  );
}

function TextField({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-katana-gold/60 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone focus:border-katana-crimson/50 focus:outline-none"
      />
    </div>
  );
}

function TextArea({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-katana-gold/60 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone focus:border-katana-crimson/50 focus:outline-none resize-y"
      />
    </div>
  );
}

function MediaUploadField({
  label, value, onChange, accept = 'image', folder = 'images',
}: { label: string; value: string; onChange: (url: string) => void; accept?: 'image' | 'video' | 'both'; folder?: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptAttr = accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : 'image/*,video/*';
  const uploadFolder = accept === 'video' ? 'videos' : folder;

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    const { url, error: uploadError } = await uploadFile(file, uploadFolder);
    setUploading(false);
    if (uploadError) {
      setError(uploadError);
    } else {
      onChange(url);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const isVideo = value && (value.match(/\.(mp4|webm|ogg|mov|avi)(\?|$)/i) || false);

  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-katana-gold/60 mb-1">{label}</label>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer ${
          dragging ? 'border-katana-crimson bg-katana-crimson/10' : 'border-katana-silver/15 hover:border-katana-crimson/40 bg-katana-ash/30'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept={acceptAttr} onChange={onInputChange} className="hidden" />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <Loader2 className="w-5 h-5 animate-spin text-katana-crimson" />
            <span className="text-sm text-katana-silver/50">Uploading...</span>
          </div>
        ) : dragging ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <FileUp className="w-5 h-5 text-katana-crimson" />
            <span className="text-sm text-katana-crimson">Drop to upload</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2">
            {accept === 'video' ? <Video className="w-5 h-5 text-katana-silver/40" /> : <ImageIcon className="w-5 h-5 text-katana-silver/40" />}
            <span className="text-sm text-katana-silver/40">Drag & drop or click to upload {accept === 'video' ? 'video' : accept === 'both' ? 'image/video' : 'image'}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2 items-start mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste URL here..."
          className="flex-1 px-3 py-2 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone focus:border-katana-crimson/50 focus:outline-none"
        />
        {value && (
          <button onClick={() => onChange('')} className="p-2 text-katana-silver/40 hover:text-katana-crimson transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {value && !isVideo && (
        <div className="mt-2 relative inline-block">
          <img src={value} alt="Preview" className="h-24 rounded border border-katana-silver/15 object-cover" />
        </div>
      )}
      {value && isVideo && (
        <video controls src={value} className="mt-2 w-full max-h-40 rounded border border-katana-silver/15 object-cover" />
      )}
      {error && <p className="text-katana-crimson text-xs mt-1">{error}</p>}
    </div>
  );
}

function ImageUploadField({
  label, value, onChange,
}: { label: string; value: string; onChange: (url: string) => void }) {
  return <MediaUploadField label={label} value={value} onChange={onChange} accept="image" folder="images" />;
}

function VideoUploadField({
  label, value, onChange,
}: { label: string; value: string; onChange: (url: string) => void }) {
  return <MediaUploadField label={label} value={value} onChange={onChange} accept="video" folder="videos" />;
}

function AudioUploadField({
  label, value, onChange,
}: { label: string; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    const { url, error: uploadError } = await uploadFile(file, 'audio');
    setUploading(false);
    if (uploadError) {
      setError(uploadError);
    } else {
      onChange(url);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-katana-gold/60 mb-1">{label}</label>
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={`relative border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer ${
          dragging ? 'border-katana-crimson bg-katana-crimson/10' : 'border-katana-silver/15 hover:border-katana-crimson/40 bg-katana-ash/30'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept="audio/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <Loader2 className="w-5 h-5 animate-spin text-katana-crimson" />
            <span className="text-sm text-katana-silver/50">Uploading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2">
            <Music className="w-5 h-5 text-katana-silver/40" />
            <span className="text-sm text-katana-silver/40">Drag & drop or click to upload audio</span>
          </div>
        )}
      </div>
      <div className="flex gap-2 items-start mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste URL here..."
          className="flex-1 px-3 py-2 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone focus:border-katana-crimson/50 focus:outline-none"
        />
        {value && <button onClick={() => onChange('')} className="p-2 text-katana-silver/40 hover:text-katana-crimson"><X className="w-4 h-4" /></button>}
      </div>
      {value && <audio controls src={value} className="mt-2 h-8 w-full" />}
      {error && <p className="text-katana-crimson text-xs mt-1">{error}</p>}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 pb-4 border-b border-katana-silver/10">
      <h2 className="font-display font-600 text-2xl text-katana-bone tracking-wide">{title}</h2>
      {subtitle && <p className="text-katana-silver/40 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

// ---- Icon input with live preview ----
function IconInputField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-katana-gold/60 mb-1">{label}</label>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Car, Heart, Crown..."
          className="flex-1 px-3 py-2 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone focus:border-katana-crimson/50 focus:outline-none"
        />
        <div className="flex-shrink-0 w-10 h-10 rounded bg-katana-ash/40 border border-katana-silver/15 flex items-center justify-center">
          <AdminDynamicIcon name={value} className="w-5 h-5 text-katana-crimson" />
        </div>
      </div>
      <p className="text-katana-silver/30 text-xs mt-1">Type any Lucide icon name (e.g. Car, Zap, Music)</p>
    </div>
  );
}

// ---- useSettings hook ----
function useSettings(category: string) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('key, value').eq('category', category).then(({ data }) => {
      const map: Record<string, string> = {};
      (data as SettingItem[])?.forEach((r) => { map[r.key] = r.value; });
      setSettings(map);
      setLoaded(true);
    });
  }, [category]);

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    const upserts = Object.entries(settings).map(([key, value]) => ({ key, value, category }));
    await supabase.from('site_settings').upsert(upserts, { onConflict: 'key' });
    setSaving(false);
  };

  const setSavingManually = (v: boolean) => setSaving(v);

  return { settings, update, save, saving, setSavingManually, loaded };
}

// ---- Hero Editor ----
function HeroEditor() {
  const { settings, update, save, saving, loaded } = useSettings('hero');

  if (!loaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionTitle title="Hero Section" subtitle="The grand entry screen" />
      <TextField label="Title" value={settings.hero_title ?? ''} onChange={(v) => update('hero_title', v)} />
      <TextField label="Subtitle" value={settings.hero_subtitle ?? ''} onChange={(v) => update('hero_subtitle', v)} />
      <TextField label="Tagline" value={settings.hero_tagline ?? ''} onChange={(v) => update('hero_tagline', v)} />
      <ImageUploadField label="Background Image" value={settings.hero_bg_image ?? ''} onChange={(v) => update('hero_bg_image', v)} />
      <MediaUploadField label="Background Video (optional)" value={settings.hero_bg_video ?? ''} onChange={(v) => update('hero_bg_video', v)} accept="video" />
      <ImageUploadField label="Silhouette / Portrait" value={settings.hero_silhouette ?? ''} onChange={(v) => update('hero_silhouette', v)} />
      <SaveButton onSave={save} saving={saving} />
    </div>
  );
}

// ---- Legend Editor ----
function LegendEditor() {
  const { settings, update, save, saving, setSavingManually, loaded } = useSettings('legend');
  const [details, setDetails] = useState<any[]>([]);
  const [detailsLoaded, setDetailsLoaded] = useState(false);

  useEffect(() => {
    supabase.from('character_details').select('*').order('sort_order').then(({ data }) => {
      setDetails(data ?? []);
      setDetailsLoaded(true);
    });
  }, []);

  const saveAll = async () => {
    setSavingManually(true);
    await save();
    for (const d of details) {
      if (d.id) {
        await supabase.from('character_details').update({
          label: d.label, value: d.value, icon_key: d.icon_key, sort_order: d.sort_order,
        }).eq('id', d.id);
      }
    }
    setSavingManually(false);
  };

  if (!loaded || !detailsLoaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionTitle title="The Legend" subtitle="Character profile section" />
      <TextField label="Heading Top" value={settings.legend_heading_top ?? ''} onChange={(v) => update('legend_heading_top', v)} />
      <TextField label="Heading Main" value={settings.legend_heading_main ?? ''} onChange={(v) => update('legend_heading_main', v)} />
      <TextArea label="Quote" value={settings.legend_quote ?? ''} onChange={(v) => update('legend_quote', v)} />
      <ImageUploadField label="Portrait Image" value={settings.legend_portrait ?? ''} onChange={(v) => update('legend_portrait', v)} />

      <div className="pt-4">
        <h3 className="text-sm uppercase tracking-wider text-katana-gold/60 mb-3">Character Details</h3>
        {details.map((d, i) => (
          <div key={d.id ?? i} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_1fr_auto] gap-2 mb-2">
            <input value={d.label ?? ''} onChange={(e) => { const c = [...details]; c[i] = { ...c[i], label: e.target.value }; setDetails(c); }}
              placeholder="Label" className="px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
            <input value={d.value ?? ''} onChange={(e) => { const c = [...details]; c[i] = { ...c[i], value: e.target.value }; setDetails(c); }}
              placeholder="Value" className="px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
            <div className="flex gap-1 items-center">
              <input value={d.icon_key ?? ''} onChange={(e) => { const c = [...details]; c[i] = { ...c[i], icon_key: e.target.value }; setDetails(c); }}
                placeholder="Icon" className="flex-1 px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
              <div className="flex-shrink-0 w-8 h-8 rounded bg-katana-ash/40 border border-katana-silver/15 flex items-center justify-center">
                <AdminDynamicIcon name={d.icon_key ?? ''} className="w-4 h-4 text-katana-crimson" />
              </div>
            </div>
            <button onClick={async () => {
              if (d.id) { await supabase.from('character_details').delete().eq('id', d.id); }
              setDetails(details.filter((_, j) => j !== i));
            }} className="p-2 text-katana-silver/40 hover:text-katana-crimson"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={async () => {
          const { data } = await supabase.from('character_details').insert({
            label: 'New Detail', value: '', icon_key: 'User', sort_order: details.length,
          }).select().single();
          if (data) setDetails([...details, data]);
        }} className="flex items-center gap-1 px-3 py-1.5 text-sm text-katana-silver/60 hover:text-katana-crimson border border-katana-silver/15 rounded mt-2">
          <Plus className="w-4 h-4" /> Add Detail
        </button>
      </div>

      <SaveButton onSave={saveAll} saving={saving} />
    </div>
  );
}

// ---- Anthem Editor ----
function AnthemEditor() {
  const { settings, update, save, saving, loaded } = useSettings('anthem');

  if (!loaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionTitle title="Anthem" subtitle="Music player section" />
      <TextField label="Section Title" value={settings.anthem_title ?? ''} onChange={(v) => update('anthem_title', v)} />
      <TextField label="Subtitle" value={settings.anthem_subtitle ?? ''} onChange={(v) => update('anthem_subtitle', v)} />
      <TextField label="Song Title" value={settings.anthem_song_title ?? ''} onChange={(v) => update('anthem_song_title', v)} />
      <TextField label="Artist" value={settings.anthem_artist ?? ''} onChange={(v) => update('anthem_artist', v)} />
      <AudioUploadField label="Anthem Audio File" value={settings.anthem_audio_url ?? ''} onChange={(v) => update('anthem_audio_url', v)} />
      <ImageUploadField label="Album Art" value={settings.anthem_album_art ?? ''} onChange={(v) => update('anthem_album_art', v)} />
      <SaveButton onSave={save} saving={saving} />
    </div>
  );
}

// ---- Generic list editor hook ----
function useListEditor(table: string, orderKey = 'sort_order') {
  const [rows, setRows] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    supabase.from(table).select('*').order(orderKey).then(({ data }) => {
      setRows(data ?? []);
      setLoaded(true);
    });
  }, [table, orderKey]);

  useEffect(() => { load(); }, [load]);

  const updateRow = (i: number, changes: Record<string, any>) => {
    setRows((prev) => { const c = [...prev]; c[i] = { ...c[i], ...changes }; return c; });
  };

  const addRow = async (defaults: Record<string, any>) => {
    const { data } = await supabase.from(table).insert({ ...defaults, [orderKey]: rows.length }).select().single();
    if (data) setRows([...rows, data]);
  };

  const deleteRow = async (i: number) => {
    const row = rows[i];
    if (row?.id) await supabase.from(table).delete().eq('id', row.id);
    setRows(rows.filter((_, j) => j !== i));
  };

  const saveRow = async (i: number) => {
    const row = rows[i];
    if (!row?.id) return;
    setSaving(true);
    const { id, created_at, ...updates } = row;
    await supabase.from(table).update(updates).eq('id', id);
    setSaving(false);
  };

  return { rows, loaded, saving, updateRow, addRow, deleteRow, saveRow, reload: load };
}

// ---- Dialogues Editor ----
function DialoguesEditor() {
  const { settings, update, save, saving: settingsSaving, loaded: settingsLoaded } = useSettings('dialogues');
  const { rows, loaded, deleteRow, addRow, saveRow, saving: rowSaving } = useListEditor('dialogues');

  const [localRows, setLocalRows] = useState<any[]>([]);
  useEffect(() => { if (loaded) setLocalRows(rows); }, [rows, loaded]);

  if (!settingsLoaded || !loaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  const updateLocal = (i: number, value: string) => {
    setLocalRows((prev) => { const c = [...prev]; c[i] = { ...c[i], text: value }; return c; });
  };

  const saveDialogue = async (i: number) => {
    const row = localRows[i];
    if (!row?.id) return;
    await supabase.from('dialogues').update({ text: row.text }).eq('id', row.id);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionTitle title="Dialogues" subtitle="Mass dialogue quotes" />
      <TextField label="Section Heading" value={settings.dialogues_heading ?? ''} onChange={(v) => update('dialogues_heading', v)} />
      <SaveButton onSave={save} saving={settingsSaving} />

      <div className="pt-4 space-y-2">
        <h3 className="text-sm uppercase tracking-wider text-katana-gold/60">Dialogue Lines</h3>
        {localRows.map((row, i) => (
          <div key={row.id ?? i} className="flex gap-2 items-start">
            <textarea value={row.text ?? ''} onChange={(e) => updateLocal(i, e.target.value)}
              className="flex-1 px-3 py-2 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone resize-y" rows={2} />
            <button onClick={() => saveDialogue(i)} disabled={rowSaving} className="p-2 text-katana-silver/60 hover:text-katana-crimson"><Save className="w-4 h-4" /></button>
            <button onClick={() => deleteRow(i)} className="p-2 text-katana-silver/40 hover:text-katana-crimson"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={() => addRow({ text: 'New dialogue...' })} className="flex items-center gap-1 px-3 py-1.5 text-sm text-katana-silver/60 hover:text-katana-crimson border border-katana-silver/15 rounded mt-2">
          <Plus className="w-4 h-4" /> Add Dialogue
        </button>
      </div>
    </div>
  );
}

// ---- Song Lyrics Editor ----
function LyricsEditor() {
  const { rows, loaded, deleteRow, addRow } = useListEditor('song_lyrics');

  const [localRows, setLocalRows] = useState<any[]>([]);
  useEffect(() => { if (loaded) setLocalRows(rows); }, [rows, loaded]);

  if (!loaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  const updateLocal = (i: number, value: string) => {
    setLocalRows((prev) => { const c = [...prev]; c[i] = { ...c[i], line: value }; return c; });
  };

  const saveLyric = async (i: number) => {
    const row = localRows[i];
    if (!row?.id) return;
    await supabase.from('song_lyrics').update({ line: row.line }).eq('id', row.id);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionTitle title="Song Lyrics" subtitle="Lyrics shown on the anthem and lyrics page" />

      <div className="pt-4 space-y-2">
        <h3 className="text-sm uppercase tracking-wider text-katana-gold/60">Lyrics (one line per row)</h3>
        {localRows.map((row, i) => (
          <div key={row.id ?? i} className="flex gap-2 items-start">
            <input value={row.line ?? ''} onChange={(e) => updateLocal(i, e.target.value)}
              className="flex-1 px-3 py-2 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
            <button onClick={() => saveLyric(i)} className="p-2 text-katana-silver/60 hover:text-katana-crimson"><Save className="w-4 h-4" /></button>
            <button onClick={() => deleteRow(i)} className="p-2 text-katana-silver/40 hover:text-katana-crimson"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={() => addRow({ line: 'New line...' })} className="flex items-center gap-1 px-3 py-1.5 text-sm text-katana-silver/60 hover:text-katana-crimson border border-katana-silver/15 rounded mt-2">
          <Plus className="w-4 h-4" /> Add Line
        </button>
      </div>
    </div>
  );
}

// ---- Origin Editor ----
function OriginEditor() {
  const { settings, update, save, saving: settingsSaving, loaded: settingsLoaded } = useSettings('origin');
  const { rows, loaded, deleteRow, addRow, saveRow, saving: rowSaving } = useListEditor('origin_chapters');

  const [localRows, setLocalRows] = useState<any[]>([]);
  useEffect(() => { if (loaded) setLocalRows(rows); }, [rows, loaded]);

  if (!settingsLoaded || !loaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  const updateLocal = (i: number, field: string, value: string) => {
    setLocalRows((prev) => { const c = [...prev]; c[i] = { ...c[i], [field]: value }; return c; });
  };

  const saveChapter = async (i: number) => {
    const row = localRows[i];
    if (!row?.id) return;
    await supabase.from('origin_chapters').update({
      chapter: row.chapter, title: row.title, body: row.body,
    }).eq('id', row.id);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionTitle title="Origin Story" subtitle="Timeline chapters" />
      <TextField label="Section Heading" value={settings.origin_heading ?? ''} onChange={(v) => update('origin_heading', v)} />
      <SaveButton onSave={save} saving={settingsSaving} />

      <div className="pt-4 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-katana-gold/60">Chapters</h3>
        {localRows.map((row, i) => (
          <div key={row.id ?? i} className="space-y-2 p-3 border border-katana-silver/10 rounded">
            <div className="grid grid-cols-2 gap-2">
              <input value={row.chapter ?? ''} onChange={(e) => updateLocal(i, 'chapter', e.target.value)} placeholder="Chapter 01"
                className="px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
              <input value={row.title ?? ''} onChange={(e) => updateLocal(i, 'title', e.target.value)} placeholder="Title"
                className="px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
            </div>
            <textarea value={row.body ?? ''} onChange={(e) => updateLocal(i, 'body', e.target.value)} placeholder="Story text"
              className="w-full px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone resize-y" rows={2} />
            <div className="flex gap-2">
              <button onClick={() => saveChapter(i)} className="flex items-center gap-1 px-2 py-1 text-xs text-katana-silver/60 hover:text-katana-crimson"><Save className="w-3 h-3" /> Save</button>
              <button onClick={() => deleteRow(i)} className="flex items-center gap-1 px-2 py-1 text-xs text-katana-silver/40 hover:text-katana-crimson"><Trash2 className="w-3 h-3" /> Delete</button>
            </div>
          </div>
        ))}
        <button onClick={() => addRow({ chapter: 'Chapter 05', title: 'New Chapter', body: 'New story...' })}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-katana-silver/60 hover:text-katana-crimson border border-katana-silver/15 rounded">
          <Plus className="w-4 h-4" /> Add Chapter
        </button>
      </div>
    </div>
  );
}

// ---- Darbar Editor ----
function DarbarEditor() {
  const { settings, update, save, saving: settingsSaving, loaded: settingsLoaded } = useSettings('darbar');
  const { rows, loaded, deleteRow, addRow } = useListEditor('darbar_members');

  const [localRows, setLocalRows] = useState<any[]>([]);
  useEffect(() => { if (loaded) setLocalRows(rows); }, [rows, loaded]);

  if (!settingsLoaded || !loaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  const updateLocal = (i: number, field: string, value: string) => {
    setLocalRows((prev) => { const c = [...prev]; c[i] = { ...c[i], [field]: value }; return c; });
  };

  const saveMember = async (i: number) => {
    const row = localRows[i];
    if (!row?.id) return;
    await supabase.from('darbar_members').update({
      nickname: row.nickname, title: row.title, description: row.description, icon_key: row.icon_key, image_url: row.image_url,
    }).eq('id', row.id);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionTitle title="Darbar" subtitle="Friends section" />
      <TextField label="Section Heading" value={settings.darbar_heading ?? ''} onChange={(v) => update('darbar_heading', v)} />
      <SaveButton onSave={save} saving={settingsSaving} />

      <div className="pt-4 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-katana-gold/60">Members</h3>
        {localRows.map((row, i) => (
          <div key={row.id ?? i} className="space-y-2 p-3 border border-katana-silver/10 rounded">
            <div className="grid grid-cols-3 gap-2">
              <input value={row.nickname ?? ''} onChange={(e) => updateLocal(i, 'nickname', e.target.value)} placeholder="Nickname"
                className="px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
              <input value={row.title ?? ''} onChange={(e) => updateLocal(i, 'title', e.target.value)} placeholder="Title"
                className="px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
            <div className="flex gap-1 items-center">
              <input value={row.icon_key ?? ''} onChange={(e) => updateLocal(i, 'icon_key', e.target.value)} placeholder="Icon key"
                className="flex-1 px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
              <div className="flex-shrink-0 w-8 h-8 rounded bg-katana-ash/40 border border-katana-silver/15 flex items-center justify-center">
                <AdminDynamicIcon name={row.icon_key ?? ''} className="w-4 h-4 text-katana-crimson" />
              </div>
            </div>
            </div>
            <ImageUploadInline
              value={row.image_url ?? ''}
              onChange={(url) => { updateLocal(i, 'image_url', url); }}
            />
            <textarea value={row.description ?? ''} onChange={(e) => updateLocal(i, 'description', e.target.value)} placeholder="Description"
              className="w-full px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone resize-y" rows={2} />
            <MemberStatsEditor memberId={row.id} />
            <div className="flex gap-2">
              <button onClick={() => saveMember(i)} className="flex items-center gap-1 px-2 py-1 text-xs text-katana-silver/60 hover:text-katana-crimson"><Save className="w-3 h-3" /> Save</button>
              <button onClick={() => deleteRow(i)} className="flex items-center gap-1 px-2 py-1 text-xs text-katana-silver/40 hover:text-katana-crimson"><Trash2 className="w-3 h-3" /> Delete</button>
            </div>
          </div>
        ))}
        <button onClick={() => addRow({ nickname: 'New Bhai', title: 'New Role', description: 'Description...', icon_key: 'shield' })}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-katana-silver/60 hover:text-katana-crimson border border-katana-silver/15 rounded">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>
    </div>
  );
}

// ---- Gallery Editor ----
function GalleryEditor() {
  const { settings, update, save, saving: settingsSaving, loaded: settingsLoaded } = useSettings('gallery');
  const { rows, loaded, deleteRow, addRow } = useListEditor('gallery_items');

  const [localRows, setLocalRows] = useState<any[]>([]);
  useEffect(() => { if (loaded) setLocalRows(rows); }, [rows, loaded]);

  if (!settingsLoaded || !loaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  const updateLocal = (i: number, field: string, value: string) => {
    setLocalRows((prev) => { const c = [...prev]; c[i] = { ...c[i], [field]: value }; return c; });
  };

  const saveItem = async (i: number) => {
    const row = localRows[i];
    if (!row?.id) return;
    await supabase.from('gallery_items').update({ image_url: row.image_url, caption: row.caption }).eq('id', row.id);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionTitle title="Gallery" subtitle="Meme gallery images" />
      <TextField label="Heading Top" value={settings.gallery_heading_top ?? ''} onChange={(v) => update('gallery_heading_top', v)} />
      <TextField label="Heading Main" value={settings.gallery_heading_main ?? ''} onChange={(v) => update('gallery_heading_main', v)} />
      <SaveButton onSave={save} saving={settingsSaving} />

      <div className="pt-4 space-y-3">
        <h3 className="text-sm uppercase tracking-wider text-katana-gold/60">Images</h3>
        {localRows.map((row, i) => (
          <div key={row.id ?? i} className="space-y-2 p-3 border border-katana-silver/10 rounded">
            {row.image_url && <img src={row.image_url} alt="" className="h-20 rounded object-cover" />}
            <ImageUploadInline
              value={row.image_url ?? ''}
              onChange={(url) => { updateLocal(i, 'image_url', url); }}
            />
            <input value={row.caption ?? ''} onChange={(e) => updateLocal(i, 'caption', e.target.value)} placeholder="Caption"
              className="w-full px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
            <div className="flex gap-2">
              <button onClick={() => saveItem(i)} className="flex items-center gap-1 px-2 py-1 text-xs text-katana-silver/60 hover:text-katana-crimson"><Save className="w-3 h-3" /> Save</button>
              <button onClick={() => deleteRow(i)} className="flex items-center gap-1 px-2 py-1 text-xs text-katana-silver/40 hover:text-katana-crimson"><Trash2 className="w-3 h-3" /> Delete</button>
            </div>
          </div>
        ))}
        <button onClick={() => addRow({ image_url: '', caption: 'New caption...' })}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-katana-silver/60 hover:text-katana-crimson border border-katana-silver/15 rounded">
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>
    </div>
  );
}

function ImageUploadInline({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url } = await uploadFile(file, 'gallery');
    if (url) onChange(url);
    setUploading(false);
  };
  return (
    <div className="flex gap-2">
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or upload"
        className="flex-1 px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
      <label className="cursor-pointer flex items-center gap-1 px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-silver">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>
    </div>
  );
}

// ---- Hyderabad Editor ----
function HyderabadEditor() {
  const { settings, update, save, saving, loaded } = useSettings('hyderabad');

  if (!loaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionTitle title="Hyderabad" subtitle="Territory section" />
      <TextField label="Heading Top" value={settings.hyderabad_heading_top ?? ''} onChange={(v) => update('hyderabad_heading_top', v)} />
      <TextField label="Heading Main" value={settings.hyderabad_heading_main ?? ''} onChange={(v) => update('hyderabad_heading_main', v)} />
      <TextField label="Tagline" value={settings.hyderabad_tagline ?? ''} onChange={(v) => update('hyderabad_tagline', v)} />
      <ImageUploadField label="Background Image" value={settings.hyderabad_bg_image ?? ''} onChange={(v) => update('hyderabad_bg_image', v)} />
      <SaveButton onSave={save} saving={saving} />
    </div>
  );
}

// ---- Launch Control Editor ----
function LaunchEditor() {
  const { settings, update, save, saving, loaded } = useSettings('launch');

  if (!loaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  const launchDateStr = settings.launch_date ?? '';
  const isActive = launchDateStr && new Date(launchDateStr).getTime() > Date.now();

  const clearLaunch = async () => {
    update('launch_date', '');
    await supabase.from('site_settings').delete().eq('key', 'launch_date');
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <SectionTitle title="Launch Control" subtitle="Set a countdown timer. The site will show 'Coming Soon' until the launch time, then automatically switch to the full site." />

      {/* Status badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body ${
        isActive
          ? 'bg-katana-gold/10 border border-katana-gold/30 text-katana-gold'
          : 'bg-katana-silver/10 border border-katana-silver/20 text-katana-silver/50'
      }`}>
        <Rocket className="w-4 h-4" />
        {isActive ? 'Countdown Active' : 'No Active Countdown'}
      </div>

      {/* Launch date/time picker */}
      <div className="katana-border rounded-sm p-5 bg-katana-coal/40">
        <label className="block text-xs uppercase tracking-wider text-katana-gold/60 mb-2">Launch Date & Time</label>
        <input
          type="datetime-local"
          value={launchDateStr ? launchDateStr.slice(0, 16) : ''}
          onChange={(e) => update('launch_date', e.target.value)}
          className="w-full px-4 py-3 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone focus:border-katana-crimson/50 focus:outline-none"
        />
        <p className="text-katana-silver/30 text-xs mt-2">
          Pick the exact date and time when the website should go live. Visitors will see a countdown timer until then.
        </p>
      </div>

      {/* Countdown text customization */}
      <TextField label="Countdown Title" value={settings.launch_title ?? ''} onChange={(v) => update('launch_title', v)} placeholder="KPHB KATANA" />
      <TextField label="Countdown Subtitle" value={settings.launch_subtitle ?? ''} onChange={(v) => update('launch_subtitle', v)} placeholder="The Legend is Coming Soon..." />
      <TextArea label="Countdown Message" value={settings.launch_message ?? ''} onChange={(v) => update('launch_message', v)} placeholder="Arey miya, Katana aa raha hai..." />

      <div className="flex gap-3 items-center">
        <SaveButton onSave={save} saving={saving} />
        {isActive && (
          <button
            onClick={clearLaunch}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-katana-silver/50 hover:text-katana-crimson border border-katana-silver/15 hover:border-katana-crimson/30 rounded transition-all"
          >
            <X className="w-4 h-4" /> Remove Countdown
          </button>
        )}
      </div>

      {isActive && (
        <div className="katana-border rounded-sm p-4 bg-katana-crimson/5 border-katana-crimson/20">
          <p className="text-katana-crimson/80 text-sm font-body">
            <Calendar className="w-4 h-4 inline mr-2" />
            Site will launch on {new Date(launchDateStr).toLocaleString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      )}
    </div>
  );
}

// ---- Site Text Editor (footer, nav, misc) ----
function SiteTextEditor() {
  const { settings, update, save, saving, setSavingManually, loaded } = useSettings('footer');

  // Also load nav category
  const [navBrand, setNavBrand] = useState('');
  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'nav_brand').maybeSingle().then(({ data }) => {
      if (data) setNavBrand(data.value);
    });
  }, []);

  const saveAll = async () => {
    setSavingManually(true);
    await save();
    await supabase.from('site_settings').upsert({ key: 'nav_brand', value: navBrand, category: 'nav' }, { onConflict: 'key' });
    setSavingManually(false);
  };

  if (!loaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionTitle title="Site Text" subtitle="Footer, navigation, and misc" />
      <TextField label="Nav Brand" value={navBrand} onChange={setNavBrand} />
      <TextArea label="Footer Quote" value={settings.footer_quote ?? ''} onChange={(v) => update('footer_quote', v)} />
      <TextField label="Footer Text" value={settings.footer_text ?? ''} onChange={(v) => update('footer_text', v)} />
      <TextField label="Footer Copyright" value={settings.footer_copyright ?? ''} onChange={(v) => update('footer_copyright', v)} />
      <TextField label="Instagram Handle" value={settings.footer_instagram ?? ''} onChange={(v) => update('footer_instagram', v)} placeholder="@kphb.katana" />
      <ImageUploadField label="Favicon (browser tab icon)" value={settings.site_favicon ?? ''} onChange={(v) => update('site_favicon', v)} />
      <SaveButton onSave={saveAll} saving={saving} />
    </div>
  );
}

// ---- Character Stats Editor ----
function CharStatsEditor() {
  const { settings, update, save, saving: settingsSaving, loaded: settingsLoaded } = useSettings('stats');
  const { rows, loaded, deleteRow, addRow } = useListEditor('character_stats');

  const [localRows, setLocalRows] = useState<any[]>([]);
  useEffect(() => { if (loaded) setLocalRows(rows); }, [rows, loaded]);

  if (!settingsLoaded || !loaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  const updateLocal = (i: number, field: string, value: string | number) => {
    setLocalRows((prev) => { const c = [...prev]; c[i] = { ...c[i], [field]: value }; return c; });
  };

  const saveStat = async (i: number) => {
    const row = localRows[i];
    if (!row?.id) return;
    await supabase.from('character_stats').update({
      stat_name: row.stat_name, stat_value: Number(row.stat_value), stat_max: Number(row.stat_max), icon_key: row.icon_key,
    }).eq('id', row.id);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionTitle title="Character Stats" subtitle="Katana's RPG-style ability stats" />
      <TextField label="Section Heading" value={settings.stats_heading ?? ''} onChange={(v) => update('stats_heading', v)} />
      <TextField label="Subheading" value={settings.stats_subheading ?? ''} onChange={(v) => update('stats_subheading', v)} />
      <SaveButton onSave={save} saving={settingsSaving} />

      <div className="pt-4 space-y-3">
        <h3 className="text-sm uppercase tracking-wider text-katana-gold/60">Stats</h3>
        {localRows.map((row, i) => (
          <div key={row.id ?? i} className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-center p-2 border border-katana-silver/10 rounded">
            <input value={row.stat_name ?? ''} onChange={(e) => updateLocal(i, 'stat_name', e.target.value)} placeholder="Stat Name"
              className="px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
            <input type="number" value={row.stat_value ?? 0} onChange={(e) => updateLocal(i, 'stat_value', e.target.value)} placeholder="Value"
              className="px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone w-20" />
            <input type="number" value={row.stat_max ?? 100} onChange={(e) => updateLocal(i, 'stat_max', e.target.value)} placeholder="Max"
              className="px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone w-20" />
            <div className="flex gap-1 items-center">
              <input value={row.icon_key ?? ''} onChange={(e) => updateLocal(i, 'icon_key', e.target.value)} placeholder="Icon"
                className="flex-1 px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
              <div className="flex-shrink-0 w-8 h-8 rounded bg-katana-ash/40 border border-katana-silver/15 flex items-center justify-center">
                <AdminDynamicIcon name={row.icon_key ?? ''} className="w-4 h-4 text-katana-crimson" />
              </div>
            </div>
            <div className="flex">
              <button onClick={() => saveStat(i)} className="p-1.5 text-katana-silver/60 hover:text-katana-crimson"><Save className="w-3.5 h-3.5" /></button>
              <button onClick={() => deleteRow(i)} className="p-1.5 text-katana-silver/40 hover:text-katana-crimson"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        <button onClick={() => addRow({ stat_name: 'New Stat', stat_value: 50, stat_max: 100, icon_key: 'Zap' })}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-katana-silver/60 hover:text-katana-crimson border border-katana-silver/15 rounded">
          <Plus className="w-4 h-4" /> Add Stat
        </button>
      </div>
    </div>
  );
}

// ---- Sidekick Editor ----
function SidekickEditor() {
  const { settings, update, save, saving: settingsSaving, loaded: settingsLoaded } = useSettings('sidekick');
  const { rows, loaded, deleteRow, addRow } = useListEditor('sidekick_roles');

  const [localRows, setLocalRows] = useState<any[]>([]);
  useEffect(() => { if (loaded) setLocalRows(rows); }, [rows, loaded]);

  if (!settingsLoaded || !loaded) return <Loader2 className="w-6 h-6 animate-spin text-katana-crimson" />;

  const updateLocal = (i: number, field: string, value: string) => {
    setLocalRows((prev) => { const c = [...prev]; c[i] = { ...c[i], [field]: value }; return c; });
  };

  const saveRole = async (i: number) => {
    const row = localRows[i];
    if (!row?.id) return;
    await supabase.from('sidekick_roles').update({
      role_name: row.role_name, role_title: row.role_title, description: row.description, icon_key: row.icon_key, card_color: row.card_color,
    }).eq('id', row.id);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <SectionTitle title="Gang Members" subtitle="Crew membership roles" />
      <TextField label="Section Heading" value={settings.sidekick_heading ?? ''} onChange={(v) => update('sidekick_heading', v)} />
      <TextField label="Subheading" value={settings.sidekick_subheading ?? ''} onChange={(v) => update('sidekick_subheading', v)} />
      <SaveButton onSave={save} saving={settingsSaving} />

      <div className="pt-4 space-y-3">
        <h3 className="text-sm uppercase tracking-wider text-katana-gold/60">Roles</h3>
        {localRows.map((row, i) => (
          <div key={row.id ?? i} className="space-y-2 p-3 border border-katana-silver/10 rounded">
            <input value={row.role_name ?? ''} onChange={(e) => updateLocal(i, 'role_name', e.target.value)} placeholder="Role Name"
              className="w-full px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
            <input value={row.role_title ?? ''} onChange={(e) => updateLocal(i, 'role_title', e.target.value)} placeholder="Role Title (on card)"
              className="w-full px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
            <textarea value={row.description ?? ''} onChange={(e) => updateLocal(i, 'description', e.target.value)} placeholder="Description"
              className="w-full px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone resize-y" rows={2} />
            <div className="grid grid-cols-2 gap-2">
              <div className="flex gap-1 items-center">
                <input value={row.icon_key ?? ''} onChange={(e) => updateLocal(i, 'icon_key', e.target.value)} placeholder="Icon"
                  className="flex-1 px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone" />
                <div className="flex-shrink-0 w-8 h-8 rounded bg-katana-ash/40 border border-katana-silver/15 flex items-center justify-center">
                  <AdminDynamicIcon name={row.icon_key ?? ''} className="w-4 h-4 text-katana-crimson" />
                </div>
              </div>
              <select value={row.card_color ?? 'crimson'} onChange={(e) => updateLocal(i, 'card_color', e.target.value)}
                className="px-2 py-1.5 bg-katana-ash/40 border border-katana-silver/15 rounded text-sm text-katana-bone">
                <option value="crimson">Crimson</option>
                <option value="gold">Gold</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => saveRole(i)} className="flex items-center gap-1 px-2 py-1 text-xs text-katana-silver/60 hover:text-katana-crimson"><Save className="w-3 h-3" /> Save</button>
              <button onClick={() => deleteRow(i)} className="flex items-center gap-1 px-2 py-1 text-xs text-katana-silver/40 hover:text-katana-crimson"><Trash2 className="w-3 h-3" /> Delete</button>
            </div>
          </div>
        ))}
        <button onClick={() => addRow({ role_name: 'New Role', role_title: 'New Title', description: 'Description...', icon_key: 'Users', card_color: 'crimson' })}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-katana-silver/60 hover:text-katana-crimson border border-katana-silver/15 rounded">
          <Plus className="w-4 h-4" /> Add Role
        </button>
      </div>
    </div>
  );
}

// ---- Member Stats Editor (inline within Darbar) ----
function MemberStatsEditor({ memberId }: { memberId: string }) {
  const [stats, setStats] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from('darbar_member_stats').select('*').eq('member_id', memberId).order('sort_order').then(({ data }) => {
      setStats(data ?? []);
      setLoaded(true);
    });
  }, [memberId]);

  const updateLocal = (i: number, field: string, value: string | number) => {
    setStats((prev) => { const c = [...prev]; c[i] = { ...c[i], [field]: value }; return c; });
  };

  const saveStat = async (i: number) => {
    const row = stats[i];
    if (!row?.id) return;
    await supabase.from('darbar_member_stats').update({
      stat_name: row.stat_name, stat_value: Number(row.stat_value), stat_max: Number(row.stat_max),
    }).eq('id', row.id);
  };

  const addStat = async () => {
    const { data } = await supabase.from('darbar_member_stats').insert({
      member_id: memberId, stat_name: 'New Stat', stat_value: 50, stat_max: 100, sort_order: stats.length,
    }).select().single();
    if (data) setStats([...stats, data]);
  };

  const deleteStat = async (i: number) => {
    const row = stats[i];
    if (row?.id) await supabase.from('darbar_member_stats').delete().eq('id', row.id);
    setStats(stats.filter((_, j) => j !== i));
  };

  if (!loaded) return null;

  return (
    <div className="pt-2">
      <p className="text-[10px] uppercase tracking-wider text-katana-gold/50 mb-1">Member Stats</p>
      {stats.map((row, i) => (
        <div key={row.id ?? i} className="grid grid-cols-2 sm:grid-cols-[2fr_1fr_1fr_auto] gap-1 mb-1">
          <input value={row.stat_name ?? ''} onChange={(e) => updateLocal(i, 'stat_name', e.target.value)} placeholder="Stat"
            className="px-2 py-1 bg-katana-ash/40 border border-katana-silver/10 rounded text-xs text-katana-bone" />
          <input type="number" value={row.stat_value ?? 0} onChange={(e) => updateLocal(i, 'stat_value', e.target.value)}
            className="px-2 py-1 bg-katana-ash/40 border border-katana-silver/10 rounded text-xs text-katana-bone w-16" />
          <input type="number" value={row.stat_max ?? 100} onChange={(e) => updateLocal(i, 'stat_max', e.target.value)}
            className="px-2 py-1 bg-katana-ash/40 border border-katana-silver/10 rounded text-xs text-katana-bone w-16" />
          <div className="flex">
            <button onClick={() => saveStat(i)} className="p-1 text-katana-silver/50 hover:text-katana-crimson"><Save className="w-3 h-3" /></button>
            <button onClick={() => deleteStat(i)} className="p-1 text-katana-silver/30 hover:text-katana-crimson"><Trash2 className="w-3 h-3" /></button>
          </div>
        </div>
      ))}
      <button onClick={addStat} className="text-xs text-katana-silver/40 hover:text-katana-crimson mt-1">+ Add Stat</button>
    </div>
  );
}
