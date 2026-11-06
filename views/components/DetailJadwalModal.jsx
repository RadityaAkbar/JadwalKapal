import React, { useState, useEffect } from 'react';
import {
  Ship, Calendar, Clock, ArrowRight, MapPin,
  Users, CheckCircle2, AlertTriangle, X, Copy,
  Check, Info, ShieldCheck, Waves
} from 'lucide-react';

export default function DetailJadwalModal({ jadwal, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!jadwal) return null;

  // Hitung durasi pelayaran
  const tBerangkat = new Date(jadwal.waktu_berangkat);
  const tTiba = new Date(jadwal.waktu_tiba);
  const diffMs = Math.max(0, tTiba - tBerangkat);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const durasiText = `${diffHours} Jam ${diffMins > 0 ? `${diffMins} Menit` : ''}`;

  const kodeJadwal = `JK-${String(jadwal.id).padStart(4, '0')}`;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Berangkat':
        return {
          badge: <span className="badge badge-berangkat">● Sedang Berlayar</span>,
          desc: 'Kapal telah bertolak dari pelabuhan asal dan saat ini sedang dalam perjalanan laut menuju destinasi.',
          color: '#34d399',
          bg: 'rgba(16, 185, 129, 0.1)'
        };
      case 'Tiba':
        return {
          badge: <span className="badge badge-tiba">✓ Sudah Tiba</span>,
          desc: 'Kapal telah berhasil bersandar di pelabuhan tujuan dengan aman.',
          color: '#818cf8',
          bg: 'rgba(99, 102, 241, 0.1)'
        };
      case 'Tertunda':
        return {
          badge: <span className="badge badge-tertunda">⚠ Jadwal Tertunda</span>,
          desc: 'Keberangkatan mengalami penundaan sementara karena faktor cuaca laut atau antrean dermaga.',
          color: '#fbbf24',
          bg: 'rgba(245, 158, 11, 0.1)'
        };
      case 'Batal':
        return {
          badge: <span className="badge badge-batal">✕ Dibatalkan</span>,
          desc: 'Pelayaran ini dibatalkan oleh pihak syahbandar/operator. Silakan hubungi layanan informasi pelabuhan.',
          color: '#f87171',
          bg: 'rgba(239, 68, 68, 0.1)'
        };
      case 'Terjadwal':
      default:
        return {
          badge: <span className="badge badge-terjadwal">⏱ Tepat Waktu</span>,
          desc: 'Pelayaran berjalan sesuai jadwal rencana. Disarankan tiba di pelabuhan 3 jam sebelum keberangkatan.',
          color: '#38bdf8',
          bg: 'rgba(14, 165, 233, 0.1)'
        };
    }
  };

  const statusInfo = getStatusInfo(jadwal.status);

  const handleCopy = () => {
    const text = `INFORMASI JADWAL KAPAL LAUT (${kodeJadwal})
Armada: ${jadwal.Kapal?.nama_kapal || '-'} (${jadwal.Kapal?.jenis_kapal || '-'})
Rute: ${jadwal.PelabuhanAsal?.nama_pelabuhan || '-'} -> ${jadwal.PelabuhanTujuan?.nama_pelabuhan || '-'}
Waktu Berangkat: ${tBerangkat.toLocaleString('id-ID')} WIB
Estimasi Tiba: ${tTiba.toLocaleString('id-ID')} WIB
Status: ${jadwal.status}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #0e1e33 0%, #091322 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(14, 165, 233, 0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade"
      >
        {/* Header Modal */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 29, 49, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(14, 165, 233, 0.4)'
            }}>
              <Ship size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Detail Jadwal & Kapal
                </h3>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#38bdf8',
                  background: 'rgba(14, 165, 233, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}>
                  {kodeJadwal}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '2px 0 0' }}>
                Informasi pelayaran lengkap armada maritim
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            title="Tutup (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Rute Visual Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '18px',
            padding: '20px 24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#64748b',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Jalur Pelayaran Antar Pelabuhan</span>
              <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Waves size={14} /> Estimasi: {durasiText}
              </span>
            </div>

            <div className="modal-route-grid">
              {/* Asal */}
              <div className="modal-route-origin" style={{ minWidth: 0, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <MapPin size={14} color="#34d399" />
                  <span>Pelabuhan Asal</span>
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#f8fafc',
                  wordBreak: 'break-word',
                  lineHeight: 1.3
                }}>
                  {jadwal.PelabuhanAsal?.nama_pelabuhan || 'Pelabuhan Asal'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '4px' }}>
                  {jadwal.PelabuhanAsal?.kota || '-'}
                </div>
              </div>

              {/* Rute Connector */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '0 4px'
              }}>
                {/* Durasi Badge */}
                <div style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: 'rgba(2, 132, 199, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  <Clock size={12} />
                  <span>{durasiText}</span>
                </div>

                {/* Garis maritim dengan icon kapal */}
                <div style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    flex: 1,
                    height: '2px',
                    background: 'linear-gradient(90deg, rgba(52, 211, 153, 0.5), rgba(56, 189, 248, 0.5))'
                  }} />
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#091524',
                    border: '1.5px solid #38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    boxShadow: '0 0 12px rgba(56, 189, 248, 0.3)',
                    margin: '0 4px',
                    flexShrink: 0
                  }}>
                    <Ship size={15} />
                  </div>
                  <div style={{
                    flex: 1,
                    height: '2px',
                    background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.5), rgba(129, 140, 248, 0.5))'
                  }} />
                  <ArrowRight size={14} color="#818cf8" style={{ marginLeft: '2px', flexShrink: 0 }} />
                </div>

                <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '6px', whiteSpace: 'nowrap' }}>
                  Jalur Penyeberangan
                </span>
              </div>

              {/* Tujuan */}
              <div className="modal-route-dest" style={{ minWidth: 0, textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <MapPin size={14} color="#38bdf8" />
                  <span>Pelabuhan Tujuan</span>
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#f8fafc',
                  wordBreak: 'break-word',
                  lineHeight: 1.3
                }}>
                  {jadwal.PelabuhanTujuan?.nama_pelabuhan || 'Pelabuhan Tujuan'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '4px' }}>
                  {jadwal.PelabuhanTujuan?.kota || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Grid Informasi Waktu & Status */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {/* Waktu Keberangkatan */}
            <div style={{
              background: 'rgba(15, 29, 49, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '18px 20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px' }}>
                <Clock size={16} />
                <span>WAKTU KEBERANGKATAN</span>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                {tBerangkat.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} />
                <span>
                  {tBerangkat.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Waktu Kedatangan */}
            <div style={{
              background: 'rgba(15, 29, 49, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '18px 20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px' }}>
                <Clock size={16} />
                <span>ESTIMASI KEDATANGAN</span>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                {tTiba.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} />
                <span>
                  {tTiba.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Status Box */}
          <div style={{
            background: statusInfo.bg,
            border: `1px solid ${statusInfo.color}40`,
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}>
            <div style={{ marginTop: '2px' }}>{statusInfo.badge}</div>
            <div style={{ flex: 1, fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.5 }}>
              {statusInfo.desc}
            </div>
          </div>

          {/* Spesifikasi Kapal & Fasilitas */}
          <div style={{
            background: 'rgba(15, 29, 49, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px 22px'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Ship size={18} color="#38bdf8" />
              <span>Spesifikasi Armada Kapal</span>
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginBottom: '18px'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Nama Kapal</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                  {jadwal.Kapal?.nama_kapal || '-'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Kategori / Jenis</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>
                  {jadwal.Kapal?.jenis_kapal || '-'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Daya Tampung Maksimal</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} color="#34d399" />
                  {jadwal.Kapal?.kapasitas || 0} Penumpang
                </span>
              </div>
            </div>

            {/* Fasilitas Badge list */}
            <div style={{
              paddingTop: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                ✓ Ruang Duduk Ber-AC
              </span>
              <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                ✓ Kantin & Kafetaria Kapal
              </span>
              <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                ✓ Peralatan Keselamatan / Sekoci
              </span>
              <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                ✓ Dek Pemandangan Laut
              </span>
              {jadwal.Kapal?.jenis_kapal?.toLowerCase().includes('ro-ro') && (
                <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>
                  ✓ Dek Angkutan Kendaraan
                </span>
              )}
            </div>
          </div>

          {/* Catatan Perjalanan */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.8rem',
            color: '#94a3b8',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px dashed rgba(255, 255, 255, 0.1)'
          }}>
            <Info size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
            <span>
              Waktu keberangkatan dan kedatangan dapat disesuaikan dengan kondisi cuaca serta arahan otoritas pelabuhan.
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '20px 28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 29, 49, 0.6)',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleCopy}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
            <span>{copied ? 'Informasi Disalin!' : 'Salin Info Jadwal'}</span>
          </button>

          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: '8px 24px' }}
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}

