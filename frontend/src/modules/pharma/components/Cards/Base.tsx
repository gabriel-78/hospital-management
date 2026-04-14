import { IconButton } from "@/components/ui/icon-button";
import { Plus } from "lucide-react";
import { memo, useCallback } from "react";
import type { PharmaProductResponse } from "../../schemas";

interface BaseCardProps {
  product: PharmaProductResponse;
  onAdd: (product: PharmaProductResponse) => void;
}

export const BaseCard = memo(function BaseCard({
  product,
  onAdd,
}: BaseCardProps) {
  const handleAdd = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onAdd(product);
    },
    [onAdd, product],
  );

  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-gray-800 truncate">
          {product.name}
        </span>
        <span className="text-xs text-gray-500 truncate">
          {product.activeIngredient}
        </span>
      </div>

      <IconButton
        type="button"
        className="shrink-0 ml-2"
        onClick={handleAdd}
      >
        <Plus />
      </IconButton>
    </div>
  );
});

BaseCard.displayName = "PharmaProductBaseCard";
