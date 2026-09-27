# MI PKM Jaya Unpam — Website Sekolah

Website profil sekolah yang responsif, dibuat dengan HTML, CSS, dan JavaScript tanpa framework.

## Menjalankan website

1. Buka folder project di VS Code.
2. Install extension **Live Server** jika belum tersedia.
3. Klik kanan `index.html`, lalu pilih **Open with Live Server**.

Website juga dapat dibuka langsung dengan membuka `index.html` di browser.

## Fitur

- Navigasi responsif dengan menu hamburger di layar kecil.
- Scroll halus, penanda navigasi aktif, dan animasi saat konten masuk ke layar.
- Loader yang mulai menghilang setelah HTML selesai dimuat.
- Bagian profil, program, berita, prestasi, video, galeri kegiatan, pendaftaran, dan kontak.
- Galeri foto dengan album **Kegiatan kelas**, **Sholat berjamaah**, dan **Olahraga**. Foto dapat dibuka dalam viewer, dengan tombol berikutnya/sebelumnya dan tombol panah keyboard.
- Tombol pendaftaran yang membuka WhatsApp dengan pesan pertanyaan pendaftaran yang sudah terisi.
- Layout responsif untuk desktop, tablet, dan ponsel.

## Mengatur konten

### Video YouTube

Di `index.html`, ganti `VIDEO_ID_ANDA` pada URL embed dengan ID video YouTube sekolah. Contoh, untuk `https://www.youtube.com/watch?v=AbCd1234`, ID-nya adalah `AbCd1234`.

### Album galeri

Daftar album dan foto berada di objek `galleryAlbums` dalam `js/script.js`. Tambahkan foto ke album dengan format berikut. Pastikan file gambarnya ada di folder `assets/`.

```js
"Kegiatan kelas": [
  { image: "assets/foto-kelas-1.jpg", caption: "Kegiatan kelas" },
  { image: "assets/foto-kelas-2.jpg", caption: "Kegiatan kelas" }
]
```

### Tombol WhatsApp

Link pendaftaran berada di `index.html` dan menggunakan format `https://wa.me/6289614259471?text=...`. Ganti nomor contoh dengan kode negara diikuti nomor WhatsApp, tanpa tanda `+`, spasi, atau tanda hubung.

### Foto dan aset

Foto galeri disimpan lokal di `assets/`. Untuk menampilkan foto lain, tambahkan file ke folder tersebut dan perbarui path-nya di `galleryAlbums` dalam `js/script.js`. Beberapa gambar lain pada halaman dan font menggunakan layanan eksternal, sehingga memerlukan koneksi internet.

## Struktur project

```text
.
├── assets/       # Foto dan aset visual
├── css/
│   └── style.css
├── js/
│   └── script.js
├── index.html
└── README.md
```
