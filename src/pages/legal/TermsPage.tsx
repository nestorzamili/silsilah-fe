import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export function TermsPage() {
  return (
    <>
      <SEO
        title="Syarat dan Ketentuan - Silsilah Keluarga"
        description="Syarat dan ketentuan penggunaan aplikasi Silsilah Keluarga. Baca dengan seksama sebelum menggunakan layanan kami."
        keywords={[
          'syarat',
          'ketentuan',
          'terms',
          'conditions',
          'silsilah keluarga',
        ]}
        canonical="https://silsilah.zamili.dev/terms"
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
            <div className="bg-linear-to-r from-emerald-600 to-cyan-600 px-8 py-6">
              <h1 className="text-2xl font-bold text-white">
                Syarat dan Ketentuan
              </h1>
              <p className="mt-1 text-emerald-100 text-sm">
                Terakhir diperbarui: 2 Februari 2026
              </p>
            </div>

            <div className="px-8 py-8 prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
              <p className="lead text-slate-700">
                Selamat datang di Silsilah Keluarga. Dengan mengakses dan
                menggunakan aplikasi ini, Anda menyetujui untuk terikat dengan
                syarat dan ketentuan berikut.
              </p>

              <h2>1. Definisi</h2>
              <ul>
                <li>
                  <strong>"Aplikasi"</strong> merujuk pada Silsilah Keluarga,
                  platform manajemen silsilah keluarga berbasis web.
                </li>
                <li>
                  <strong>"Pengguna"</strong> adalah setiap individu yang
                  mengakses dan menggunakan Aplikasi.
                </li>
                <li>
                  <strong>"Konten"</strong> mencakup semua data, informasi, dan
                  media yang diunggah atau dibuat dalam Aplikasi.
                </li>
                <li>
                  <strong>"Pengembang"</strong> merujuk pada{' '}
                  <a
                    href="https://zamili.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Nestor Zamili
                  </a>{' '}
                  sebagai pembuat dan pengelola Aplikasi.
                </li>
              </ul>

              <h2>2. Penggunaan Layanan</h2>
              <h3>2.1 Kelayakan</h3>
              <p>
                Untuk menggunakan Aplikasi ini, Anda harus berusia minimal 13
                tahun atau memiliki persetujuan dari orang tua atau wali yang
                sah.
              </p>

              <h3>2.2 Akun Pengguna</h3>
              <ul>
                <li>
                  Anda bertanggung jawab menjaga kerahasiaan kredensial akun
                  Anda.
                </li>
                <li>
                  Anda bertanggung jawab atas semua aktivitas yang terjadi di
                  bawah akun Anda.
                </li>
                <li>
                  Anda harus segera memberitahu kami jika terjadi penggunaan
                  tidak sah pada akun Anda.
                </li>
              </ul>

              <h3>2.3 Penggunaan yang Diizinkan</h3>
              <p>Anda setuju untuk menggunakan Aplikasi hanya untuk:</p>
              <ul>
                <li>
                  Mencatat dan mengelola informasi silsilah keluarga Anda.
                </li>
                <li>
                  Berbagi informasi keluarga dengan anggota keluarga yang
                  berwenang.
                </li>
                <li>Tujuan pribadi dan non-komersial.</li>
              </ul>

              <h2>3. Konten Pengguna</h2>
              <h3>3.1 Kepemilikan</h3>
              <p>
                Anda tetap memiliki hak atas semua Konten yang Anda unggah ke
                Aplikasi. Dengan mengunggah Konten, Anda memberikan kami lisensi
                non-eksklusif untuk menyimpan dan menampilkan Konten tersebut
                dalam konteks layanan kami.
              </p>

              <h3>3.2 Tanggung Jawab Konten</h3>
              <ul>
                <li>
                  Anda bertanggung jawab penuh atas akurasi dan kebenaran Konten
                  yang Anda unggah.
                </li>
                <li>
                  Anda menjamin bahwa Konten tidak melanggar hak pihak ketiga.
                </li>
                <li>
                  Anda tidak akan mengunggah konten yang melanggar hukum,
                  menyinggung, atau berbahaya.
                </li>
              </ul>

              <h2>4. Privasi dan Keamanan Data</h2>
              <p>
                Pengumpulan dan penggunaan data pribadi Anda diatur dalam{' '}
                <Link
                  to="/privacy"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Kebijakan Privasi
                </Link>{' '}
                kami. Dengan menggunakan Aplikasi, Anda menyetujui praktik yang
                dijelaskan dalam Kebijakan Privasi tersebut.
              </p>

              <h2>5. Hak Kekayaan Intelektual</h2>
              <p>
                Seluruh hak kekayaan intelektual atas Aplikasi, termasuk namun
                tidak terbatas pada desain, kode sumber, logo, dan konten asli,
                adalah milik Pengembang. Anda tidak diperkenankan menyalin,
                memodifikasi, atau mendistribusikan bagian mana pun dari
                Aplikasi tanpa izin tertulis.
              </p>

              <h2>6. Batasan Tanggung Jawab</h2>
              <ul>
                <li>
                  Aplikasi disediakan "sebagaimana adanya" tanpa jaminan apa
                  pun, baik tersurat maupun tersirat.
                </li>
                <li>
                  Pengembang tidak bertanggung jawab atas kerugian langsung,
                  tidak langsung, insidental, atau konsekuensial yang timbul
                  dari penggunaan Aplikasi.
                </li>
                <li>
                  Pengembang tidak menjamin ketersediaan layanan secara
                  terus-menerus dan berhak melakukan pemeliharaan atau pembaruan
                  sewaktu-waktu.
                </li>
              </ul>

              <h2>7. Penghentian</h2>
              <p>
                Kami berhak menangguhkan atau menghentikan akses Anda ke
                Aplikasi kapan saja, dengan atau tanpa pemberitahuan, jika Anda
                melanggar Syarat dan Ketentuan ini atau karena alasan lain yang
                kami anggap perlu.
              </p>

              <h2>8. Perubahan Syarat dan Ketentuan</h2>
              <p>
                Kami dapat memperbarui Syarat dan Ketentuan ini dari waktu ke
                waktu. Perubahan akan berlaku segera setelah dipublikasikan di
                Aplikasi. Penggunaan berkelanjutan atas Aplikasi setelah
                perubahan dianggap sebagai penerimaan Anda terhadap syarat yang
                diperbarui.
              </p>

              <h2>9. Hukum yang Berlaku</h2>
              <p>
                Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai
                dengan hukum Republik Indonesia. Setiap sengketa yang timbul
                akan diselesaikan melalui musyawarah mufakat, dan jika tidak
                tercapai, akan diselesaikan melalui pengadilan yang berwenang di
                Indonesia.
              </p>

              <h2>10. Hubungi Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini,
                silakan hubungi kami melalui:
              </p>
              <ul>
                <li>
                  Website:{' '}
                  <a
                    href="https://zamili.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    zamili.dev
                  </a>
                </li>
                <li>Email: nestor@zamili.dev</li>
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Dengan menggunakan Silsilah Keluarga, Anda menyatakan telah
                  membaca, memahami, dan menyetujui Syarat dan Ketentuan ini.
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

export default TermsPage;
