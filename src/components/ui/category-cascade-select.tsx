"use client";

import { useMemo } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES, type Category, type Subcategory } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

type CategoryNode = Category | Subcategory;

function childrenOf(node: CategoryNode): Subcategory[] {
  return node.subcategories ?? [];
}

function resolveChain(path: string[]): CategoryNode[] {
  const chain: CategoryNode[] = [];
  let list: CategoryNode[] = CATEGORIES;
  for (const slug of path) {
    const found = list.find((node) => node.slug === slug);
    if (!found) break;
    chain.push(found);
    list = childrenOf(found);
  }
  return chain;
}

export interface CategoryCascadeValue {
  categorySlug: string;
  subCategorySlug?: string;
}

/**
 * Inline category flow selector. Renders one list at a time, embedded directly
 * in the form (no popup/portal). Picking an item with children swaps the list
 * in place to that item's children; picking a leaf (no children) just leaves
 * that list showing with the leaf checked. A back step steps up one level.
 */
export function CategoryCascadeSelect({
  value,
  onChange,
  error,
}: {
  value: CategoryCascadeValue;
  onChange: (value: CategoryCascadeValue) => void;
  error?: string;
}) {
  const path = useMemo(
    () => [value.categorySlug, value.subCategorySlug].filter(Boolean) as string[],
    [value.categorySlug, value.subCategorySlug]
  );
  const chain = useMemo(() => resolveChain(path), [path]);

  // Picks which list is currently shown: a node's children once it's picked,
  // or — once the deepest pick is a leaf — the sibling list it came from, so
  // the admin can still switch to a different option at that same level.
  const { list, basePath, highlightSlug, headerLabel } = useMemo(() => {
    if (chain.length === 0) {
      return {
        list: CATEGORIES as CategoryNode[],
        basePath: [] as string[],
        highlightSlug: undefined as string | undefined,
        headerLabel: null as string | null,
      };
    }
    const last = chain[chain.length - 1];
    const lastChildren = childrenOf(last);
    if (lastChildren.length > 0) {
      return {
        list: lastChildren as CategoryNode[],
        basePath: path.slice(0, chain.length),
        highlightSlug: undefined,
        headerLabel: last.name,
      };
    }
    const parentList: CategoryNode[] = chain.length === 1 ? CATEGORIES : childrenOf(chain[chain.length - 2]);
    const base = path.slice(0, chain.length - 1);
    return {
      list: parentList,
      basePath: base,
      highlightSlug: last.slug,
      headerLabel: base.length > 0 ? chain[base.length - 1].name : null,
    };
  }, [chain, path]);

  const goBack = () => {
    const trimmed = basePath.slice(0, -1);
    onChange({ categorySlug: trimmed[0] ?? "", subCategorySlug: trimmed[1] });
  };

  const pickNode = (node: CategoryNode) => {
    const newPath = [...basePath, node.slug];
    onChange({ categorySlug: newPath[0], subCategorySlug: newPath[1] });
  };

  return (
    <div>
      <div className="border-4 border-black bg-white">
        <div className="flex items-center justify-between gap-3 border-b-2 border-black bg-gray-50 px-3 py-2">
          {basePath.length > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="flex shrink-0 items-center gap-1 font-black uppercase text-xs hover:underline"
            >
              <ChevronLeft size={14} strokeWidth={3} />
              {headerLabel}
            </button>
          ) : (
            <span className="font-black uppercase text-xs opacity-60">Select a category</span>
          )}
          {chain.length > 0 && (
            <span className="truncate text-[10px] font-bold uppercase opacity-50 text-right">
              {chain.map((n) => n.name).join(" › ")}
            </span>
          )}
        </div>

        <div className="max-h-56 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#d1d5db_transparent]">
          {list.map((node) => {
            const isSelected = node.slug === highlightSlug;
            const hasChildren = childrenOf(node).length > 0;
            return (
              <button
                key={node.slug}
                type="button"
                onClick={() => pickNode(node)}
                className={cn(
                  "flex w-full items-center gap-2 border-b border-gray-100 px-3 py-2.5 text-left text-sm font-bold transition-colors hover:bg-yellow-300",
                  isSelected && "bg-yellow-100"
                )}
              >
                {"icon" in node && node.icon && <span>{node.icon}</span>}
                <span className="flex-1 truncate">{node.name}</span>
                {isSelected && <Check size={14} strokeWidth={3} />}
                {hasChildren && <ChevronRight size={14} strokeWidth={3} className="opacity-50" />}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="text-red-600 font-bold text-[10px] italic mt-1">{error}</p>}
    </div>
  );
}
