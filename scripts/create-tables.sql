-- Create barang table
CREATE TABLE IF NOT EXISTS barang (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  kategori VARCHAR(100) NOT NULL,
  harga DECIMAL(10,2) NOT NULL,
  satuan VARCHAR(10) NOT NULL DEFAULT 'kg',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create setoran table
CREATE TABLE IF NOT EXISTS setoran (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_anggota VARCHAR(255) NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  barang_id UUID REFERENCES barang(id) ON DELETE CASCADE,
  nama_barang VARCHAR(255) NOT NULL,
  berat DECIMAL(10,2) NOT NULL,
  harga_per_kg DECIMAL(10,2) NOT NULL,
  total_harga DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_barang_kategori ON barang(kategori);
CREATE INDEX IF NOT EXISTS idx_setoran_tanggal ON setoran(tanggal);
CREATE INDEX IF NOT EXISTS idx_setoran_nama_anggota ON setoran(nama_anggota);
CREATE INDEX IF NOT EXISTS idx_setoran_barang_id ON setoran(barang_id);

-- Enable Row Level Security (RLS)
ALTER TABLE barang ENABLE ROW LEVEL SECURITY;
ALTER TABLE setoran ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON barang
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON setoran
  FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_barang_updated_at BEFORE UPDATE ON barang
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setoran_updated_at BEFORE UPDATE ON setoran
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
