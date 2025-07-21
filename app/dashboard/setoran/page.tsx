"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Recycle, Plus, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface Barang {
  id: string
  nama: string
  kategori: string
  harga: number
  satuan: string
}

interface Setoran {
  id: string
  nama_anggota: string
  tanggal: string
  barang_id: string
  nama_barang: string
  berat: number
  harga_per_kg: number
  total_harga: number
}

export default function SetoranAnggota() {
  const [barang, setBarang] = useState<Barang[]>([])
  const [setoran, setSetoran] = useState<Setoran[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    namaAnggota: "",
    barangId: "",
    berat: "",
  })
  const { toast } = useToast()
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const initializePage = async () => {
      // Check user authentication first
      const demoUser = localStorage.getItem("demo_user")
      if (!demoUser) {
        console.log("No demo user found, redirecting to login")
        router.push("/login")
        return
      }

      console.log("Demo user found:", JSON.parse(demoUser))

      // Load data after user check
      loadData()
      setIsLoading(false)
    }

    initializePage()
  }, []) // Remove router from dependencies to prevent infinite loop

  const loadData = () => {
    try {
      const barangData = JSON.parse(localStorage.getItem("barang") || "[]")
      const setoranData = JSON.parse(localStorage.getItem("setoran") || "[]")

      console.log("Loaded barang data:", barangData)
      console.log("Loaded setoran data:", setoranData)

      setBarang(barangData)
      setSetoran(setoranData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.namaAnggota || !formData.barangId || !formData.berat) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      })
      return
    }

    const selectedBarang = barang.find((b) => b.id === formData.barangId)
    if (!selectedBarang) {
      toast({
        title: "Error",
        description: "Barang tidak ditemukan",
        variant: "destructive",
      })
      return
    }

    try {
      const berat = Number.parseFloat(formData.berat)
      const totalHarga = berat * selectedBarang.harga

      const setoranData = {
        id: Date.now().toString(),
        nama_anggota: formData.namaAnggota,
        tanggal: new Date().toISOString().split("T")[0],
        barang_id: formData.barangId,
        nama_barang: selectedBarang.nama,
        berat: berat,
        harga_per_kg: selectedBarang.harga,
        total_harga: totalHarga,
      }

      const existingSetoran = JSON.parse(localStorage.getItem("setoran") || "[]")
      existingSetoran.push(setoranData)
      localStorage.setItem("setoran", JSON.stringify(existingSetoran))

      setIsDialogOpen(false)
      setFormData({ namaAnggota: "", barangId: "", berat: "" })

      toast({
        title: "Berhasil",
        description: `Setoran ${formData.namaAnggota} berhasil dicatat dengan nilai Rp ${totalHarga.toLocaleString("id-ID")}`,
      })

      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data setoran",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({ namaAnggota: "", barangId: "", berat: "" })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Recycle className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Setoran...</p>
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
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setoran Anggota</h1>
          <p className="text-gray-600">Catat setoran sampah dari anggota bank sampah</p>
        </div>

        {barang.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">Belum ada data barang. Silakan tambah data barang terlebih dahulu.</p>
              <Link href="/dashboard/barang">
                <Button>Kelola Data Barang</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Daftar Setoran</CardTitle>
                  <CardDescription>Riwayat setoran sampah dari anggota</CardDescription>
                </div>
                <Dialog
                  open={isDialogOpen}
                  onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) resetForm()
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Setoran
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Setoran Baru</DialogTitle>
                      <DialogDescription>Catat setoran sampah dari anggota</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="namaAnggota">Nama Anggota</Label>
                          <Input
                            id="namaAnggota"
                            value={formData.namaAnggota}
                            onChange={(e) => setFormData({ ...formData, namaAnggota: e.target.value })}
                            placeholder="Masukkan nama anggota"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="barang">Jenis Barang</Label>
                          <Select
                            value={formData.barangId}
                            onValueChange={(value) => setFormData({ ...formData, barangId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis barang" />
                            </SelectTrigger>
                            <SelectContent>
                              {barang.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.nama} - Rp {item.harga.toLocaleString("id-ID")}/{item.satuan}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="berat">Berat (kg)</Label>
                          <Input
                            id="berat"
                            type="number"
                            step="0.1"
                            value={formData.berat}
                            onChange={(e) => setFormData({ ...formData, berat: e.target.value })}
                            placeholder="Contoh: 2.5"
                          />
                        </div>
                        {formData.barangId && formData.berat && (
                          <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-700">
                              <strong>Perhitungan:</strong>
                              <br />
                              {barang.find((b) => b.id === formData.barangId)?.nama} × {formData.berat} kg × Rp{" "}
                              {barang.find((b) => b.id === formData.barangId)?.harga.toLocaleString("id-ID")} =
                              <span className="font-bold">
                                {" "}
                                Rp{" "}
                                {(
                                  Number.parseFloat(formData.berat) *
                                  (barang.find((b) => b.id === formData.barangId)?.harga || 0)
                                ).toLocaleString("id-ID")}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button type="submit">Simpan Setoran</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {setoran.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Belum ada data setoran</p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Setoran Pertama
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Nama Anggota</TableHead>
                      <TableHead>Jenis Barang</TableHead>
                      <TableHead>Berat (kg)</TableHead>
                      <TableHead>Harga/kg</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {setoran.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(item.tanggal)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.nama_anggota}</TableCell>
                        <TableCell>{item.nama_barang}</TableCell>
                        <TableCell>{item.berat} kg</TableCell>
                        <TableCell>Rp {item.harga_per_kg.toLocaleString("id-ID")}</TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          Rp {item.total_harga.toLocaleString("id-ID")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
