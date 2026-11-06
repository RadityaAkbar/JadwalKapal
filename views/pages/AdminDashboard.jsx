import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Ship, Anchor, Calendar, Clock, Plus, Trash2, Edit3, CheckCircle2, 
  AlertTriangle, ArrowRight, RefreshCw, X, Shield, Users, MapPin, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DetailJadwalModal from '../components/DetailJadwalModal';

export default function AdminDashboard() {
  const { admin, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Active tab: 'jadwal' | 'kapal' | 'pelabuhan'
  const [activeTab, setActiveTab] = useState('jadwal');

  // Data states
  const [jadwalList, setJadwalList] = useState([]);
  const [kapalList, setKapalList] = useState([]);
  const [pelabuhanList, setPelabuhanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Modal states
  const [showJadwalModal, setShowJadwalModal] = useState(false);
  const [showKapalModal, setShowKapalModal] = useState(false);
  const [showPelabuhanModal, setShowPelabuhanModal] = useState(false);

  // Form states
  const [newJadwal, setNewJadwal] = useState({
    kapal_id: '',
    pelabuhan_asal_id: '',
    pelabuhan_tujuan_id: '',
    waktu_berangkat: '',
    waktu_tiba: '',
    status: 'Terjadwal'
  });

  const [newKapal, setNewKapal] = useState({
    nama_kapal: '',
    jenis_kapal: 'Kapal Feri',
    kapasitas: ''
  });

  const [newPelabuhan, setNewPelabuhan] = useState({
    nama_pelabuhan: '',
    kota: ''
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resJadwal, resKapal, resPelabuhan] = await Promise.all([
        axios.get('http://localhost:5000/api/jadwal'),
        axios.get('http://localhost:5000/api/kapal'),
        axios.get('http://localhost:5000/api/pelabuhan')
      ]);
      setJadwalList(resJadwal.data);
      setKapalList(resKapal.data);
      setPelabuhanList(resPelabuhan.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      showFeedback('error', 'Gagal memuat data dari server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  // Handler CRUD Jadwal
  const handleCreateJadwal = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jadwal', newJadwal);
      showFeedback('success', 'Jadwal kapal berhasil ditambahkan!');
      setShowJadwalModal(false);
      setNewJadwal({
        kapal_id: '',
        pelabuhan_asal_id: '',
        pelabuhan_tujuan_id: '',
        waktu_berangkat: '',
        waktu_tiba: '',
        status: 'Terjadwal'
      });
      fetchData();
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Gagal menambah jadwal');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/jadwal/${id}`, { status });
      showFeedback('success', `Status jadwal berhasil diubah ke ${status}`);
      fetchData();
    } catch (err) {
      showFeedback('error', 'Gagal memperbarui status');
    }
  };

  const handleDeleteJadwal = async (id) => {
    if (!window.confirm('Yakin ingin menghapus jadwal ini?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/jadwal/${id}`);
      showFeedback('success', 'Jadwal berhasil dihapus');
      fetchData();
    } catch (err) {
      showFeedback('error', 'Gagal menghapus jadwal');
    }
  };

  // Handler CRUD Kapal
  const handleCreateKapal = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/kapal', newKapal);
      showFeedback('success', 'Kapal baru berhasil didaftarkan!');
      setShowKapalModal(false);
      setNewKapal({ nama_kapal: '', jenis_kapal: 'Kapal Feri', kapasitas: '' });
      fetchData();
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Gagal menambah kapal');
    }
  };

  const handleDeleteKapal = async (id) => {
    if (!window.confirm('Hapus data kapal ini?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/kapal/${id}`);
      showFeedback('success', 'Kapal berhasil dihapus');
      fetchData();
    } catch (err) {
      showFeedback('error', 'Gagal menghapus kapal');
    }
  };

  // Handler CRUD Pelabuhan
  const handleCreatePelabuhan = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/pelabuhan', newPelabuhan);
      showFeedback('success', 'Pelabuhan baru berhasil ditambahkan!');
      setShowPelabuhanModal(false);
      setNewPelabuhan({ nama_pelabuhan: '', kota: '' });
      fetchData();
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Gagal menambah pelabuhan');
    }
  };

  const handleDeletePelabuhan = async (id) => {
    if (!window.confirm('Hapus pelabuhan ini?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/pelabuhan/${id}`);
      showFeedback('success', 'Pelabuhan berhasil dihapus');
      fetchData();
    } catch (err) {
      showFeedback('error', 'Gagal menghapus pelabuhan');
    }
  };

  if (authLoading || (!isAuthenticated && !admin)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#94a3b8' }}>Memuat autentikasi...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
      {/* Feedback Toast */}
      {feedback.message && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          zIndex: 999,
          padding: '14px 20px',
          borderRadius: '12px',
          background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: '#ffffff',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }} className="animate-fade">
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Top Banner / Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '20px',
        padding: '28px 32px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-terjadwal">
              <Shield size={12} /> Administrator Sistem
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
            Dashboard Manajemen Pelayaran
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '4px 0 0' }}>
            Selamat datang, <strong style={{ color: '#38bdf8' }}>{admin?.nama || admin?.username}</strong>. Kelola jadwal keberangkatan kapal secara real-time.
          </p>
        </div>

        <button onClick={fetchData} className="btn btn-secondary btn-sm">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'rgba(15, 29, 49, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL JADWAL</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>{jadwalList.length}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Terjadwal & Aktif</div>
        </div>

        <div style={{
          background: 'rgba(15, 29, 49, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>ARMADA KAPAL</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(20, 184, 166, 0.15)', color: '#2dd4bf' }}>
              <Ship size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>{kapalList.length}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Kapal Siap Operasi</div>
        </div>

        <div style={{
          background: 'rgba(15, 29, 49, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>PELABUHAN</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <MapPin size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>{pelabuhanList.length}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Titik Singgah & Sandar</div>
        </div>

        <div style={{
          background: 'rgba(15, 29, 49, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>STATUS OPERASIONAL</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399', marginTop: '6px' }}>Sistem Normal</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px' }}>Database Terhubung</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '14px',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setActiveTab('jadwal')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'jadwal' ? '#0284c7' : 'transparent',
            color: activeTab === 'jadwal' ? '#ffffff' : '#94a3b8',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Calendar size={18} />
          <span>Kelola Jadwal ({jadwalList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('kapal')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'kapal' ? '#0284c7' : 'transparent',
            color: activeTab === 'kapal' ? '#ffffff' : '#94a3b8',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Ship size={18} />
          <span>Armada Kapal ({kapalList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pelabuhan')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'pelabuhan' ? '#0284c7' : 'transparent',
            color: activeTab === 'pelabuhan' ? '#ffffff' : '#94a3b8',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <Anchor size={18} />
          <span>Pelabuhan ({pelabuhanList.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: 1. JADWAL */}
      {activeTab === 'jadwal' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Daftar Jadwal Keberangkatan & Kedatangan
            </h2>
            <button onClick={() => setShowJadwalModal(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Tambah Jadwal Baru</span>
            </button>
          </div>

          <div style={{
            background: 'rgba(13, 27, 45, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                    <th style={{ padding: '16px' }}>Kapal</th>
                    <th style={{ padding: '16px' }}>Rute Perjalanan</th>
                    <th style={{ padding: '16px' }}>Waktu Berangkat</th>
                    <th style={{ padding: '16px' }}>Waktu Tiba</th>
                    <th style={{ padding: '16px' }}>Status Saat Ini</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {jadwalList.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                        Belum ada jadwal kapal yang terdaftar. Klik "Tambah Jadwal Baru" di atas.
                      </td>
                    </tr>
                  ) : (
                    jadwalList.map((j) => (
                      <tr key={j.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontWeight: 700, color: '#f8fafc' }}>{j.Kapal?.nama_kapal || 'N/A'}</div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{j.Kapal?.jenis_kapal}</div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#e2e8f0' }}>{j.PelabuhanAsal?.nama_pelabuhan}</span>
                            <ArrowRight size={14} color="#38bdf8" />
                            <span style={{ color: '#38bdf8', fontWeight: 600 }}>{j.PelabuhanTujuan?.nama_pelabuhan}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px', color: '#cbd5e1' }}>
                          {new Date(j.waktu_berangkat).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </td>
                        <td style={{ padding: '16px', color: '#cbd5e1' }}>
                          {new Date(j.waktu_tiba).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <select 
                            value={j.status} 
                            onChange={(e) => handleUpdateStatus(j.id, e.target.value)}
                            className="form-select"
                            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                          >
                            <option value="Terjadwal">Terjadwal</option>
                            <option value="Berangkat">Berangkat</option>
                            <option value="Tiba">Tiba</option>
                            <option value="Tertunda">Tertunda</option>
                            <option value="Batal">Batal</option>
                          </select>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <button 
                            onClick={() => setSelectedDetail(j)}
                            className="btn btn-secondary btn-sm"
                            style={{ marginRight: '8px' }}
                            title="Lihat Detail Jadwal & Kapal"
                          >
                            <Eye size={15} color="#38bdf8" />
                          </button>
                          <button 
                            onClick={() => handleDeleteJadwal(j.id)}
                            className="btn btn-danger btn-sm"
                            title="Hapus Jadwal"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. KAPAL */}
      {activeTab === 'kapal' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Daftar Armada Kapal
            </h2>
            <button onClick={() => setShowKapalModal(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Daftarkan Kapal Baru</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '18px'
          }}>
            {kapalList.map((k) => (
              <div key={k.id} style={{
                background: 'rgba(13, 27, 45, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{
                      padding: '8px',
                      borderRadius: '10px',
                      background: 'rgba(2, 132, 199, 0.15)',
                      color: '#38bdf8'
                    }}>
                      <Ship size={20} />
                    </div>
                    <button 
                      onClick={() => handleDeleteKapal(k.id)}
                      className="btn btn-danger btn-sm"
                      title="Hapus Kapal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>
                    {k.nama_kapal}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{k.jenis_kapal}</div>
                </div>

                <div style={{
                  marginTop: '18px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.82rem',
                  color: '#64748b'
                }}>
                  <span>Kapasitas Muatan:</span>
                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{k.kapasitas} Penumpang</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. PELABUHAN */}
      {activeTab === 'pelabuhan' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Daftar Pelabuhan Sandar
            </h2>
            <button onClick={() => setShowPelabuhanModal(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Tambah Pelabuhan</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '18px'
          }}>
            {pelabuhanList.map((p) => (
              <div key={p.id} style={{
                background: 'rgba(13, 27, 45, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>
                    {p.nama_pelabuhan}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                    {p.kota}
                  </p>
                </div>
                <button 
                  onClick={() => handleDeletePelabuhan(p.id)}
                  className="btn btn-danger btn-sm"
                  title="Hapus Pelabuhan"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TAMBAH JADWAL
         ======================================================== */}
      {showJadwalModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1b2d',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '540px',
            padding: '28px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.7)'
          }} className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Tambah Jadwal Pelayaran
              </h3>
              <button 
                onClick={() => setShowJadwalModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateJadwal}>
              <div className="form-group">
                <label className="form-label">Pilih Kapal Armada</label>
                <select
                  required
                  className="form-select"
                  value={newJadwal.kapal_id}
                  onChange={(e) => setNewJadwal({ ...newJadwal, kapal_id: e.target.value })}
                >
                  <option value="">-- Pilih Kapal --</option>
                  {kapalList.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama_kapal} ({k.jenis_kapal})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Pelabuhan Asal</label>
                  <select
                    required
                    className="form-select"
                    value={newJadwal.pelabuhan_asal_id}
                    onChange={(e) => setNewJadwal({ ...newJadwal, pelabuhan_asal_id: e.target.value })}
                  >
                    <option value="">-- Pelabuhan Asal --</option>
                    {pelabuhanList.map((p) => (
                      <option key={p.id} value={p.id}>{p.nama_pelabuhan}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Pelabuhan Tujuan</label>
                  <select
                    required
                    className="form-select"
                    value={newJadwal.pelabuhan_tujuan_id}
                    onChange={(e) => setNewJadwal({ ...newJadwal, pelabuhan_tujuan_id: e.target.value })}
                  >
                    <option value="">-- Pelabuhan Tujuan --</option>
                    {pelabuhanList.map((p) => (
                      <option key={p.id} value={p.id}>{p.nama_pelabuhan}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Waktu Keberangkatan</label>
                  <input
                    type="datetime-local"
                    required
                    className="form-input"
                    value={newJadwal.waktu_berangkat}
                    onChange={(e) => setNewJadwal({ ...newJadwal, waktu_berangkat: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimasi Tiba</label>
                  <input
                    type="datetime-local"
                    required
                    className="form-input"
                    value={newJadwal.waktu_tiba}
                    onChange={(e) => setNewJadwal({ ...newJadwal, waktu_tiba: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status Awal</label>
                <select
                  className="form-select"
                  value={newJadwal.status}
                  onChange={(e) => setNewJadwal({ ...newJadwal, status: e.target.value })}
                >
                  <option value="Terjadwal">Terjadwal</option>
                  <option value="Berangkat">Berangkat</option>
                  <option value="Tertunda">Tertunda</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowJadwalModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TAMBAH KAPAL
         ======================================================== */}
      {showKapalModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1b2d',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '440px',
            padding: '28px'
          }} className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Tambah Armada Kapal
              </h3>
              <button 
                onClick={() => setShowKapalModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateKapal}>
              <div className="form-group">
                <label className="form-label">Nama Kapal</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Contoh: KMP Dharma Rucitra"
                  value={newKapal.nama_kapal}
                  onChange={(e) => setNewKapal({ ...newKapal, nama_kapal: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Jenis Kapal</label>
                <select
                  className="form-select"
                  value={newKapal.jenis_kapal}
                  onChange={(e) => setNewKapal({ ...newKapal, jenis_kapal: e.target.value })}
                >
                  <option value="Kapal Feri">Kapal Feri</option>
                  <option value="Ro-Ro Eksekutif">Ro-Ro Eksekutif</option>
                  <option value="Kapal Cepat">Kapal Cepat / Speedboat</option>
                  <option value="Kapal Penumpang Pelni">Kapal Penumpang Pelni</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Kapasitas (Orang/Penumpang)</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  placeholder="Contoh: 750"
                  value={newKapal.kapasitas}
                  onChange={(e) => setNewKapal({ ...newKapal, kapasitas: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowKapalModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Daftarkan Kapal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TAMBAH PELABUHAN
         ======================================================== */}
      {showPelabuhanModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1b2d',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '440px',
            padding: '28px'
          }} className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Tambah Data Pelabuhan
              </h3>
              <button 
                onClick={() => setShowPelabuhanModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePelabuhan}>
              <div className="form-group">
                <label className="form-label">Nama Pelabuhan</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Contoh: Pelabuhan Tanjung Perak"
                  value={newPelabuhan.nama_pelabuhan}
                  onChange={(e) => setNewPelabuhan({ ...newPelabuhan, nama_pelabuhan: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kota / Wilayah</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Contoh: Surabaya, Jawa Timur"
                  value={newPelabuhan.kota}
                  onChange={(e) => setNewPelabuhan({ ...newPelabuhan, kota: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowPelabuhanModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Pelabuhan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Jadwal & Kapal */}
      {selectedDetail && (
        <DetailJadwalModal
          jadwal={selectedDetail}
          onClose={() => setSelectedDetail(null)}
        />
      )}

    </div>
  );
}
