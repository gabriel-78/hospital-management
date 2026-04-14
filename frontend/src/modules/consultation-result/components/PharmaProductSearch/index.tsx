import { useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useListPharmaProducts } from "@/modules/pharma/hooks";
import { BaseCard } from "@/modules/pharma/components/Cards/Base";
import type { PharmaProductResponse } from "@/modules/pharma/schemas";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface PharmaProductSearchProps {
  onSelect: (product: PharmaProductResponse) => void;
}

const parseNames = (input: string): string[] =>
  input
    .split(";")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

export function PharmaProductSearch({ onSelect }: PharmaProductSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const { value: debouncedSearch, handleValue: handleDebounce } =
    useDebounce<string>("", 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    handleDebounce(e.target.value);
  };

  const names = parseNames(debouncedSearch);

  const { data, isFetching } = useListPharmaProducts(
    { names },
    names.length > 0,
  );

  const products = data?.success ? data.data : [];

  return (
    <div className="flex flex-col gap-3 h-full">
      <Field className="flex flex-col gap-2">
        <FieldLabel>Buscar produto</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="ex: amoxicilina;dipirona;aspirina"
            value={inputValue}
            onChange={handleChange}
          />
        </InputGroup>
      </Field>

      <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pr-0.5">
        {isFetching && (
          <p className="text-sm text-gray-400 text-center py-4">Buscando...</p>
        )}

        {!isFetching && names.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            Digite um nome ou separe múltiplos por{" "}
            <span className="font-medium text-gray-500">;</span>
          </p>
        )}

        {!isFetching && names.length > 0 && products.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            Nenhum produto encontrado.
          </p>
        )}

        {!isFetching &&
          products.map((product) => (
            <BaseCard key={product.id} product={product} onAdd={onSelect} />
          ))}
      </div>
    </div>
  );
}
