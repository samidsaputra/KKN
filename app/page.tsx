import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Recycle,
  Users,
  BarChart3,
  Leaf,
  Shield,
  Instagram,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Recycle className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">Bank Sampah Resik Sejahtera</span>
            </div>
            <Link href="/login">
              <Button className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <Shield className="mr-2 h-4 w-4" />
                Login Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-blue-100/50"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bank Sampah Resik Sejahtera
              <span className="text-green-600 block">Solusi Digital Pengelolaan Sampah</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Sistem pengelolaan bank sampah digital yang membantu mengelola data barang, setoran anggota, dan laporan
              keuangan dengan efisien, aman, dan terorganisir.
            </p>
          </div>
        </div>
      </section>

      {/* Instagram & Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ikuti media sosial kami dan hubungi tim untuk informasi lebih lanjut
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Instagram Section */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 hover:border-pink-200 bg-gradient-to-br from-pink-50 to-white">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl group-hover:text-pink-600 transition-colors">
                  Follow Instagram Kami
                </CardTitle>
                <CardDescription className="text-lg">
                  Dapatkan update terbaru dan tips pengelolaan sampah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                    <Instagram className="h-6 w-6 text-pink-600" />
                    <span className="text-gray-700 font-medium">@banksampah_resiksejahtera</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Ikuti Instagram kami untuk melihat kegiatan terbaru, tips pengelolaan sampah, dan informasi program
                    bank sampah.
                  </p>
                  <a
                    href="https://www.instagram.com/banksampah_resiksejahtera"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                      <Instagram className="mr-2 h-5 w-5" />
                      Follow Instagram
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 hover:border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors">Kontak Kami</CardTitle>
                <CardDescription className="text-lg">Hubungi tim kami untuk konsultasi dan informasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <a
                      href="tel:+6281234567890"
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    >
                      +62 815-7557-0731
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <a
                      href="mailto:info@banksampahresik.com"
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    >
                      info@banksampahresik.com
                    </a>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed">
                      Jl. Kunir 6, RT.05/RW.08, Sambiroto
                      <br />
                      Kec. Tembalang, Kota Semarang
                      <br />
                      Jawa Tengah 50276
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 font-medium">Minggu: 08:00 - 10:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Bank Sampah Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Apa itu Bank Sampah?</h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Bank Sampah adalah konsep pengumpulan sampah kering dan dipilah dari rumah tangga. Sampah yang
                  terkumpul kemudian ditimbang dan dihargai dengan sejumlah uang dan dicatat dalam buku tabungan.
                </p>
                <p>
                  Sistem ini membantu mengurangi sampah yang berakhir di TPA, memberikan nilai ekonomis bagi masyarakat,
                  dan menciptakan lingkungan yang lebih bersih dan sehat.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Ramah Lingkungan</h3>
                    <p className="text-gray-600">
                      Mengurangi sampah yang masuk ke TPA dan menciptakan ekonomi sirkular
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Pemberdayaan Masyarakat</h3>
                    <p className="text-gray-600">Memberikan nilai ekonomis dari sampah dan edukasi lingkungan</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Jenis Sampah yang Diterima</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="text-3xl mb-3">📄</div>
                  <div className="font-semibold text-gray-900">Kertas</div>
                  <div className="text-sm text-gray-600 mt-1">Koran, majalah, kardus</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="text-3xl mb-3">🥤</div>
                  <div className="font-semibold text-gray-900">Plastik</div>
                  <div className="text-sm text-gray-600 mt-1">Botol, kemasan, kantong</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="text-3xl mb-3">🥫</div>
                  <div className="font-semibold text-gray-900">Logam</div>
                  <div className="text-sm text-gray-600 mt-1">Kaleng, aluminium</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="text-3xl mb-3">🍶</div>
                  <div className="font-semibold text-gray-900">Kaca</div>
                  <div className="text-sm text-gray-600 mt-1">Botol, pecahan kaca</div>
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
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Leaf className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lingkungan Bersih</h3>
              <p className="text-gray-600 leading-relaxed">
                Mengurangi volume sampah di TPA dan mencegah pencemaran lingkungan
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ekonomi Masyarakat</h3>
              <p className="text-gray-600 leading-relaxed">
                Memberikan penghasilan tambahan bagi masyarakat dari sampah rumah tangga
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pengelolaan Efisien</h3>
              <p className="text-gray-600 leading-relaxed">
                Sistem digital memudahkan monitoring dan evaluasi program bank sampah
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Maps Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lokasi Kami</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kunjungi kantor Bank Sampah Resik Sejahtera Semarang untuk konsultasi langsung
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Map */}
            <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-500">
              <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-4 shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.7766309348576!2d110.45048469999999!3d-7.035518799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708dbae6b0a815%3A0xe15c68a9f505a3c8!2sBank%20sampah%20resik%20sejahtera%20Semarang!5e0!3m2!1sid!2sid!4v1753116219583!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Bank Sampah Resik Sejahtera - Jl. Kunir 6, Tembalang, Semarang"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Bank Sampah Resik Sejahtera</h3>
                <p className="text-gray-600">Jl. Kunir 6, Sambiroto, Tembalang, Semarang</p>
              </div>
            </div>

            {/* Location Info */}
            <div className="space-y-6">
              <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <MapPin className="mr-3 h-6 w-6 text-red-600" />
                    Alamat Lengkap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Jl. Kunir 6, RT.05/RW.08, Sambiroto
                    <br />
                    Kecamatan Tembalang
                    <br />
                    Kota Semarang, Jawa Tengah
                    <br />
                    Indonesia 50276
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Clock className="mr-3 h-6 w-6 text-blue-600" />
                    Jam Operasional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="font-medium">Minggu</span>
                      <span className="text-green-400 font-semibold">08.00 - 10.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Phone className="mr-3 h-6 w-6 text-green-600" />
                    Informasi Kontak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <a
                      href="tel:+6281234567890"
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group"
                    >
                      <Phone className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700 group-hover:text-green-600 font-medium">+62 815-7557-0731</span>
                    </a>
                    <a
                      href="mailto:info@banksampahresik.com"
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <Mail className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                        info@banksampahresik.com
                      </span>
                    </a>
                    <a
                      href="https://www.instagram.com/banksampah_resiksejahtera"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-pink-50 transition-colors group"
                    >
                      <Instagram className="h-5 w-5 text-pink-600 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700 group-hover:text-pink-600 font-medium">
                        @banksampah_resiksejahtera
                      </span>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-pink-600" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Recycle className="h-8 w-8 text-green-400" />
                <span className="text-xl font-bold">Bank Sampah Resik Sejahtera</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Sistem pengelolaan bank sampah digital untuk lingkungan yang lebih bersih dan berkelanjutan
              </p>
              <a href="https://www.instagram.com/banksampah_resiksejahtera" target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-gray-600 hover:bg-gray-800 hover:border-pink-400 transition-all duration-300"
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  Follow Us
                </Button>
              </a>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <div className="space-y-3 text-gray-400">
                <a href="tel:+6281234567890" className="flex items-center space-x-2 hover:text-white transition-colors">
                  <Phone className="h-4 w-4" />
                  <span>+62 812-3456-7890</span>
                </a>
                <a
                  href="mailto:info@banksampahresik.com"
                  className="flex items-center space-x-2 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>info@banksampahresik.com</span>
                </a>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>
                    Jl. Kunir 6, Sambiroto, Tembalang
                    <br />
                    Kota Semarang, Jawa Tengah 50276
                  </span>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Jam Operasional</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex justify-between">
                  <span>Minggu</span>
                  <span className="text-green-400 font-semibold">08.00 - 10.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Bank Sampah Resik Sejahtera. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
