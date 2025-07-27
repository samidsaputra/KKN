"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Package, Users, FileText, TrendingUp, LogOut, Download, Upload, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase"
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FD0", "#FF6F91", "#6A4C93"]

export default function Dashboard() {
  const supabase = createClient()
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      router.push("/login")
    }
  }

useEffect(() => {
  const fetchUserAndData = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
      router.push("/login")
      return
    }

    setUser(user)
    await loadDashboardData()
    setIsLoading(false)
  }

  fetchUserAndData()
}, [])

const loadDashboardData = async () => {
  try {
    const { data: barangData, error: barangError } = await supabase.from("barang").select("*")
    const { data: setoranData, error: setoranError } = await supabase.from("setoran").select("*")

    if (barangError || setoranError) {
      throw new Error(barangError?.message || setoranError?.message)
    }

    const uniqueAnggota = new Set(setoranData.map((s) => s.nama_anggota)).size
    const totalNilai = setoranData.reduce((sum, s) => sum + (typeof s.total_harga === "number" ? s.total_harga : Number(s.total_harga) || 0), 0)

    setStats({
      totalBarang: barangData.length,
      totalSetoran: setoranData.length,
      totalAnggota: uniqueAnggota,
      totalNilai,
    })

    // Line chart: agregasi per bulan
    const groupedByMonth: { [key: string]: { setoran: number; nilai: number } } = {}
    setoranData.forEach((s) => {
      const month =
        s.tanggal && (typeof s.tanggal === "string" || typeof s.tanggal === "number" || s.tanggal instanceof Date)
          ? new Date(s.tanggal).toLocaleString("default", { month: "short" })
          : "Unknown"
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = { setoran: 0, nilai: 0 }
      }
      groupedByMonth[month].setoran += 1
      groupedByMonth[month].nilai += typeof s.total_harga === "number" ? s.total_harga : Number(s.total_harga) || 0
    })

    const chartArray = Object.entries(groupedByMonth).map(([month, val]) => ({
      month,
      setoran: val.setoran,
      nilai: val.nilai,
    }))
    setChartData(chartArray)

    // Pie chart: kategori barang
    const kategoriCount = barangData.reduce((acc: any, item: any) => {
      acc[item.kategori] = (acc[item.kategori] || 0) + 1
      return acc
    }, {})

    const kategoriPie = Object.entries(kategoriCount).map(([name, value]) => ({ name, value }))
    setPieData(kategoriPie)
  } catch (err) {
    console.error("Error loading Supabase data:", err)
    toast({
      title: "Error",
      description: "Gagal memuat data dari Supabase",
      variant: "destructive",
    })
  }
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
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
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
