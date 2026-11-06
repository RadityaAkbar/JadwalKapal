import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Ship, Search, Filter, Calendar, Clock, ArrowRight, 
  MapPin, RefreshCw, AlertCircle, Sparkles, Navigation,
  Eye, ChevronRight
} from 'lucide-react';
import DetailJadwalModal from '../components/DetailJadwalModal';

export default function PublicSchedule() {
  const [jadwal, setJadwal] = useState([]);
  const [pelabuhanList, setPelabuhanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsal, setSelectedAsal] = useState('');
  const [selectedTujuan, setSelectedTujuan] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resJadwal, resPelabuhan] = await Promise.all([
        axios.get('http://localhost:5000/api/jadwal'),
        axios.get('http://localhost:5000/api/pelabuhan')
      ]);
      setJadwal(resJadwal.data);
      setPelabuhanList(resPelabuhan.data);
    } catch (err) {
      console.error('Error fetching public schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter schedules on client-side
  const filteredJadwal = jadwal.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || 
      item.Kapal?.nama_kapal?.toLowerCase().includes(term) ||
      item.PelabuhanAsal?.nama_pelabuhan?.toLowerCase().includes(term) ||
      item.PelabuhanTujuan?.nama_pelabuhan?.toLowerCase().includes(term);

    const matchAsal = !selectedAsal || String(item.pelabuhan_asal_id) === String(selectedAsal);
    const matchTujuan = !selectedTujuan || String(item.pelabuhan_tujuan_id) === String(selectedTujuan);
    const matchStatus = !selectedStatus || item.status === selectedStatus;

    return matchSearch && matchAsal && matchTujuan && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Berangkat':
        return <span className="badge badge-berangkat">● Berangkat</span>;
      case 'Tiba':
        return <span className="badge badge-tiba">✓ Tiba</span>;
      case 'Tertunda':
        return <span className="badge badge-tertunda">⚠ Tertunda</span>;
      case 'Batal':
        return <span className="badge badge-batal">✕ Dibatalkan</span>;
      case 'Terjadwal':
      default:
        return <span className="badge badge-terjadwal">⏱ Terjadwal</span>;
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Hero Header */}
      <section style={{
        padding: '54px 24px 44px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.08) 0%, rgba(7, 13, 24, 0) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(2, 132, 199, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '18px'
          }}>
            <Sparkles size={14} />
            <span>Pusat Informasi Jadwal Kapal Real-Time</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: '#f8fafc',
            lineHeight: 1.15,
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}>
            Pantau Keberangkatan & Kedatangan Kapal Laut
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#94a3b8',
            lineHeight: 1.6,
            maxWidth: '620px',
            margin: '0 auto 28px'
          }}>
            Informasi akurat waktu berlayar, pelabuhan asal, pelabuhan tujuan, dan status operasional kapal penumpang serta feri.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', width: '100%', flex: 1 }}>
        {/* Search & Filter Bar */}
        <div style={{
          background: 'rgba(13, 27, 45, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'flex-end'
          }}>
            {/* Search Input */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Pencarian Cepat</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                  placeholder="Cari nama kapal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            {/* Asal Filter */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Pelabuhan Asal</label>
              <select
                className="form-select"
                style={{ width: '100%' }}
                value={selectedAsal}
                onChange={(e) => setSelectedAsal(e.target.value)}
              >
                <option value="">Semua Asal</option>
                {pelabuhanList.map(p => (
                  <option key={p.id} value={p.id}>{p.nama_pelabuhan}</option>
                ))}
              </select>
            </div>

            {/* Tujuan Filter */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Pelabuhan Tujuan</label>
              <select
                className="form-select"
                style={{ width: '100%' }}
                value={selectedTujuan}
                onChange={(e) => setSelectedTujuan(e.target.value)}
              >
                <option value="">Semua Tujuan</option>
                {pelabuhanList.map(p => (
                  <option key={p.id} value={p.id}>{p.nama_pelabuhan}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Status Pelayaran</label>
              <select
                className="form-select"
                style={{ width: '100%' }}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="Terjadwal">Terjadwal</option>
                <option value="Berangkat">Berangkat</option>
                <option value="Tiba">Tiba</option>
                <option value="Tertunda">Tertunda</option>
                <option value="Batal">Batal</option>
              </select>
            </div>

            {/* Reset / Refresh Button */}
            <div>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedAsal('');
                  setSelectedTujuan('');
                  setSelectedStatus('');
                  fetchData();
                }}
                className="btn btn-secondary"
                style={{ width: '100%', height: '42px' }}
              >
                <RefreshCw size={15} />
                <span>Reset Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Timetable / Cards */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            Jadwal Penyeberangan ({filteredJadwal.length})
          </h2>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Waktu ditampilkan dalam zona WIB lokal
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block' }} />
            <p>Memuat jadwal pelayaran terkini...</p>
          </div>
        ) : filteredJadwal.length === 0 ? (
          <div style={{
            background: 'rgba(13, 27, 45, 0.5)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '60px 20px',
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            <Ship size={42} color="#334155" style={{ margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '8px' }}>Tidak Ada Jadwal Ditemukan</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
              Tidak ada jadwal yang cocok dengan kata kunci atau filter pencarian Anda saat ini.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredJadwal.map((j) => (
              <div 
                key={j.id}
                onClick={() => setSelectedDetail(j)}
                title="Klik untuk melihat detail jadwal dan armada kapal"
                style={{
                  background: 'rgba(13, 27, 45, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '24px 28px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '24px',
                  alignItems: 'center',
                  transition: 'all 0.25s ease'
                }}
                className="schedule-row"
              >
                {/* Ship Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(2, 132, 199, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    flexShrink: 0
                  }}>
                    <Ship size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                      {j.Kapal?.nama_kapal || 'Kapal Armada'}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                      {j.Kapal?.jenis_kapal || 'Reguler'} • Kapasitas {j.Kapal?.kapasitas || 0} pax
                    </div>
                  </div>
                </div>

                {/* Route: Origin -> Destination */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Rute Pelayaran
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f8fafc' }}>
                        {j.PelabuhanAsal?.nama_pelabuhan || 'Asal'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{j.PelabuhanAsal?.kota}</div>
                    </div>
                    <ArrowRight size={18} color="#0ea5e9" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, color: '#38bdf8' }}>
                        {j.PelabuhanTujuan?.nama_pelabuhan || 'Tujuan'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{j.PelabuhanTujuan?.kota}</div>
                    </div>
                  </div>
                </div>

                {/* Times: Departure & Arrival */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Waktu Keberangkatan & Estimasi Tiba
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#e2e8f0' }}>
                      <Clock size={14} color="#34d399" />
                      <span>Berangkat: <strong>{new Date(j.waktu_berangkat).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</strong> ({new Date(j.waktu_berangkat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#94a3b8' }}>
                      <Clock size={14} color="#818cf8" />
                      <span>Est. Tiba: <strong>{new Date(j.waktu_tiba).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</strong></span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <div>{getStatusBadge(j.status)}</div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDetail(j);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(2, 132, 199, 0.15)',
                      borderColor: 'rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8'
                    }}
                    title="Lihat detail lengkap jadwal dan kapal"
                  >
                    <Eye size={14} />
                    <span>Detail</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Detail Jadwal & Kapal */}
      {selectedDetail && (
        <DetailJadwalModal
          jadwal={selectedDetail}
          onClose={() => setSelectedDetail(null)}
        />
      )}

      {/* Footer */}
      <footer style={{
        padding: '24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.85rem',
        color: '#64748b',
        background: '#050a12'
      }}>
        © {new Date().getFullYear()} Sistem Informasi Jadwal Kapal Laut (SI-KAPAL). Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
}
