import { defineField, defineType } from "sanity";

export default defineType({
  name: "schoolAchievement",
  title: "Kebanggaan sekolah",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Nama prestasi", type: "string", validation: rule => rule.required().max(90) }),
    defineField({ name: "award", title: "Penghargaan", type: "string", description: "Contoh: Juara 1" }),
    defineField({ name: "level", title: "Tingkat atau bidang", type: "string", description: "Contoh: Tingkat Kota" }),
    defineField({ name: "year", title: "Tahun", type: "string" }),
    defineField({ name: "icon", title: "Ikon/emoji", type: "string", initialValue: "🏆" }),
    defineField({ name: "order", title: "Urutan tampil", type: "number", initialValue: 1, validation: rule => rule.required().integer().min(0) })
  ],
  orderings: [{ title: "Urutan tampil", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "award", media: "icon" } }
});
