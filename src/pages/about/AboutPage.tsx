import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import {
  HeartIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="Tentang Silsilah"
        description="Sejarah pencatatan silsilah keluarga oleh Pdt. Kristian Laia (Ama Miseri) berdasarkan penuturan Mage'aro Duha."
      />

      <div className="h-full flex flex-col bg-slate-50">
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Tentang Silsilah
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sejarah pencatatan dan perjalanan silsilah keluarga
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="space-y-6">
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Sejarah Pencatatan
                </h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Silsilah keluarga ini dicatat oleh{' '}
                    <span className="font-semibold text-slate-800">
                      Pdt. Kristian Laia
                    </span>{' '}
                    <span className="text-slate-500">(Ama Miseri)</span>,
                    berdasarkan penuturan lisan dari kakek kami,{' '}
                    <span className="font-semibold text-slate-800">
                      Mage'aro Duha
                    </span>
                    .
                  </p>

                  <p>
                    Generasi tertua yang berhasil dicatat dalam silsilah ini
                    dimulai dari{' '}
                    <span className="font-semibold text-slate-800">
                      Bawaulu Duha
                    </span>
                    , yang menjadi titik awal penelusuran garis keturunan
                    keluarga.
                  </p>

                  <p>
                    Pencatatan silsilah ini dirampungkan pada{' '}
                    <span className="font-semibold text-slate-800">
                      Februari 2015
                    </span>{' '}
                    oleh Pdt. Kristian Laia, setelah melalui proses pengumpulan
                    informasi yang cermat dari berbagai sumber dalam keluarga.
                  </p>
                </div>
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                  Perjalanan Silsilah
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                        <UserGroupIcon className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Penuturan Lisan
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Mage'aro Duha menuturkan riwayat keluarga yang
                        diwariskan secara turun-temurun dari generasi ke
                        generasi.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                        <DocumentTextIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Pencatatan Tertulis
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Pdt. Kristian Laia (Ama Miseri) mencatat silsilah ini
                        dengan teliti, mengabadikan memori keluarga dalam bentuk
                        tertulis.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Februari 2015
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Pencatatan silsilah selesai dan dicetak pada kertas
                        untuk didistribusikan kepada anggota keluarga.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                        <svg
                          className="h-5 w-5 text-violet-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Digitalisasi
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Catatan silsilah dikonversi ke format digital melalui
                        aplikasi web ini agar dapat diakses dengan mudah dan
                        dilestarikan untuk generasi mendatang.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <HeartIcon className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>
                      Terima kasih kepada para leluhur dan semua pihak yang
                      telah menjaga silsilah ini dengan penuh dedikasi.
                    </span>
                  </p>
                </div>
              </section>

              <div className="text-center py-4">
                <p className="text-sm text-slate-500">
                  Dikembangkan oleh{' '}
                  <a
                    href="https://zamili.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Nestor Zamili
                  </a>
                </p>
                <div className="flex items-center justify-center gap-3 mt-2 text-sm text-slate-400">
                  <Link
                    to="/terms"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Ketentuan
                  </Link>
                  <span>•</span>
                  <Link
                    to="/privacy"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Privasi
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
