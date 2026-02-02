import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export function PrivacyPage() {
  return (
    <>
      <SEO
        title="Kebijakan Privasi - Silsilah Keluarga"
        description="Kebijakan privasi aplikasi Silsilah Keluarga. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda."
        keywords={[
          'privasi',
          'privacy',
          'kebijakan',
          'data',
          'silsilah keluarga',
        ]}
        canonical="https://silsilah.zamili.dev/privacy"
      />
      <div className="min-h-screen bg-linear-to-br from-emerald-50 to-cyan-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 mb-8"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Beranda
          </Link>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-linear-to-br from-emerald-600 to-cyan-600 px-8 py-6">
              <h1 className="text-2xl font-bold text-white">
                Kebijakan Privasi
              </h1>
              <p className="mt-1 text-emerald-100 text-sm">
                Terakhir diperbarui: 2 Februari 2026
              </p>
            </div>

            <div className="px-8 py-8 prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
              <p className="lead text-slate-700">
                Privasi Anda sangat penting bagi kami. Kebijakan Privasi ini
                menjelaskan bagaimana Silsilah Keluarga mengumpulkan,
                menggunakan, menyimpan, dan melindungi informasi pribadi Anda.
              </p>

              <h2>1. Informasi yang Kami Kumpulkan</h2>

              <h3>1.1 Informasi yang Anda Berikan</h3>
              <ul>
                <li>
                  <strong>Informasi Akun:</strong> Nama lengkap, alamat email,
                  dan kata sandi saat Anda mendaftar.
                </li>
                <li>
                  <strong>Informasi Profil:</strong> Foto profil, bio, dan
                  informasi tambahan yang Anda pilih untuk ditambahkan.
                </li>
                <li>
                  <strong>Data Silsilah:</strong> Informasi tentang anggota
                  keluarga termasuk nama, tanggal lahir, tempat lahir, foto, dan
                  hubungan keluarga.
                </li>
              </ul>

              <h3>1.2 Informasi yang Dikumpulkan Secara Otomatis</h3>
              <ul>
                <li>
                  <strong>Data Penggunaan:</strong> Informasi tentang bagaimana
                  Anda menggunakan Aplikasi, termasuk halaman yang dikunjungi
                  dan fitur yang digunakan.
                </li>
                <li>
                  <strong>Informasi Perangkat:</strong> Jenis perangkat, sistem
                  operasi, dan browser yang Anda gunakan.
                </li>
                <li>
                  <strong>Log Data:</strong> Alamat IP, waktu akses, dan
                  aktivitas dalam Aplikasi.
                </li>
              </ul>

              <h2>2. Bagaimana Kami Menggunakan Informasi Anda</h2>
              <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
              <ul>
                <li>Menyediakan dan memelihara layanan Aplikasi.</li>
                <li>Memproses pendaftaran dan mengelola akun Anda.</li>
                <li>Menampilkan dan mengelola data silsilah keluarga Anda.</li>
                <li>Mengirim notifikasi terkait aktivitas dalam Aplikasi.</li>
                <li>Meningkatkan dan mengembangkan fitur-fitur baru.</li>
                <li>
                  Mendeteksi dan mencegah aktivitas penipuan atau
                  penyalahgunaan.
                </li>
                <li>Mematuhi kewajiban hukum yang berlaku.</li>
              </ul>

              <h2>3. Berbagi Informasi</h2>
              <p>
                Kami <strong>tidak menjual</strong> informasi pribadi Anda
                kepada pihak ketiga. Informasi Anda hanya dapat dibagikan dalam
                situasi berikut:
              </p>
              <ul>
                <li>
                  <strong>Dengan Anggota Keluarga:</strong> Data silsilah dapat
                  dilihat oleh pengguna lain yang telah diundang atau diberi
                  akses oleh administrator keluarga.
                </li>
                <li>
                  <strong>Dengan Izin Anda:</strong> Ketika Anda secara
                  eksplisit memberikan persetujuan untuk berbagi informasi.
                </li>
                <li>
                  <strong>Untuk Kepatuhan Hukum:</strong> Jika diwajibkan oleh
                  hukum, proses hukum, atau permintaan pemerintah yang sah.
                </li>
              </ul>

              <h2>4. Keamanan Data</h2>
              <p>
                Kami menerapkan langkah-langkah keamanan teknis dan
                organisasional untuk melindungi data Anda, termasuk:
              </p>
              <ul>
                <li>Enkripsi data dalam transit menggunakan HTTPS/TLS.</li>
                <li>Penyimpanan kata sandi dengan hashing yang aman.</li>
                <li>
                  Kontrol akses berbasis peran (Role-Based Access Control).
                </li>
                <li>Audit log untuk aktivitas sensitif.</li>
                <li>Backup data secara berkala.</li>
              </ul>
              <p>
                Meskipun kami berupaya keras melindungi data Anda, tidak ada
                metode transmisi atau penyimpanan yang 100% aman. Kami tidak
                dapat menjamin keamanan absolut.
              </p>

              <h2>5. Penyimpanan Data</h2>
              <ul>
                <li>
                  Data Anda disimpan selama akun Anda aktif atau selama
                  diperlukan untuk menyediakan layanan.
                </li>
                <li>
                  Jika Anda menghapus akun, data pribadi Anda akan dihapus dalam
                  waktu 30 hari, kecuali jika kami diwajibkan menyimpannya untuk
                  keperluan hukum.
                </li>
                <li>
                  Data silsilah mungkin tetap tersimpan jika masih terhubung
                  dengan akun anggota keluarga lain yang aktif.
                </li>
              </ul>

              <h2>6. Hak-Hak Anda</h2>
              <p>Anda memiliki hak untuk:</p>
              <ul>
                <li>
                  <strong>Mengakses:</strong> Meminta salinan data pribadi yang
                  kami simpan tentang Anda.
                </li>
                <li>
                  <strong>Memperbaiki:</strong> Memperbarui atau mengoreksi data
                  yang tidak akurat.
                </li>
                <li>
                  <strong>Menghapus:</strong> Meminta penghapusan data pribadi
                  Anda dalam kondisi tertentu.
                </li>
                <li>
                  <strong>Membatasi:</strong> Meminta pembatasan pemrosesan data
                  Anda.
                </li>
                <li>
                  <strong>Portabilitas:</strong> Meminta data Anda dalam format
                  yang dapat dipindahkan.
                </li>
                <li>
                  <strong>Menarik Persetujuan:</strong> Menarik persetujuan Anda
                  kapan saja untuk pemrosesan yang berdasarkan persetujuan.
                </li>
              </ul>

              <h2>7. Cookie dan Teknologi Pelacakan</h2>
              <p>Kami menggunakan cookie dan teknologi serupa untuk:</p>
              <ul>
                <li>Menjaga sesi login Anda.</li>
                <li>Menyimpan preferensi pengguna.</li>
                <li>
                  Menganalisis penggunaan Aplikasi untuk peningkatan layanan.
                </li>
              </ul>
              <p>
                Anda dapat mengatur browser Anda untuk menolak cookie, namun hal
                ini dapat mempengaruhi fungsionalitas Aplikasi.
              </p>

              <h2>8. Layanan Pihak Ketiga</h2>
              <p>
                Aplikasi mungkin menggunakan layanan pihak ketiga yang memiliki
                kebijakan privasi sendiri, termasuk:
              </p>
              <ul>
                <li>Penyedia layanan hosting dan penyimpanan cloud.</li>
                <li>Layanan email untuk notifikasi.</li>
              </ul>
              <p>
                Kami menyarankan Anda untuk membaca kebijakan privasi layanan
                pihak ketiga tersebut.
              </p>

              <h2>9. Privasi Anak-Anak</h2>
              <p>
                Aplikasi ini tidak ditujukan untuk anak-anak di bawah 13 tahun.
                Kami tidak secara sengaja mengumpulkan informasi pribadi dari
                anak-anak. Jika Anda mengetahui bahwa seorang anak telah
                memberikan data pribadi kepada kami, silakan hubungi kami untuk
                penghapusan.
              </p>

              <h2>10. Perubahan Kebijakan Privasi</h2>
              <p>
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke
                waktu. Perubahan signifikan akan diberitahukan melalui email
                atau notifikasi dalam Aplikasi. Kami menyarankan Anda untuk
                meninjau kebijakan ini secara berkala.
              </p>

              <h2>11. Hubungi Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan atau kekhawatiran tentang
                Kebijakan Privasi ini atau praktik data kami, silakan hubungi:
              </p>
              <div className="bg-slate-50 rounded-lg p-4 not-prose">
                <p className="font-semibold text-slate-900">Nestor Zamili</p>
                <p className="text-slate-600">Pengembang Silsilah Keluarga</p>
                <p className="mt-2 text-slate-600">
                  Website:{' '}
                  <a
                    href="https://zamili.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    zamili.dev
                  </a>
                </p>
                <p className="text-slate-600">Email: nestor@zamili.dev</p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Dengan menggunakan Silsilah Keluarga, Anda menyetujui
                  pengumpulan dan penggunaan informasi sesuai dengan Kebijakan
                  Privasi ini.
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Lihat juga:{' '}
                  <Link
                    to="/terms"
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Syarat dan Ketentuan
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            <p>
              © 2026 Silsilah Keluarga. Dibuat dengan ❤️ oleh{' '}
              <a
                href="https://zamili.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Nestor Zamili
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrivacyPage;
