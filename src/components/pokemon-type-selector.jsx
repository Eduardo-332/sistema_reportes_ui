"use client"

import { useState } from "react"
import { createReport } from "@/services/report-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function PokemonTypeSelector({
  pokemonTypes,
  selectedType,
  onTypeChange,
  loading,
  onCreated,
}) {
  const [sampleSize, setSampleSize] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  const isValidSampleSize = (value) => {
    if (value === "") return true // permitir vacío (opcional)
    const parsed = parseInt(value)
    return !isNaN(parsed) && parsed > 0
  }

  const handleCreateReport = async () => {
    setError("")

    if (!selectedType) return

    if (!isValidSampleSize(sampleSize)) {
      setError("El número debe ser un entero positivo.")
      return
    }

    try {
      setCreating(true)
      const report = await createReport(selectedType, sampleSize)
      onCreated(report)
      setSampleSize("")
    } catch (error) {
      console.error("Error creando el reporte", error)
      setError("Ocurrió un error al crear el reporte.")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-4 w-full">
      {/* Selector de tipo */}
      {loading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Pokémon type" />
          </SelectTrigger>
          <SelectContent>
            {pokemonTypes.map((type) => (
              <SelectItem key={type.name} value={type.name}>
                <span className="capitalize">{type.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Campo de muestreo aleatorio */}
      <div className="flex flex-col gap-1">
        <input
          type="number"
          min="1"
          className="w-full border rounded px-3 py-2"
          placeholder="Número máximo de registros (opcional)"
          value={sampleSize}
          onChange={(e) => setSampleSize(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Botón */}
      <Button onClick={handleCreateReport} disabled={!selectedType || creating}>
        {creating ? "Generando..." : "Generar Reporte"}
      </Button>
    </div>
  )
}
