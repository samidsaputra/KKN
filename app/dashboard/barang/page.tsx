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
import { Recycle, Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
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

export default function DataBarang() {
  const [barang, setBarang] = useState<Barang[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBarang, setEditingBarang] = useState<Barang | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    harga: "",
    satuan: "kg",
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
      loadBarang()
      setIsLoading(false)
    }

    initializePage()
  }, []) // Remove router from dependencies to prevent infinite loop

  const loadBarang = () => {
    try {
      const data = JSON.parse(localStorage.getItem("barang") || "[]")
      console.log("Loaded barang data:", data)
      setBarang(data)
    } catch (error) {
      console.error("Error loading barang:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nama || !formData.kategori || !formData.harga) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      })
      return
    }

    try {
      const barangData = {
        id: editingBarang?.id || Date.now().toString(),
        nama: formData.nama,
        kategori: formData.kategori,
        harga: Number.parseFloat(formData.harga),
        satuan: formData.satuan,
      }

      const existingBarang = JSON.parse(localStorage.getItem("barang") || "[]")

      if (editingBarang) {
        const updatedBarang = existingBarang.map((item: any) => (item.id === editingBarang.id ? barangData : item))
        localStorage.setItem("barang", JSON.stringify(updatedBarang))
        toast({
          title: "Berhasil",
          description: "Data barang berhasil diupdate",
        })
      } else {
        existingBarang.push(barangData)
        localStorage.setItem("barang", JSON.stringify(existingBarang))
        toast({
          title: "Berhasil",
          description: "Data barang berhasil ditambahkan",
        })
      }

      setIsDialogOpen(false)
      setEditingBarang(null)
      setFormData({ nama: "", kategori: "", harga: "", satuan: "kg" })
      loadBarang()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data barang",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (item: Barang) => {
    setEditingBarang(item)
    setFormData({
      nama: item.nama,
      kategori: item.kategori,
      harga: item.harga.toString(),
      satuan: item.satuan,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    try {
      const existingBarang = JSON.parse(localStorage.getItem("barang") || "[]")
      const updatedBarang = existingBarang.filter((item: any) => item.id !== id)
      localStorage.setItem("barang", JSON.stringify(updatedBarang))

      toast({
        title: "Berhasil",
        description: "Data barang berhasil dihapus",
      })
      loadBarang()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus data barang",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({ nama: "", kategori: "", harga: "", satuan: "kg" })
    setEditingBarang(null)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Recycle className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Data Barang...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Master Barang</h1>
          <p className="text-gray-600">Kelola data jenis sampah dan harga per kilogram</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Daftar Barang</CardTitle>
                <CardDescription>Kelola jenis sampah yang diterima di bank sampah</CardDescription>
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
                    Tambah Barang
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingBarang ? "Edit Barang" : "Tambah Barang Baru"}</DialogTitle>
                    <DialogDescription>
                      {editingBarang ? "Update informasi barang" : "Masukkan informasi barang baru"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nama">Nama Barang</Label>
                        <Input
                          id="nama"
                          value={formData.nama}
                          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                          placeholder="Contoh: Botol Plastik"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="kategori">Kategori</Label>
                        <Select
                          value={formData.kategori}
                          onValueChange={(value) => setFormData({ ...formData, kategori: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Plastik">Plastik</SelectItem>
                            <SelectItem value="Kertas">Kertas</SelectItem>
                            <SelectItem value="Logam">Logam</SelectItem>
                            <SelectItem value="Kaca">Kaca</SelectItem>
                            <SelectItem value="Elektronik">Elektronik</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="harga">Harga per Kg (Rp)</Label>
                        <Input
                          id="harga"
                          type="number"
                          value={formData.harga}
                          onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                          placeholder="Contoh: 2000"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="satuan">Satuan</Label>
                        <Select
                          value={formData.satuan}
                          onValueChange={(value) => setFormData({ ...formData, satuan: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kilogram (kg)</SelectItem>
                            <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">{editingBarang ? "Update" : "Simpan"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {barang.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Belum ada data barang</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Barang Pertama
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barang.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell>{item.kategori}</TableCell>
                      <TableCell>Rp {item.harga.toLocaleString("id-ID")}</TableCell>
                      <TableCell>{item.satuan}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
