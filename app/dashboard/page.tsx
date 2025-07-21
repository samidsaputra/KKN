"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Package, Users, FileText, TrendingUp, LogOut, Download, Upload, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Stats {
  totalBarang: number
  totalSetoran: number
  totalAnggota: number
  totalNilai: number
}

interface ChartData {
  month: string
  setoran: number
  nilai: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBarang: 0,
    totalSetoran: 0,
    totalAnggota: 0,
    totalNilai: 0,
  })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [pieData, setPieData] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializeDashboard = async () => {
      // Check user authentication first
      const demoUser = localStorage.getItem("demo_user")
      if (!demoUser) {
        router.push("/login")
        return
      }

      setUser(JSON.parse(demoUser))

      // Load data after user check
      loadDemoData()
      setIsLoading(false)
    }

    initializeDashboard()
  }, [])

  const checkUser = () => {
    const demoUser = localStorage.getItem("demo_user")
    if (!demoUser) {
      return false
    }
    setUser(JSON.parse(demoUser))
    return true
  }

  const loadDemoData = () => {
    try {
      // Load demo data from localStorage or set defaults
      const barang = JSON.parse(localStorage.getItem("barang") || "[]")
      const setoran = JSON.parse(localStorage.getItem("setoran") || "[]")

      const uniqueAnggota = new Set(setoran.map((s: any) => s.nama_anggota)).size
      const totalNilai = setoran.reduce((sum: number, s: any) => sum + s.total_harga, 0)

      setStats({
        totalBarang: barang.length,
        totalSetoran: setoran.length,
        totalAnggota: uniqueAnggota,
        totalNilai: totalNilai,
      })

      // Generate sample chart data based on actual data or use defaults
      const sampleChartData = [
        {
          month: "Jan",
          setoran: Math.max(1, Math.floor(setoran.length * 0.1)),
          nilai: Math.max(100000, totalNilai * 0.1),
        },
        {
          month: "Feb",
          setoran: Math.max(1, Math.floor(setoran.length * 0.15)),
          nilai: Math.max(150000, totalNilai * 0.15),
        },
        {
          month: "Mar",
          setoran: Math.max(1, Math.floor(setoran.length * 0.12)),
          nilai: Math.max(120000, totalNilai * 0.12),
        },
        {
          month: "Apr",
          setoran: Math.max(1, Math.floor(setoran.length * 0.18)),
          nilai: Math.max(180000, totalNilai * 0.18),
        },
        {
          month: "May",
          setoran: Math.max(1, Math.floor(setoran.length * 0.14)),
          nilai: Math.max(140000, totalNilai * 0.14),
        },
        {
          month: "Jun",
          setoran: Math.max(1, Math.floor(setoran.length * 0.2)),
          nilai: Math.max(200000, totalNilai * 0.2),
        },
      ]
      setChartData(sampleChartData)

      // Generate sample pie data based on actual categories or use defaults
      const kategoriCount = barang.reduce((acc: any, item: any) => {
        acc[item.kategori] = (acc[item.kategori] || 0) + 1
        return acc
      }, {})

      const samplePieData =
        Object.keys(kategoriCount).length > 0
          ? Object.entries(kategoriCount).map(([name, value]) => ({ name, value }))
          : [
              { name: "Plastik", value: 45 },
              { name: "Kertas", value: 30 },
              { name: "Logam", value: 15 },
              { name: "Kaca", value: 10 },
            ]

      setPieData(samplePieData)
    } catch (error) {
      console.error("Error loading demo data:", error)
      // Set default values if there's an error
      setStats({
        totalBarang: 0,
        totalSetoran: 0,
        totalAnggota: 0,
        totalNilai: 0,
      })
      setChartData([])
      setPieData([])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("demo_user")
    toast({
      title: "Berhasil",
      description: "Logout berhasil",
    })
    router.push("/")
  }

  const handleBackupData = () => {
    try {
      const barang = JSON.parse(localStorage.getItem("barang") || "[]")
      const setoran = JSON.parse(localStorage.getItem("setoran") || "[]")

      const backupData = {
        timestamp: new Date().toISOString(),
        barang: barang,
        setoran: setoran,
      }

      const dataStr = JSON.stringify(backupData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `backup-bank-sampah-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Berhasil",
        description: "Data berhasil dibackup",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal backup data",
        variant: "destructive",
      })
    }
  }

  const handleRestoreData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const backupData = JSON.parse(text)

        if (backupData.barang) {
          localStorage.setItem("barang", JSON.stringify(backupData.barang))
        }
        if (backupData.setoran) {
          localStorage.setItem("setoran", JSON.stringify(backupData.setoran))
        }

        toast({
          title: "Berhasil",
          description: "Data berhasil direstore",
        })

        loadDemoData() // Reload data
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal restore data. Pastikan file backup valid.",
          variant: "destructive",
        })
      }
    }
    input.click()
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Recycle className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  // Show login redirect if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting to login...</p>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Recycle className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">Bank Sampah Digital</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Mode Notice */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Mode Demo Aktif</p>
                <p className="text-blue-700">
                  Data disimpan sementara di browser. Gunakan fitur backup untuk menyimpan data permanen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Bank Sampah</h1>
          <p className="text-gray-600">Kelola data bank sampah Anda dengan mudah</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jenis Barang</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBarang}</div>
              <p className="text-xs text-muted-foreground">Jenis sampah terdaftar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Setoran</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSetoran}</div>
              <p className="text-xs text-muted-foreground">Transaksi setoran</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnggota}</div>
              <p className="text-xs text-muted-foreground">Anggota aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {stats.totalNilai.toLocaleString("id-ID")}</div>
              <p className="text-xs text-muted-foreground">Nilai total setoran</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Trend Setoran Bulanan</CardTitle>
              <CardDescription>Grafik jumlah setoran per bulan</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="setoran" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribusi Kategori Sampah</CardTitle>
              <CardDescription>Persentase berat per kategori</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Backup Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Backup & Restore Data</CardTitle>
            <CardDescription>Kelola backup data untuk keamanan sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleBackupData} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Backup Data
              </Button>
              <Button onClick={handleRestoreData} variant="outline" className="flex-1 bg-transparent">
                <Upload className="mr-2 h-4 w-4" />
                Restore Data
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">Backup data secara berkala untuk mencegah kehilangan data</p>
          </CardContent>
        </Card>

        {/* Menu Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/barang">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Data Master Barang</CardTitle>
                <CardDescription>Kelola data jenis sampah, kategori, dan harga per kilogram</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Kelola Barang</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/setoran">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Setoran Anggota</CardTitle>
                <CardDescription>Catat setoran sampah dari anggota dan hitung nilai setoran</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Input Setoran</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/laporan">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Laporan Bulanan</CardTitle>
                <CardDescription>Generate dan download laporan bulanan dalam format Excel</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Buat Laporan</Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
