"use client";

import React, { useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/data/categories";
import { PRODUCT_SECTIONS } from "@/lib/product-sections";
import { countWords, SHORT_DESCRIPTION_MAX_WORDS } from "@/lib/sanitize-html";
import type { AdminProduct } from "@/lib/map-product";

const MAX_GALLERY_IMAGES = 4;

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  originalPrice: z.coerce.number().min(0).optional().or(z.literal("")),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  categorySlug: z.string().min(1, "Category is required"),
  subCategorySlug: z.string().optional(),
  shortDescription: z
    .string()
    .trim()
    .min(1, "Short description is required")
    .refine(
      (text) => countWords(text) <= SHORT_DESCRIPTION_MAX_WORDS,
      `Short description must be ${SHORT_DESCRIPTION_MAX_WORDS} words or fewer`
    ),
  description: z.string().min(10, "Description is too short"),
  sku: z.string().optional(),
  sections: z.array(z.string()).default([]),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductModal({
  onCreated,
}: {
  onCreated?: (product: AdminProduct) => void;
}) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      categorySlug: "",
      subCategorySlug: "",
      sku: "",
      shortDescription: "",
      description: "",
      sections: [],
    },
  });

  const selectedCategorySlug = watch("categorySlug");
  const subcategories = useMemo(
    () => CATEGORIES.find((c) => c.slug === selectedCategorySlug)?.subcategories ?? [],
    [selectedCategorySlug]
  );

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files).slice(0, MAX_GALLERY_IMAGES - galleryFiles.length);
    setGalleryFiles((prev) => [...prev, ...fileArray]);
    setGalleryPreviews((prev) => [...prev, ...fileArray.map((f) => URL.createObjectURL(f))]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    reset();
    setCoverFile(null);
    setCoverPreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
  };

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    if (!coverFile) {
      toast.error("A cover image is required");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", String(data.price));
      if (data.originalPrice) formData.append("originalPrice", String(data.originalPrice));
      formData.append("stock", String(data.stock));
      formData.append("sku", data.sku ?? "");
      formData.append("shortDescription", data.shortDescription);
      formData.append("description", data.description);
      formData.append("categorySlug", data.categorySlug);
      if (data.subCategorySlug) formData.append("subCategorySlug", data.subCategorySlug);
      formData.append("sections", JSON.stringify(data.sections ?? []));
      formData.append("cover", coverFile);
      galleryFiles.forEach((file) => formData.append("images", file));

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Failed to create product");
        return;
      }

      toast.success("Product created successfully");
      onCreated?.(json.product as AdminProduct);
      resetForm();
      setOpen(false);
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-black text-white px-8 py-4 font-black uppercase border-2 border-black  hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
          Add New Product
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl! h-[calc(100vh-50px)] p-0 border-2 border-black rounded-none flex flex-col overflow-hidden">
        <DialogHeader className="p-8 border-b-2 border-black bg-yellow-400 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div>
            <DialogTitle className="text-4xl font-black uppercase italic tracking-tighter">
              Product Entry Form
            </DialogTitle>
            <p className="font-bold text-xs uppercase mt-1 flex items-center gap-2">
              <FileText size={14} /> Official Inventory Document
            </p>
          </div>
          <div className="hidden md:block border-2 border-black p-2 bg-white rotate-3 font-black text-sm">
            V-2026
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-hidden">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-10 lg:p-16 space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-8">
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b-4 border-black pb-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-black">
                      01
                    </span>
                    <h3 className="font-black uppercase italic text-lg">
                      General Details
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-black uppercase text-sm">
                      Product Name
                    </Label>
                    <Input
                      {...register("name")}
                      className="h-14 rounded-none border-4 border-black text-lg font-bold focus-visible:ring-0"
                    />
                    {errors.name && (
                      <p className="text-red-600 font-bold text-[10px] italic">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-black uppercase text-sm">
                        Base Price (Ksh)
                      </Label>
                      <Input
                        type="number"
                        {...register("price")}
                        className="h-12 rounded-none border-4 border-black font-bold focus-visible:ring-0"
                      />
                      {errors.price && (
                        <p className="text-red-600 font-bold text-[10px] italic">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black uppercase text-sm">
                        Original Price (Ksh)
                      </Label>
                      <Input
                        type="number"
                        {...register("originalPrice")}
                        className="h-12 rounded-none border-4 border-black font-bold focus-visible:ring-0"
                        placeholder="For sale pricing"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-black uppercase text-sm">
                        Stock Level
                      </Label>
                      <Input
                        type="number"
                        {...register("stock")}
                        className="h-12 rounded-none border-4 border-black font-bold focus-visible:ring-0"
                      />
                      {errors.stock && (
                        <p className="text-red-600 font-bold text-[10px] italic">
                          {errors.stock.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black uppercase text-sm">
                        SKU Number
                      </Label>
                      <Input
                        {...register("sku")}
                        className="h-12 rounded-none border-4 border-black font-bold focus-visible:ring-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-black uppercase text-sm">
                        Category
                      </Label>
                      <Select
                        value={selectedCategorySlug}
                        onValueChange={(v) => {
                          setValue("categorySlug", v);
                          setValue("subCategorySlug", "");
                        }}
                      >
                        <SelectTrigger className="h-12 w-full rounded-none border-4 border-black font-bold focus-visible:ring-0">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.slug} value={cat.slug}>
                              {cat.icon} {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.categorySlug && (
                        <p className="text-red-600 font-bold text-[10px] italic">
                          {errors.categorySlug.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black uppercase text-sm">
                        Subcategory
                      </Label>
                      <Select
                        value={watch("subCategorySlug")}
                        onValueChange={(v) => setValue("subCategorySlug", v)}
                        disabled={subcategories.length === 0}
                      >
                        <SelectTrigger className="h-12 w-full rounded-none border-4 border-black font-bold focus-visible:ring-0">
                          <SelectValue placeholder="Optional" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories.map((sub) => (
                            <SelectItem key={sub.slug} value={sub.slug}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-black uppercase text-sm">
                      Homepage Sections
                    </Label>
                    <div className="flex flex-wrap gap-4">
                      {PRODUCT_SECTIONS.map((section) => (
                        <label
                          key={section.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={watch("sections")?.includes(section.value)}
                            onCheckedChange={(checked) => {
                              const current = watch("sections") ?? [];
                              setValue(
                                "sections",
                                checked
                                  ? [...current, section.value]
                                  : current.filter((s) => s !== section.value)
                              );
                            }}
                            className="w-5 h-5 rounded-none border-2 border-black"
                          />
                          <span className="font-bold text-sm">{section.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b-4 border-black pb-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-black">
                      02
                    </span>
                    <h3 className="font-black uppercase italic text-lg">
                      Short Description
                    </h3>
                  </div>
                  <textarea
                    {...register("shortDescription")}
                    placeholder="A short tagline or highlights..."
                    className="w-full min-h-20 p-4 border-4 border-black font-bold text-sm focus:outline-none focus:bg-yellow-50"
                  />
                  <div className="flex items-center justify-between">
                    {errors.shortDescription ? (
                      <p className="text-red-600 font-bold text-[10px] italic">
                        {errors.shortDescription.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <p className="font-bold text-[10px] uppercase opacity-60">
                      {countWords(watch("shortDescription") ?? "")}/{SHORT_DESCRIPTION_MAX_WORDS} words
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b-4 border-black pb-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-black">
                      03
                    </span>
                    <h3 className="font-black uppercase italic text-lg">
                      Description
                    </h3>
                  </div>
                  <RichTextEditor
                    value={watch("description")}
                    onChange={(html) => setValue("description", html)}
                    placeholder="Describe the product features or marketing write up..."
                    minHeightClass="min-h-37.5"
                  />
                  {errors.description && (
                    <p className="text-red-600 font-bold text-[10px] italic">
                      {errors.description.message}
                    </p>
                  )}
                </section>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 space-y-6">
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b-4 border-black pb-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-black">
                      04
                    </span>
                    <h3 className="font-black uppercase italic text-lg">
                      Cover Image
                    </h3>
                  </div>

                  {coverPreview ? (
                    <div className="relative aspect-square border-4 border-black">
                      <img
                        src={coverPreview}
                        alt="cover preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverFile(null);
                          setCoverPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 border-2 border-black p-1"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <Label
                      htmlFor="cover-upload"
                      className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center border-4 border-dashed border-black bg-gray-50 hover:bg-cyan-50 transition-colors"
                    >
                      <Upload size={40} strokeWidth={3} />
                      <p className="mt-4 font-black uppercase text-center px-4 text-xs">
                        Click to Upload Cover Image
                      </p>
                      <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverChange}
                      />
                    </Label>
                  )}
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b-4 border-black pb-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-black">
                      05
                    </span>
                    <h3 className="font-black uppercase italic text-lg">
                      Gallery Images (up to {MAX_GALLERY_IMAGES})
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {galleryPreviews.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square border-2 border-black"
                      >
                        <img
                          src={src}
                          alt="gallery preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 border-2 border-black p-0.5"
                        >
                          <X size={12} className="text-white" />
                        </button>
                      </div>
                    ))}
                    {galleryFiles.length < MAX_GALLERY_IMAGES && (
                      <Label
                        htmlFor="gallery-upload"
                        className="flex aspect-square cursor-pointer flex-col items-center justify-center border-4 border-dashed border-black bg-gray-50 hover:bg-cyan-50 transition-colors"
                      >
                        <Upload size={20} strokeWidth={3} />
                        <input
                          id="gallery-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleGalleryChange}
                        />
                      </Label>
                    )}
                  </div>
                </section>
              </div>
            </div>

            <footer className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t-4 border-black">
              <div className="text-[10px] font-black uppercase max-w-75 opacity-60 italic">
                Acknowledge: Data entered here will be synced directly with the
                production inventory database.
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto bg-purple-500 text-black border-4 border-black px-12 py-5 font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3"
              >
                {submitting && <Loader2 size={20} className="animate-spin" />}
                {submitting ? "Submitting..." : "Submit Record"}
              </button>
            </footer>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
