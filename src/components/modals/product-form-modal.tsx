"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  discount: z.coerce.number().min(0).max(100).default(0),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description is too short"),
  details: z.string().min(2, "Product detail is required"),
  sku: z.string().min(1, "SKU is required"),
  images: z.any(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductModal() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      price: 0,
      discount: 0,
      stock: 0,
      category: "",
      sku: "",
      description: "",
      details: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    setImageFiles(fileArray);
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", String(data.price));
      formData.append("stock", String(data.stock));
      formData.append("sku", data.sku);
      formData.append("description", data.description);
      formData.append("details", data.details);
      formData.append("category", data.category);
      imageFiles.forEach((file) => formData.append("images", file));

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
      reset();
      setImageFiles([]);
      setPreviews([]);
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
                        Discount (%)
                      </Label>
                      <Input
                        type="number"
                        {...register("discount")}
                        className="h-12 rounded-none border-4 border-black font-bold focus-visible:ring-0"
                        placeholder="e.g. 10"
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
                  <div className="space-y-2">
                    <Label className="font-black uppercase text-sm">
                      Category
                    </Label>
                    <Input
                      {...register("category")}
                      className="h-12 rounded-none border-4 border-black font-bold focus-visible:ring-0"
                      placeholder="e.g. Electronics"
                    />
                    {errors.category && (
                      <p className="text-red-600 font-bold text-[10px] italic">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b-4 border-black pb-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-black">
                      02
                    </span>
                    <h3 className="font-black uppercase italic text-lg">
                      Specifications
                    </h3>
                  </div>
                  <Textarea
                    {...register("details")}
                    placeholder="Write short intro or details of the product..."
                    className="min-h-12.5 rounded-none border-4 border-black font-medium text-lg focus-visible:ring-0"
                  />
                  {errors.details && (
                    <p className="text-red-600 font-bold text-[10px] italic">
                      {errors.details.message}
                    </p>
                  )}
                  <Textarea
                    {...register("description")}
                    placeholder="Describe the product features or marketing write up..."
                    className="min-h-37.5 rounded-none border-4 border-black font-medium text-lg focus-visible:ring-0"
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
                      03
                    </span>
                    <h3 className="font-black uppercase italic text-lg">
                      Visual Assets
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <Label
                      htmlFor="image-upload"
                      className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center border-4 border-dashed border-black bg-gray-50 hover:bg-cyan-50 transition-colors"
                    >
                      <Upload size={48} strokeWidth={3} />
                      <p className="mt-4 font-black uppercase text-center px-4 text-xs">
                        Click to Upload Product Photographs
                      </p>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </Label>

                    <div className="grid grid-cols-3 gap-2">
                      {previews.map((src, i) => (
                        <div
                          key={i}
                          className="relative aspect-square border-2 border-black"
                        >
                          <img
                            src={src}
                            alt="preview"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute -top-2 -right-2 bg-red-500 border-2 border-black p-0.5"
                          >
                            <X size={12} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
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
