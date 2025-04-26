"use client"

import { useState, useEffect } from "react"
import { Download, RefreshCw, ArrowUpDown, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ReportsTable({ reports, loading, onRefresh, onDownload, onDelete }) {
  const [refreshing, setRefreshing] = useState(false)
  const [sortedReports, setSortedReports] = useState([])
  const [sortDirection, setSortDirection] = useState("desc")

  const [modalVisible, setModalVisible] = useState(false)
  const [reportToDelete, setReportToDelete] = useState(null)

  useEffect(() => {
    if (!reports || reports.length === 0) {
      setSortedReports([])
      return
    }

    const sorted = [...reports].sort((a, b) => {
      const dateA = new Date(getPropertyValue(a, "updated"))
      const dateB = new Date(getPropertyValue(b, "updated"))
      const isValidDateA = !isNaN(dateA.getTime())
      const isValidDateB = !isNaN(dateB.getTime())

      if (isValidDateA && isValidDateB) {
        return sortDirection === "desc" ? dateB - dateA : dateA - dateB
      }
      if (isValidDateA) return sortDirection === "desc" ? -1 : 1
      if (isValidDateB) return sortDirection === "desc" ? 1 : -1
      return 0
    })

    setSortedReports(sorted)
  }, [reports, sortDirection])

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"))
  }

  const getPropertyValue = (obj, prop) => {
    if (obj[prop] !== undefined) return obj[prop]

    const lowerProp = prop.toLowerCase()
    const foundKey = Object.keys(obj).find((k) => k.toLowerCase() === lowerProp)
    return foundKey ? obj[foundKey] : "N/A"
  }

  const isStatusCompleted = (report) => {
    const status = getPropertyValue(report, "status")
    return status && status.toLowerCase() === "completed"
  }

  const handleDownload = (report) => {
    const url = getPropertyValue(report, "url")
    if (!url || url === "N/A") {
      toast.error("URL de descarga no disponible")
      return
    }
    onDownload(url)
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await onRefresh()
      toast.success("Los reportes han sido actualizados correctamente")
    } catch {
      toast.error("No se pudieron actualizar los reportes. Intenta de nuevo.")
    } finally {
      setRefreshing(false)
    }
  }

  const askDelete = (report) => {
    setReportToDelete(report)
    setModalVisible(true)
  }

  const confirmDelete = async () => {
    const id = getPropertyValue(reportToDelete, "reportId")
    try {
      await onDelete(id)
      toast.success(`Reporte ${id} eliminado correctamente`)
    } catch {
      toast.error("No se pudo eliminar el reporte.")
    } finally {
      setModalVisible(false)
      setReportToDelete(null)
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Reports</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleSortDirection} className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4" />
            <span>{sortDirection === "desc" ? "Más reciente primero" : "Más antiguo primero"}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <Table>
          <TableCaption>List of Pokémon reports available for download</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ReportId</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[150px]">PokemonType</TableHead>
              <TableHead className="w-[200px]">Created</TableHead>
              <TableHead className="w-[200px]">Updated</TableHead>
              <TableHead className="w-[80px]">Download</TableHead>
              <TableHead className="w-[80px]">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReports.length > 0 ? (
              sortedReports.map((report, index) => (
                <TableRow key={getPropertyValue(report, "reportId") !== "N/A" ? getPropertyValue(report, "reportId") : `index-${index}`}>
                  <TableCell>{getPropertyValue(report, "reportId")}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isStatusCompleted(report)
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {getPropertyValue(report, "status")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{getPropertyValue(report, "pokemonType")}</span>
                  </TableCell>
                  <TableCell>{getPropertyValue(report, "created")}</TableCell>
                  <TableCell>{getPropertyValue(report, "updated")}</TableCell>
                  <TableCell>
                    {isStatusCompleted(report) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(report)}
                        title="Download CSV"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {isStatusCompleted(report) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => askDelete(report)}
                        title="Eliminar Reporte"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No reports available
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      )}

      {/* Modal de confirmación */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in space-y-4">
            
            {/* Ícono de advertencia */}
            <div className="flex justify-center">
              <div className="bg-red-100 text-red-600 rounded-full p-4">
                <Trash2 className="h-8 w-8" />
              </div>
            </div>

            {/* Título */}
            <h2 className="text-center text-xl font-bold text-gray-800">¿Eliminar reporte?</h2>

            {/* Descripción */}
            <p className="text-center text-gray-600 text-sm">
              ¿Estás seguro de que deseas eliminar el reporte{" "}
              <span className="font-semibold">{getPropertyValue(reportToDelete, "reportId")}</span>?<br />
              Esta acción no se puede deshacer.
            </p>

            {/* Botones */}
            <div className="flex justify-center gap-4 pt-2">
              <Button variant="outline" onClick={() => setModalVisible(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Eliminar
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
