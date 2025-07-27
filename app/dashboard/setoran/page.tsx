"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Plus, Recycle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const SetoranPage = () => {
  const supabase = createClient()
  const [barang, setBarang] = useState<any[]>([])
  const [setoran, setSetoran] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    namaAnggota: "",
    barangId: "",
    berat: "",
  })

  useEffect(() => {
    fetchBarang()
    fetchSetoran()
  }, [])

  const fetchBarang = async () => {
    const { data, error } = await supabase.from("barang").select("*").order("nama")
    if (!error) setBarang(data || [])
  }

  const fetchSetoran = async () => {
    const { data, error } = await supabase.from("setoran").select("*").order("tanggal", { ascending: false })
    if (!error) setSetoran(data || [])
  }

  const resetForm = () => {
    setFormData({ namaAnggota: "", barangId: "", berat: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const barangDipilih = barang.find((b) => b.id === formData.barangId)
    if (!barangDipilih) return

    const berat = parseFloat(formData.berat)
    const totalHarga = berat * barangDipilih.harga

    const { error } = await supabase.from("setoran").insert({
      nama_anggota: formData.namaAnggota,
      tanggal: new Date().toISOString(),
      barang_id: formData.barangId,
      nama_barang: barangDipilih.nama,
      berat,
      harga_per_kg: barangDipilih.harga,
      total_harga: totalHarga,
    })

    if (!error) {
      fetchSetoran()
      setIsDialogOpen(false)
      resetForm()
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}>
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
                              <strong>Perhitungan:</strong><br />
                              {barang.find((b) => b.id === formData.barangId)?.nama} × {formData.berat} kg × Rp{" "}
                              {barang.find((b) => b.id === formData.barangId)?.harga.toLocaleString("id-ID")} =
                              <span className="font-bold">
                                {" "}Rp{" "}
                                {(parseFloat(formData.berat) * (barang.find((b) => b.id === formData.barangId)?.harga || 0)).toLocaleString("id-ID")}
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

export default SetoranPage
