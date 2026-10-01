import { defineField, defineType } from "sanity";

export default defineType({
  name: "schoolAlbum",
  title: "Momen sekolah",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Nama album", type: "string", validation: rule => rule.required().max(60) }),
    defineField({ name: "order", title: "Urutan album", type: "number", initialValue: 1, validation: rule => rule.required().integer().min(0) }),
    defineField({
      name: "photos",
      title: "Foto dan keterangan",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "image", title: "Foto", type: "image", options: { hotspot: true }, validation: rule => rule.required() }),
          defineField({ name: "caption", title: "Keterangan", type: "string" })
        ],
        preview: { select: { title: "caption", media: "image" } }
      }],
      validation: rule => rule.max(40)
    })
  ],
  orderings: [{ title: "Urutan album", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", media: "photos.0.image" } }
});
