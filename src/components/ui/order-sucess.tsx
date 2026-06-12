"use client";

import { Check, Package, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full border-4 border-black bg-white p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(37,99,235,1)]">
        {/* SUCCESS ICON */}
        <div className="w-20 h-20 bg-green-500 border-4 border-black flex items-center justify-center mb-8 rotate-3">
          <Check className="w-12 h-12 text-white stroke-[4px]" />
        </div>

        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">
          ACQUISITION <br /> COMPLETE.
        </h1>

        <div className="border-l-4 border-black pl-6 py-2 mb-8">
          <p className="font-mono text-sm uppercase font-bold text-gray-500 mb-2">
            Order ID: #BC-99284-X
          </p>
          <p className="font-bold text-lg leading-tight">
            The logistics team has been notified. Your hardware is being prepped
            for deployment.
          </p>
        </div>

        {/* ORDER SUMMARY PREVIEW */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 border-2 border-black p-4">
            <p className="text-[10px] font-black uppercase text-gray-400">
              ETA
            </p>
            <p className="font-black text-xl italic">24-48 HRS</p>
          </div>
          <div className="bg-gray-50 border-2 border-black p-4">
            <p className="text-[10px] font-black uppercase text-gray-400">
              Ship Method
            </p>
            <p className="font-black text-xl italic">PRIORITY</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1 rounded-none bg-black text-white h-16 font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
            Track Shipment <Package className="ml-2 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="rounded-none border-4 border-black h-16 px-8 font-black uppercase tracking-widest hover:bg-yellow-300 transition-all"
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>

        <button className="mt-8 text-xs font-black uppercase italic underline decoration-2 hover:text-blue-600 transition-colors">
          Return to HQ (Homepage)
        </button>
      </div>
    </div>
  );
}
