"use client"

import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function ConfirmDialog({ open, title, description, reportId, onCancel }) {
  const handleConfirm = async () => {
    try {
      await fetch(`https://api-pokequeue-dev-333.azurewebsites.net/api/report/${reportId}`, {
        method: 'DELETE',
      })
      window.location.reload()
    } catch (error) {
      console.error("Error deleting report:", error)
      // Opcional: mostrar mensaje de error
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p>{description}</p>
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
