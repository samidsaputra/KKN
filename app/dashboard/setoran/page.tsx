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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

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
    const { data, error } = await supabase
      .from("setoran")
      .select("*")
      .order("tanggal", { ascending: false })
    if (!error) setSetoran(data || [])
  }

  const resetForm = () => {
    setFormData({ namaAnggota: "", barangId: "", berat: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const barangDipilih = barang.find((b) => b.id === formData.barangId)
    const berat = parseFloat(formData.berat)

    if (!formData.namaAnggota || !formData.barangId || isNaN(berat)) {
      toast({
        title: "Form tidak lengkap",
        description: "Pastikan semua kolom telah diisi dengan benar.",
        variant: "destructive",
      })
      return
    }

    if (berat <= 0) {
      toast({
        title: "Berat tidak valid",
        description: "Berat harus lebih dari 0 kg.",
        variant: "destructive",
      })
      return
    }

    if (!barangDipilih) {
      toast({
        title: "Barang tidak ditemukan",
        description: "Silakan pilih barang yang tersedia.",
        variant: "destructive",
      })
      return
    }

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

    if (error) {
      toast({
        title: "Gagal menyimpan setoran",
        description: "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Setoran berhasil",
        description: `Setoran dari ${formData.namaAnggota} telah disimpan.`,
      })
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
    <div className="p-4 space-y-4">
      <Link href="/dashboard">
        <Button variant="outline" size="sm" className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Data Setoran</CardTitle>
          <CardDescription>Catatan setoran anggota bank sampah</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Setoran
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Tambah Setoran</DialogTitle>
                  <DialogDescription>Masukkan data setoran baru</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label>Nama Anggota</Label>
                    <Input
                      value={formData.namaAnggota}
                      onChange={(e) =>
                        setFormData({ ...formData, namaAnggota: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Jenis Barang</Label>
                    <Select
                      value={formData.barangId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, barangId: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Barang" />
                      </SelectTrigger>
                      <SelectContent>
                        {barang.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.nama} (Rp{b.harga}/kg)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Berat (kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.berat}
                      onChange={(e) =>
                        setFormData({ ...formData, berat: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Barang</TableHead>
                <TableHead>Berat (kg)</TableHead>
                <TableHead>Harga/Kg</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {setoran.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{formatDate(s.tanggal)}</TableCell>
                  <TableCell>{s.nama_anggota}</TableCell>
                  <TableCell>{s.nama_barang}</TableCell>
                  <TableCell>{s.berat}</TableCell>
                  <TableCell>Rp{s.harga_per_kg}</TableCell>
                  <TableCell>Rp{s.total_harga}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default SetoranPage
