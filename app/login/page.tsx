"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Recycle, Shield, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Simple demo login without Supabase for now
  const handleDemoLogin = async () => {
    setIsLoading(true)

    try {
      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Set demo session in localStorage
      localStorage.setItem(
        "demo_user",
        JSON.stringify({
          email: "demo@banksampah.com",
          id: "demo-user-id",
          loginTime: new Date().toISOString(),
        }),
      )

      toast({
        title: "Berhasil",
        description: "Login demo berhasil! Mengarahkan ke dashboard...",
      })

      // Force redirect to main dashboard
      window.location.href = "/dashboard"
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login demo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simple validation for demo purposes
      if (email === "admin@banksampah.com" && password === "admin123") {
        localStorage.setItem(
          "demo_user",
          JSON.stringify({
            email: email,
            id: "admin-user-id",
            loginTime: new Date().toISOString(),
          }),
        )

        toast({
          title: "Berhasil",
          description: "Login berhasil! Mengarahkan ke dashboard...",
        })

        // Force redirect to main dashboard
        window.location.href = "/dashboard"
      } else {
        toast({
          title: "Error",
          description: "Email atau password salah. Gunakan admin@banksampah.com / admin123",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Recycle className="h-10 w-10 text-green-600" />
            <span className="text-3xl font-bold text-gray-900">Bank Sampah Digital</span>
          </div>
        </div>

        {/* Supabase Status Warning */}
        <Card className="mb-4 border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-800">Mode Demo Offline</p>
                <p className="text-orange-700">
                  Sementara menggunakan autentikasi lokal karena konfigurasi Supabase sedang diperbaiki.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Login Admin</CardTitle>
            <CardDescription>Masuk ke sistem pengelolaan bank sampah</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@banksampah.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="admin123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Login..." : "Login"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Atau</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 bg-blue-50 border-blue-200 hover:bg-blue-100"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "🚀 Login Demo Langsung"}
              </Button>
            </div>

            {/* Login Credentials Info */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Kredensial Login:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>
                  <strong>Admin:</strong> admin@banksampah.com / admin123
                </p>
                <p>
                  <strong>Demo:</strong> Klik "Login Demo Langsung" untuk akses instan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Mode demo - Data tersimpan sementara di browser</p>
        </div>
      </div>
    </div>
  )
}
