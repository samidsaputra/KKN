import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Users, BarChart3, Leaf, CheckCircle, Shield, Database, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Recycle className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">Bank Sampah Digital</span>
            </div>
            <Link href="/login">
              <Button className="bg-green-600 hover:bg-green-700">
                <Shield className="mr-2 h-4 w-4" />
                Login Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bank Sampah Digital
            <span className="text-green-600 block">Solusi Pengelolaan Sampah Modern</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistem pengelolaan bank sampah digital yang membantu mengelola data barang, setoran anggota, dan laporan
            keuangan dengan efisien, aman, dan terorganisir menggunakan teknologi cloud.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                <Shield className="mr-2 h-5 w-5" />
                Akses Sistem
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Keunggulan Sistem Kami</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Platform digital terdepan untuk pengelolaan bank sampah yang efisien dan modern
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Database Cloud</CardTitle>
                <CardDescription>Data tersimpan aman di cloud dengan backup otomatis</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Penyimpanan cloud Supabase
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Backup otomatis real-time
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Akses dari mana saja
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Analitik & Grafik</CardTitle>
                <CardDescription>Visualisasi data dengan grafik interaktif dan real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Dashboard analitik lengkap
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Grafik trend bulanan
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Laporan visual interaktif
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Keamanan Tinggi</CardTitle>
                <CardDescription>Sistem login aman dengan enkripsi data tingkat enterprise</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Autentikasi Supabase Auth
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Enkripsi data end-to-end
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Session management aman
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Bank Sampah Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Apa itu Bank Sampah?</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Bank Sampah adalah konsep pengumpulan sampah kering dan dipilah dari rumah tangga. Sampah yang
                  terkumpul kemudian ditimbang dan dihargai dengan sejumlah uang dan dicatat dalam buku tabungan.
                </p>
                <p>
                  Sistem ini membantu mengurangi sampah yang berakhir di TPA, memberikan nilai ekonomis bagi masyarakat,
                  dan menciptakan lingkungan yang lebih bersih dan sehat.
                </p>
                <p>
                  Dengan teknologi digital, pengelolaan bank sampah menjadi lebih efisien, transparan, dan mudah diakses
                  oleh semua pihak yang terlibat.
                </p>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Ramah Lingkungan</h3>
                    <p className="text-sm text-gray-600">
                      Mengurangi sampah yang masuk ke TPA dan menciptakan ekonomi sirkular
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pemberdayaan Masyarakat</h3>
                    <p className="text-sm text-gray-600">
                      Memberikan nilai ekonomis dari sampah dan edukasi lingkungan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Jenis Sampah yang Diterima</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">📄</div>
                  <div className="font-medium">Kertas</div>
                  <div className="text-sm text-gray-600">Koran, majalah, kardus</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🥤</div>
                  <div className="font-medium">Plastik</div>
                  <div className="text-sm text-gray-600">Botol, kemasan, kantong</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🥫</div>
                  <div className="font-medium">Logam</div>
                  <div className="text-sm text-gray-600">Kaleng, aluminium</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">🍶</div>
                  <div className="font-medium">Kaca</div>
                  <div className="text-sm text-gray-600">Botol, pecahan kaca</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Manfaat Bank Sampah</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dampak positif yang dihasilkan dari pengelolaan bank sampah yang baik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lingkungan Bersih</h3>
              <p className="text-gray-600">Mengurangi volume sampah di TPA dan mencegah pencemaran lingkungan</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ekonomi Masyarakat</h3>
              <p className="text-gray-600">Memberikan penghasilan tambahan bagi masyarakat dari sampah rumah tangga</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pengelolaan Efisien</h3>
              <p className="text-gray-600">Sistem digital memudahkan monitoring dan evaluasi program bank sampah</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Memulai Pengelolaan Bank Sampah Digital?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Bergabunglah dengan revolusi digital dalam pengelolaan sampah untuk masa depan yang lebih berkelanjutan
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Shield className="mr-2 h-5 w-5" />
              Akses Sistem Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Recycle className="h-8 w-8 text-green-400" />
            <span className="text-2xl font-bold">Bank Sampah Digital</span>
          </div>
          <p className="text-gray-400 mb-4">
            Sistem pengelolaan bank sampah digital untuk lingkungan yang lebih bersih dan berkelanjutan
          </p>
          <p className="text-sm text-gray-500">© 2024 Bank Sampah Digital. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  )
}
