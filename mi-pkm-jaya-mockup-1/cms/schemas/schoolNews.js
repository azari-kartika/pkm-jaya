import { defineField, defineType } from "sanity";

export default defineType({
  name: "schoolNews",
  title: "Informasi terbaru",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Judul", type: "string", validation: rule => rule.required().max(110) }),
    defineField({ name: "publishedAt", title: "Tanggal terbit", type: "date", validation: rule => rule.required() }),
    defineField({ name: "excerpt", title: "Ringkasan", type: "text", rows: 3 }),
    defineField({ name: "body", title: "Isi berita", type: "text", rows: 8, description: "Isi ini tampil saat pengunjung membuka kartu berita." }),
    defineField({ name: "image", title: "Foto", type: "image", options: { hotspot: true } }),
    defineField({ name: "link", title: "Tautan berita (opsional)", type: "url" })
  ],
  orderings: [{ title: "Tanggal terbaru", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "image" } }
});
