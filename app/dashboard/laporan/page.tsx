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
import { Recycle, Download, ArrowLeft, User, Minus, Plus, TrendingUp, TrendingDown, FileText } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

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

interface Penarikan {
  id: string
  nama_anggota: string
  tanggal: string
  jumlah: number
  keterangan: string
}

interface TransaksiKeuangan {
  id: string
  tanggal: string
  jenis: "masuk" | "keluar"
  kategori: string
  keterangan: string
  jumlah: number
}

interface BukuTabungan {
  tanggal: string
  nama_barang: string
  harga: number
  kg: number
  masuk: number
  keluar: number
  saldo: number
  paraf: string
}

interface LaporanKeuangan {
  totalMasuk: number
  totalKeluar: number
  saldoAkhir: number
  transaksiMasuk: TransaksiKeuangan[]
  transaksiKeluar: TransaksiKeuangan[]
}

export default function LaporanBulanan() {
  const [setoran, setSetoran] = useState<Setoran[]>([])
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedAnggota, setSelectedAnggota] = useState("")
  const [laporanType, setLaporanType] = useState<"bulanan" | "per-anggota">("bulanan")
  const [bukuTabungan, setBukuTabungan] = useState<BukuTabungan[]>([])
  const [laporanKeuangan, setLaporanKeuangan] = useState<LaporanKeuangan | null>(null)
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)
  const [withdrawForm, setWithdrawForm] = useState({
    namaAnggota: "",
    jumlah: "",
    keterangan: "",
  })
  const [transactionForm, setTransactionForm] = useState({
    jenis: "masuk" as "masuk" | "keluar",
    kategori: "",
    keterangan: "",
    jumlah: "",
  })
  const { toast } = useToast()
  const supabase = createClient()
  const router = useRouter()

  // Add these new state variables at the top with other useState declarations:
  const [rekapBulanan, setRekapBulanan] = useState<any>(null)
  // 1. Tambahkan state loading import jika perlu
  const [importLoading, setImportLoading] = useState(false)

  useEffect(() => {
    (async () => {
      await loadData()
      const now = new Date()
      setSelectedMonth((now.getMonth() + 1).toString().padStart(2, "0"))
      setSelectedYear(now.getFullYear().toString())
    })()
  }, [router])

  const loadData = async () => {
    try {
      const { data: setoranData, error: setoranError } = await supabase.from("setoran").select("*")
      if (setoranError) throw setoranError
      setSetoran(
        (setoranData || []).map((item: any) => ({
          id: String(item.id),
          nama_anggota: String(item.nama_anggota),
          tanggal: String(item.tanggal),
          barang_id: String(item.barang_id),
          nama_barang: String(item.nama_barang),
          berat: Number(item.berat),
          harga_per_kg: Number(item.harga_per_kg),
          total_harga: Number(item.total_harga),
        }))
      )
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const getUniqueAnggota = () => {
    const anggotaSet = new Set(setoran.map((s: any) => s.nama_anggota))
    return Array.from(anggotaSet).sort()
  }

  const generateBukuTabungan = () => {
    if (!selectedAnggota) {
      toast({
        title: "Error",
        description: "Pilih nama anggota terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    // Filter setoran untuk anggota yang dipilih
    const setoranAnggota = setoran.filter((s: any) => s.nama_anggota === selectedAnggota)

    // Gabungkan dan urutkan berdasarkan tanggal
    const allTransactions: any[] = [
      ...setoranAnggota.map((s) => ({
        ...s,
        type: "setoran",
      })),
    ].sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())

    let saldo = 0
    const bukuData: BukuTabungan[] = []

    allTransactions.forEach((transaction) => {
      if (transaction.type === "setoran") {
        saldo += transaction.total_harga
        bukuData.push({
          tanggal: transaction.tanggal,
          nama_barang: transaction.nama_barang,
          harga: transaction.harga_per_kg,
          kg: transaction.berat,
          masuk: transaction.total_harga,
          keluar: 0,
          saldo: saldo,
          paraf: "",
        })
      }
    })

    setBukuTabungan(bukuData)
    toast({
      title: "Berhasil",
      description: "Buku tabungan berhasil dibuat",
    })
  }

  const generateLaporanKeuangan = () => {
    if (!selectedMonth || !selectedYear) {
      toast({
        title: "Error",
        description: "Pilih bulan dan tahun terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    // Filter setoran berdasarkan bulan dan tahun
    const filteredSetoran = setoran.filter((s: any) => {
      const date = new Date(s.tanggal)
      return (
        date.getMonth() + 1 === Number.parseInt(selectedMonth) && date.getFullYear() === Number.parseInt(selectedYear)
      )
    })

    if (filteredSetoran.length === 0) {
      toast({
        title: "Info",
        description: "Tidak ada data setoran untuk periode yang dipilih",
        variant: "destructive",
      })
      return
    }

    // Get unique jenis barang
    const jenisBarang: string[] = [...new Set(filteredSetoran.map((s: any) => s.nama_barang))].filter((x): x is string => typeof x === 'string').sort()

    // Get unique tanggal
    const uniqueTanggal = [...new Set(filteredSetoran.map((s: any) => s.tanggal))].sort()

    // Process data per tanggal
    const dataPerTanggal = uniqueTanggal.map((tanggal) => {
      const setoranHariIni = filteredSetoran.filter((s: any) => s.tanggal === tanggal)

      const harga: any = {}
      const berat: any = {}
      let totalHarga = 0
      let totalBerat = 0

      // Initialize all jenis barang with 0
      jenisBarang.forEach((jenis) => {
        harga[jenis] = 0
        berat[jenis] = 0
      })

      // Sum up data for each jenis barang
      setoranHariIni.forEach((setoran: any) => {
        harga[setoran.nama_barang] += setoran.total_harga
        berat[setoran.nama_barang] += setoran.berat
        totalHarga += setoran.total_harga
        totalBerat += setoran.berat
      })

      return {
        tanggal,
        harga,
        berat,
        totalHarga,
        totalBerat,
      }
    })

    // Calculate totals per jenis barang
    const totalHargaPerJenis: any = {}
    const totalBeratPerJenis: any = {}
    let grandTotalHarga = 0
    let grandTotalBerat = 0

    jenisBarang.forEach((jenis) => {
      totalHargaPerJenis[jenis] = 0
      totalBeratPerJenis[jenis] = 0
    })

    dataPerTanggal.forEach((row: any) => {
      jenisBarang.forEach((jenis) => {
        totalHargaPerJenis[jenis] += row.harga[jenis]
        totalBeratPerJenis[jenis] += row.berat[jenis]
      })
      grandTotalHarga += row.totalHarga
      grandTotalBerat += row.totalBerat
    })

    const laporan: LaporanKeuangan = {
      totalMasuk: grandTotalHarga,
      totalKeluar: 0, // No more penarikan
      saldoAkhir: grandTotalHarga, // No more penarikan
      transaksiMasuk: filteredSetoran.map((s: any) => ({
        id: s.id,
        tanggal: s.tanggal,
        jenis: "masuk" as const,
        kategori: "Setoran Anggota",
        keterangan: `${s.nama_anggota} - ${s.nama_barang}`,
        jumlah: s.total_harga,
      })),
      transaksiKeluar: [], // No more penarikan
    }

    setLaporanKeuangan(laporan)
    toast({
      title: "Berhasil",
      description: "Laporan keuangan berhasil dibuat",
    })
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!withdrawForm.namaAnggota || !withdrawForm.jumlah) {
      toast({
        title: "Error",
        description: "Nama anggota dan jumlah harus diisi",
        variant: "destructive",
      })
      return
    }

    // Hitung saldo anggota
    const setoranAnggota = setoran.filter((s: any) => s.nama_anggota === withdrawForm.namaAnggota)

    const totalSetoran = setoranAnggota.reduce((sum: any, s: any) => sum + s.total_harga, 0)
    const saldoTersedia = totalSetoran

    const jumlahPenarikan = Number.parseFloat(withdrawForm.jumlah)

    if (jumlahPenarikan > saldoTersedia) {
      toast({
        title: "Error",
        description: `Saldo tidak mencukupi. Saldo tersedia: Rp ${saldoTersedia.toLocaleString("id-ID")}`,
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("penarikan").insert([
        {
          nama_anggota: withdrawForm.namaAnggota,
          tanggal: new Date().toISOString().split("T")[0],
          jumlah: jumlahPenarikan,
          keterangan: withdrawForm.keterangan || "Penarikan dana",
        },
      ])
      if (error) throw error

      setIsWithdrawDialogOpen(false)
      setWithdrawForm({ namaAnggota: "", jumlah: "", keterangan: "" })

      toast({
        title: "Berhasil",
        description: `Penarikan Rp ${jumlahPenarikan.toLocaleString("id-ID")} untuk ${withdrawForm.namaAnggota} berhasil dicatat`,
      })

      await loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mencatat penarikan",
        variant: "destructive",
      })
    }
  }

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!transactionForm.kategori || !transactionForm.keterangan || !transactionForm.jumlah) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("transaksi_keuangan").insert([
        {
          tanggal: new Date().toISOString().split("T")[0],
          jenis: transactionForm.jenis,
          kategori: transactionForm.kategori,
          keterangan: transactionForm.keterangan,
          jumlah: Number.parseFloat(transactionForm.jumlah),
        },
      ])
      if (error) throw error

      setIsTransactionDialogOpen(false)
      setTransactionForm({ jenis: "masuk", kategori: "", keterangan: "", jumlah: "" })

      toast({
        title: "Berhasil",
        description: `Transaksi ${transactionForm.jenis} Rp ${Number.parseFloat(transactionForm.jumlah).toLocaleString("id-ID")} berhasil dicatat`,
      })

      await loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mencatat transaksi",
        variant: "destructive",
      })
    }
  }

  const downloadBukuTabungan = async () => {
    if (bukuTabungan.length === 0) {
      toast({
        title: "Error",
        description: "Buat buku tabungan terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    try {
      const XLSX = await import("xlsx")

      const fileName = `Buku_Tabungan_${selectedAnggota.replace(/\s+/g, "_")}_${selectedYear}.xlsx`

      // Create workbook
      const wb = XLSX.utils.book_new()

      // Header data
      const headerData = [
        ["BUKU TABUNGAN BANK SAMPAH RESIK SEJAHTERA"],
        [`NAMA: ${selectedAnggota.toUpperCase()}`],
        [""],
        ["TANGGAL", "NAMA BARANG", "HARGA", "KG", "MASUK", "KELUAR", "SALDO", "PARAF"],
      ]

      // Transaction data
      const transactionData = bukuTabungan.map((item) => [
        new Date(item.tanggal).toLocaleDateString("id-ID"),
        item.nama_barang,
        item.harga > 0 ? `(${item.harga.toLocaleString("id-ID")})` : "",
        item.kg > 0 ? item.kg : "",
        item.masuk > 0 ? `(${item.masuk.toLocaleString("id-ID")})` : "(-)",
        item.keluar > 0 ? `(${item.keluar.toLocaleString("id-ID")})` : "(-)",
        `(${item.saldo.toLocaleString("id-ID")})`,
        item.paraf,
      ])

      const allData = [...headerData, ...transactionData]
      const ws = XLSX.utils.aoa_to_sheet(allData)

      // Set column widths
      ws["!cols"] = [
        { width: 12 }, // Tanggal
        { width: 15 }, // Nama Barang
        { width: 10 }, // Harga
        { width: 8 }, // KG
        { width: 12 }, // Masuk
        { width: 12 }, // Keluar
        { width: 15 }, // Saldo
        { width: 10 }, // Paraf
      ]

      XLSX.utils.book_append_sheet(wb, ws, "Buku Tabungan")
      XLSX.writeFile(wb, fileName)

      toast({
        title: "Berhasil",
        description: `File ${fileName} berhasil didownload`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat file Excel",
        variant: "destructive",
      })
    }
  }

  const downloadLaporanKeuangan = async () => {
    if (!laporanKeuangan) {
      toast({
        title: "Error",
        description: "Buat laporan keuangan terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    try {
      const XLSX = await import("xlsx")

      const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ]

      const monthName = monthNames[Number.parseInt(selectedMonth) - 1]
      const fileName = `Laporan_Keuangan_${monthName}_${selectedYear}.xlsx`

      // Create workbook
      const wb = XLSX.utils.book_new()

      // Sheet 1: Ringkasan
      const ringkasanData = [
        ["LAPORAN KEUANGAN BANK SAMPAH"],
        [`Periode: ${monthName} ${selectedYear}`],
        [""],
        ["RINGKASAN KEUANGAN"],
        ["Total Pemasukan", laporanKeuangan.totalMasuk],
        ["Total Pengeluaran", laporanKeuangan.totalKeluar],
        ["Saldo Akhir", laporanKeuangan.saldoAkhir],
      ]
      const ws1 = XLSX.utils.aoa_to_sheet(ringkasanData)
      XLSX.utils.book_append_sheet(wb, ws1, "Ringkasan")

      // Sheet 2: Pemasukan
      const pemasukanData = [
        ["DETAIL PEMASUKAN"],
        ["Tanggal", "Kategori", "Keterangan", "Jumlah (Rp)"],
        ...laporanKeuangan.transaksiMasuk.map((t) => [
          new Date(t.tanggal).toLocaleDateString("id-ID"),
          t.kategori,
          t.keterangan,
          t.jumlah,
        ]),
        ["", "", "TOTAL PEMASUKAN", laporanKeuangan.totalMasuk],
      ]
      const ws2 = XLSX.utils.aoa_to_sheet(pemasukanData)
      XLSX.utils.book_append_sheet(wb, ws2, "Pemasukan")

      // Sheet 3: Pengeluaran
      const pengeluaranData = [
        ["DETAIL PENGELUARAN"],
        ["Tanggal", "Kategori", "Keterangan", "Jumlah (Rp)"],
        ...laporanKeuangan.transaksiKeluar.map((t) => [
          new Date(t.tanggal).toLocaleDateString("id-ID"),
          t.kategori,
          t.keterangan,
          t.jumlah,
        ]),
        ["", "", "TOTAL PENGELUARAN", laporanKeuangan.totalKeluar],
      ]
      const ws3 = XLSX.utils.aoa_to_sheet(pengeluaranData)
      XLSX.utils.book_append_sheet(wb, ws3, "Pengeluaran")

      XLSX.writeFile(wb, fileName)

      toast({
        title: "Berhasil",
        description: `File ${fileName} berhasil didownload`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat file Excel",
        variant: "destructive",
      })
    }
  }

  const getSaldoAnggota = (namaAnggota: string) => {
    const setoranAnggota = setoran.filter((s: any) => s.nama_anggota === namaAnggota)

    const totalSetoran = setoranAnggota.reduce((sum: any, s: any) => sum + s.total_harga, 0)

    return totalSetoran
  }

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
  const uniqueAnggota = getUniqueAnggota()

  const kategoriMasuk = ["Setoran Anggota", "Donasi", "Penjualan Sampah", "Lain-lain"]
  const kategoriKeluar = ["Operasional", "Bensin", "Perawatan", "Gaji", "Lain-lain"]

  // Add these new functions before the return statement:

  const generateRekapBulanan = () => {
    if (!selectedMonth || !selectedYear) {
      toast({
        title: "Error",
        description: "Pilih bulan dan tahun terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    // Filter setoran berdasarkan bulan dan tahun
    const filteredSetoran = setoran.filter((s: any) => {
      const date = new Date(s.tanggal)
      return (
        date.getMonth() + 1 === Number.parseInt(selectedMonth) && date.getFullYear() === Number.parseInt(selectedYear)
      )
    })

    if (filteredSetoran.length === 0) {
      toast({
        title: "Info",
        description: "Tidak ada data setoran untuk periode yang dipilih",
        variant: "destructive",
      })
      return
    }

    // Get unique jenis barang
    const jenisBarang: string[] = [...new Set(filteredSetoran.map((s: any) => s.nama_barang))].filter((x): x is string => typeof x === 'string').sort()

    // Get unique tanggal
    const uniqueTanggal = [...new Set(filteredSetoran.map((s: any) => s.tanggal))].sort()

    // Process data per tanggal
    const dataPerTanggal = uniqueTanggal.map((tanggal) => {
      const setoranHariIni = filteredSetoran.filter((s: any) => s.tanggal === tanggal)

      const harga: any = {}
      const berat: any = {}
      let totalHarga = 0
      let totalBerat = 0

      // Initialize all jenis barang with 0
      jenisBarang.forEach((jenis) => {
        harga[jenis] = 0
        berat[jenis] = 0
      })

      // Sum up data for each jenis barang
      setoranHariIni.forEach((setoran: any) => {
        harga[setoran.nama_barang] += setoran.total_harga
        berat[setoran.nama_barang] += setoran.berat
        totalHarga += setoran.total_harga
        totalBerat += setoran.berat
      })

      return {
        tanggal,
        harga,
        berat,
        totalHarga,
        totalBerat,
      }
    })

    // Calculate totals per jenis barang
    const totalHargaPerJenis: any = {}
    const totalBeratPerJenis: any = {}
    let grandTotalHarga = 0
    let grandTotalBerat = 0

    jenisBarang.forEach((jenis) => {
      totalHargaPerJenis[jenis] = 0
      totalBeratPerJenis[jenis] = 0
    })

    dataPerTanggal.forEach((row: any) => {
      jenisBarang.forEach((jenis) => {
        totalHargaPerJenis[jenis] += row.harga[jenis]
        totalBeratPerJenis[jenis] += row.berat[jenis]
      })
      grandTotalHarga += row.totalHarga
      grandTotalBerat += row.totalBerat
    })

    const rekap = {
      jenisBarang,
      dataPerTanggal,
      totalHargaPerJenis,
      totalBeratPerJenis,
      grandTotalHarga,
      grandTotalBerat,
    }

    setRekapBulanan(rekap)
    toast({
      title: "Berhasil",
      description: "Rekap bulanan berhasil dibuat",
    })
  }

  const downloadRekapBulanan = async () => {
    if (!rekapBulanan) {
      toast({
        title: "Error",
        description: "Buat rekap bulanan terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    try {
      const XLSX = await import("xlsx")

      const monthName = monthNames[Number.parseInt(selectedMonth) - 1]
      const fileName = `Rekap_Bank_Sampah_${monthName}_${selectedYear}.xlsx`

      // Create workbook
      const wb = XLSX.utils.book_new()

      // Sheet 1: Rekap Harga
      const hargaHeader = ["Tanggal", ...rekapBulanan.jenisBarang.map((j: string) => j.toUpperCase()), "TOTAL"]
      const hargaData = [
        [`REKAP BANK SAMPAH BULAN ${monthName.toUpperCase()} ${selectedYear}`],
        ["HARGA"],
        hargaHeader,
        ...rekapBulanan.dataPerTanggal.map((row: any) => [
          new Date(row.tanggal).toLocaleDateString("id-ID"),
          ...rekapBulanan.jenisBarang.map((jenis: string) => row.harga[jenis] || ""),
          row.totalHarga,
        ]),
        [
          "JUMLAH",
          ...rekapBulanan.jenisBarang.map((jenis: string) => rekapBulanan.totalHargaPerJenis[jenis] || ""),
          rekapBulanan.grandTotalHarga,
        ],
      ]

      const ws1 = XLSX.utils.aoa_to_sheet(hargaData)
      XLSX.utils.book_append_sheet(wb, ws1, "Rekap Harga")

      // Sheet 2: Rekap Berat
      const beratHeader = ["Tanggal", ...rekapBulanan.jenisBarang.map((j: string) => j.toUpperCase()), "TOTAL"]
      const beratData = [
        [`REKAP BANK SAMPAH BULAN ${monthName.toUpperCase()} ${selectedYear}`],
        ["BERAT"],
        beratHeader,
        ...rekapBulanan.dataPerTanggal.map((row: any) => [
          new Date(row.tanggal).toLocaleDateString("id-ID"),
          ...rekapBulanan.jenisBarang.map((jenis: string) => (row.berat[jenis] > 0 ? row.berat[jenis].toFixed(2) : "")),
          row.totalBerat.toFixed(2),
        ]),
        [
          "JUMLAH",
          ...rekapBulanan.jenisBarang.map((jenis: string) =>
            rekapBulanan.totalBeratPerJenis[jenis] > 0 ? rekapBulanan.totalBeratPerJenis[jenis].toFixed(2) : "",
          ),
          rekapBulanan.grandTotalBerat.toFixed(2),
        ],
      ]

      const ws2 = XLSX.utils.aoa_to_sheet(beratData)
      XLSX.utils.book_append_sheet(wb, ws2, "Rekap Berat")

      XLSX.writeFile(wb, fileName)

      toast({
        title: "Berhasil",
        description: `File ${fileName} berhasil didownload`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat file Excel",
        variant: "destructive",
      })
    }
  }

  // Tambahkan helper untuk normalisasi nama kolom
  function getCell(row: any, ...keys: string[]) {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== "") return row[key];
      // Coba versi lower case
      const lowerKey = key.toLowerCase();
      if (row[lowerKey] !== undefined && row[lowerKey] !== null && row[lowerKey] !== "") return row[lowerKey];
      // Coba versi snake_case
      const snakeKey = key.replace(/ /g, "_").toLowerCase();
      if (row[snakeKey] !== undefined && row[snakeKey] !== null && row[snakeKey] !== "") return row[snakeKey];
    }
    return "";
  }

  // 2. Tambahkan fungsi handleImportExcel
 const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setImportLoading(true);
  try {
    const XLSX = await import("xlsx");
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    // Parse sheet harga
    const wsHarga = workbook.Sheets["Rekap Harga"] || workbook.Sheets[workbook.SheetNames[0]];
    const hargaRows = XLSX.utils.sheet_to_json(wsHarga, { header: 1 }) as any[][];
    // Parse sheet berat
    const wsBerat = workbook.Sheets["Rekap Berat"] || workbook.Sheets[workbook.SheetNames[1]];
    const beratRows = XLSX.utils.sheet_to_json(wsBerat, { header: 1 }) as any[][];

    // Helper untuk parsing data per tanggal dan barang
function parseRekap(rows: any[][]) {
  const headerIdx = rows.findIndex(r =>
    (r[0] || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .includes("tanggal")
  );
  if (headerIdx === -1) throw new Error("Header Tanggal tidak ditemukan di file Excel.");
  const headers = rows[headerIdx];
  const dataRows = rows.slice(headerIdx + 1).filter(r => (r[0] || "").toString().toLowerCase() !== "jumlah" && r[0]);
  const result: { tanggal: string, barang: string, value: number }[] = [];
  for (const row of dataRows) {
    // Format tanggal ke yyyy-mm-dd
    let tanggal = row[0];
    if (typeof tanggal === "string" && tanggal.includes("/")) {
      // dd/mm/yyyy atau d/m/yyyy
      const [d, m, y] = tanggal.split("/");
      tanggal = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    for (let i = 1; i < headers.length - 1; i++) { // skip TOTAL
      const barang = headers[i];
      const value = Number(row[i] || 0);
      if (barang && tanggal && value) {
        result.push({ tanggal, barang, value });
      }
    }
  }
  return result;
}

    const hargaData = parseRekap(hargaRows);
    const beratData = parseRekap(beratRows);

    // Gabungkan harga dan berat berdasarkan tanggal & barang
    const setoranData = hargaData.map(h => {
      const b = beratData.find(bd => bd.tanggal === h.tanggal && bd.barang === h.barang);
      return {
        tanggal: h.tanggal,
        nama_barang: h.barang,
        berat: b ? b.value : 0,
        harga_per_kg: 0,
        total_harga: h.value,
        barang_id: null,
        nama_anggota: "REKAP", // Kosongkan atau isi sesuai kebutuhan
      };
    });

    if (setoranData.length === 0) throw new Error("Tidak ada data valid yang ditemukan di file Excel.");

    const { error } = await supabase.from("setoran").insert(setoranData);
    if (error) throw error;
    toast({
      title: "Berhasil",
      description: "Data register bulanan berhasil diimport.",
    });
    await loadData();
  } catch (err) {
    toast({
      title: "Error",
      description: "Gagal import file Excel. Pastikan format file sesuai.",
      variant: "destructive",
    });
    console.error(err);
  } finally {
    setImportLoading(false);
  }
};

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
              <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-red-50 border-red-200 hover:bg-red-100">
                    <Minus className="mr-2 h-4 w-4" />
                    Tarik Dana
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Penarikan Dana Anggota</DialogTitle>
                    <DialogDescription>Catat penarikan dana dari saldo anggota</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleWithdraw}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="namaAnggota">Nama Anggota</Label>
                        <Select
                          value={withdrawForm.namaAnggota}
                          onValueChange={(value) => setWithdrawForm({ ...withdrawForm, namaAnggota: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih anggota" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueAnggota.map((nama) => (
                              <SelectItem key={nama} value={nama}>
                                {nama} - Saldo: Rp {getSaldoAnggota(nama).toLocaleString("id-ID")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="jumlah">Jumlah Penarikan (Rp)</Label>
                        <Input
                          id="jumlah"
                          type="number"
                          value={withdrawForm.jumlah}
                          onChange={(e) => setWithdrawForm({ ...withdrawForm, jumlah: e.target.value })}
                          placeholder="Masukkan jumlah"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                        <Input
                          id="keterangan"
                          value={withdrawForm.keterangan}
                          onChange={(e) => setWithdrawForm({ ...withdrawForm, keterangan: e.target.value })}
                          placeholder="Keterangan penarikan"
                        />
                      </div>
                      {withdrawForm.namaAnggota && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Saldo Tersedia:</strong> Rp{" "}
                            {getSaldoAnggota(withdrawForm.namaAnggota).toLocaleString("id-ID")}
                          </p>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-red-600 hover:bg-red-700">
                        <Minus className="mr-2 h-4 w-4" />
                        Proses Penarikan
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan & Keuangan</h1>
          <p className="text-gray-600">Kelola buku tabungan, laporan keuangan, dan transaksi operasional</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={laporanType === "per-anggota" ? "default" : "outline"}
            onClick={() => setLaporanType("per-anggota")}
          >
            <User className="mr-2 h-4 w-4" />
            Buku Tabungan
          </Button>
          <Button
            variant={laporanType === "bulanan" ? "default" : "outline"}
            onClick={() => setLaporanType("bulanan")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Register Bulanan
          </Button>
        </div>

        {/* Saldo Anggota Cards */}
        {uniqueAnggota.length > 0 && laporanType === "per-anggota" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {uniqueAnggota.map((nama) => {
              const saldo = getSaldoAnggota(nama)
              return (
                <Card key={nama} className={saldo > 0 ? "border-green-200 bg-green-50" : "border-gray-200"}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{nama}</p>
                        <p className="text-sm text-gray-600">Saldo Tabungan</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${saldo > 0 ? "text-green-600" : "text-gray-500"}`}>
                          Rp {saldo.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Buku Tabungan Section */}
        {laporanType === "per-anggota" && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Buat Buku Tabungan</CardTitle>
                <CardDescription>Pilih anggota untuk membuat buku tabungan individual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 items-end">
                  <div className="grid gap-2">
                    <Label htmlFor="anggota">Nama Anggota</Label>
                    <Select value={selectedAnggota} onValueChange={setSelectedAnggota}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih anggota" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueAnggota.map((nama) => (
                          <SelectItem key={nama} value={nama}>
                            {nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={generateBukuTabungan}>
                    <User className="mr-2 h-4 w-4" />
                    Buat Buku Tabungan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Buku Tabungan Results */}
            {bukuTabungan.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>BUKU TABUNGAN BANK SAMPAH RESIK SEJAHTERA</CardTitle>
                      <CardDescription>NAMA: {selectedAnggota.toUpperCase()}</CardDescription>
                    </div>
                    <Button onClick={downloadBukuTabungan} className="bg-green-600 hover:bg-green-700">
                      <Download className="mr-2 h-4 w-4" />
                      Download Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-bold text-center">TANGGAL</TableHead>
                          <TableHead className="font-bold text-center">NAMA BARANG</TableHead>
                          <TableHead className="font-bold text-center">HARGA</TableHead>
                          <TableHead className="font-bold text-center">KG</TableHead>
                          <TableHead className="font-bold text-center">MASUK</TableHead>
                          <TableHead className="font-bold text-center">KELUAR</TableHead>
                          <TableHead className="font-bold text-center">SALDO</TableHead>
                          <TableHead className="font-bold text-center">PARAF</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bukuTabungan.map((item, index) => (
                          <TableRow key={index} className={item.keluar > 0 ? "bg-red-50" : ""}>
                            <TableCell className="text-center">
                              {new Date(item.tanggal).toLocaleDateString("id-ID")}
                            </TableCell>
                            <TableCell className="text-center font-medium">{item.nama_barang}</TableCell>
                            <TableCell className="text-center">
                              {item.harga > 0 ? `(${item.harga.toLocaleString("id-ID")})` : ""}
                            </TableCell>
                            <TableCell className="text-center">{item.kg > 0 ? item.kg : ""}</TableCell>
                            <TableCell className="text-center text-green-600 font-medium">
                              {item.masuk > 0 ? `(${item.masuk.toLocaleString("id-ID")})` : "(-)"}
                            </TableCell>
                            <TableCell className="text-center text-red-600 font-medium">
                              {item.keluar > 0 ? `(${item.keluar.toLocaleString("id-ID")})` : "(-)"}
                            </TableCell>
                            <TableCell className="text-center font-bold">
                              ({item.saldo.toLocaleString("id-ID")})
                            </TableCell>
                            <TableCell className="text-center text-red-600 font-medium">{item.paraf}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Laporan Keuangan Section */}
        {laporanType === "bulanan" && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filter Register Bulanan</CardTitle>
                <CardDescription>Pilih periode untuk membuat register bulanan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 items-end">
                  <div className="grid gap-2">
                    <Label htmlFor="month">Bulan</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih bulan" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthNames.map((month, index) => (
                          <SelectItem key={index} value={(index + 1).toString().padStart(2, "0")}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Tahun</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tahun" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={generateRekapBulanan}>
                    <FileText className="mr-2 h-4 w-4" />
                    Buat Register Bulanan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rekap Bulanan Results */}
            {rekapBulanan && (
              <>
                {/* Download Button */}
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>
                          REKAP BANK SAMPAH BULAN {monthNames[Number.parseInt(selectedMonth) - 1].toUpperCase()}{" "}
                          {selectedYear}
                        </CardTitle>
                        <CardDescription>Rekap lengkap setoran per tanggal dan jenis barang</CardDescription>
                      </div>
                      <Button onClick={downloadRekapBulanan} className="bg-green-600 hover:bg-green-700">
                        <Download className="mr-2 h-4 w-4" />
                        Download Excel
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Tabel Harga */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">HARGA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-bold text-center min-w-[100px]">Tanggal</TableHead>
                            {rekapBulanan.jenisBarang.map((jenis: string) => (
                              <TableHead key={jenis} className="font-bold text-center min-w-[80px] text-xs">
                                {jenis.toUpperCase()}
                              </TableHead>
                            ))}
                            <TableHead className="font-bold text-center min-w-[100px]">TOTAL</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rekapBulanan.dataPerTanggal.map((row: {
                            tanggal: string;
                            harga: Record<string, number>;
                            berat: Record<string, number>;
                            totalHarga: number;
                            totalBerat: number;
                          }) => (
                            <TableRow key={row.tanggal}>
                              <TableCell className="text-center font-medium">
                                {new Date(row.tanggal).toLocaleDateString("id-ID")}
                              </TableCell>
                              {rekapBulanan.jenisBarang.map((jenis: string) => (
                                <TableCell key={jenis} className="text-center text-sm">
                                  {row.harga[jenis] > 0 ? row.harga[jenis].toLocaleString("id-ID") : ""}
                                </TableCell>
                              ))}
                              <TableCell className="text-center font-bold text-green-600">
                                {row.totalHarga.toLocaleString("id-ID")}
                              </TableCell>
                            </TableRow>
                          ))}
                          {/* Total Row */}
                          <TableRow className="bg-green-50 font-bold">
                            <TableCell className="text-center">JUMLAH</TableCell>
                            {rekapBulanan.jenisBarang.map((jenis: string) => (
                              <TableCell key={jenis} className="text-center text-green-600">
                                {rekapBulanan.totalHargaPerJenis[jenis] > 0
                                  ? rekapBulanan.totalHargaPerJenis[jenis].toLocaleString("id-ID")
                                  : ""}
                              </TableCell>
                            ))}
                            <TableCell className="text-center text-green-600 text-lg">
                              {rekapBulanan.grandTotalHarga.toLocaleString("id-ID")}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabel Berat */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">BERAT</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-bold text-center min-w-[100px]">Tanggal</TableHead>
                            {rekapBulanan.jenisBarang.map((jenis: string) => (
                              <TableHead key={jenis} className="font-bold text-center min-w-[80px] text-xs">
                                {jenis.toUpperCase()}
                              </TableHead>
                            ))}
                            <TableHead className="font-bold text-center min-w-[100px]">TOTAL</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rekapBulanan.dataPerTanggal.map((row: {
                            tanggal: string;
                            harga: Record<string, number>;
                            berat: Record<string, number>;
                            totalHarga: number;
                            totalBerat: number;
                          }) => (
                            <TableRow key={row.tanggal}>
                              <TableCell className="text-center font-medium">
                                {new Date(row.tanggal).toLocaleDateString("id-ID")}
                              </TableCell>
                              {rekapBulanan.jenisBarang.map((jenis: string) => (
                                <TableCell key={jenis} className="text-center text-sm">
                                  {row.berat[jenis] > 0 ? row.berat[jenis].toFixed(2) : ""}
                                </TableCell>
                              ))}
                              <TableCell className="text-center font-bold text-blue-600">
                                {row.totalBerat.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                          {/* Total Row */}
                          <TableRow className="bg-blue-50 font-bold">
                            <TableCell className="text-center">JUMLAH</TableCell>
                            {rekapBulanan.jenisBarang.map((jenis: string) => (
                              <TableCell key={jenis} className="text-center text-blue-600">
                                {rekapBulanan.totalBeratPerJenis[jenis] > 0
                                  ? rekapBulanan.totalBeratPerJenis[jenis].toFixed(2)
                                  : ""}
                              </TableCell>
                            ))}
                            <TableCell className="text-center text-blue-600 text-lg">
                              {rekapBulanan.grandTotalBerat.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}