"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

import PokemonTypeSelector from "@/components/pokemon-type-selector"
import ReportsTable from "@/components/reports-table"
import { getPokemonTypes } from "@/services/pokemon-service"
import { getReports, createReport, deleteReport } from "@/services/report-service"

export default function PokemonReportsPage() {
  const [pokemonTypes, setPokemonTypes] = useState([])
  const [reports, setReports] = useState([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [loadingReports, setLoadingReports] = useState(true)
  const [error, setError] = useState(null)
  const [selectedType, setSelectedType] = useState("")

  // Cargar tipos de Pokémon
  useEffect(() => {
    const loadPokemonTypes = async () => {
      try {
        setLoadingTypes(true)
        const types = await getPokemonTypes()
        setPokemonTypes(types)
      } catch (error) {
        console.error("Error loading Pokemon types:", error)
        setError("Error al cargar los tipos de Pokémon. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoadingTypes(false)
      }
    }

    loadPokemonTypes()
  }, [])

  // Cargar reportes
  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      setLoadingReports(true)
      const reportData = await getReports()
      setReports(reportData)
    } catch (error) {
      console.error("Error loading reports:", error)
      setError("Error al cargar los reportes. Por favor, intenta de nuevo más tarde.")
    } finally {
      setLoadingReports(false)
    }
  }

  const handleRefreshTable = async () => {
    await loadReports()
  }

  const handleDownloadCSV = (url) => {
    window.open(url, "_blank")
  }

  const handleCreated = (newReport) => {
    setReports((prev) => [...prev, newReport])
    toast.success(`Se ha generado un nuevo reporte para el tipo ${newReport.pokemonType}.`)
  }

  const handleDeleted = async (id) => {
    try {
      await deleteReport(id)
      setReports((prev) => prev.filter((r) => r.reportId !== id))
    } catch (err) {
      toast.error("No se pudo eliminar el reporte.")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Pokémon Reports Generator</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full">
              <PokemonTypeSelector
                pokemonTypes={pokemonTypes}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                loading={loadingTypes}
                onCreated={handleCreated}
              />
            </div>
          </div>

          <ReportsTable
            reports={reports}
            loading={loadingReports}
            onRefresh={handleRefreshTable}
            onDownload={handleDownloadCSV}
            onDelete={handleDeleted}
          />
        </CardContent>
      </Card>
    </div>
  )
}
