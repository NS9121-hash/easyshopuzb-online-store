'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SuccessMessageProps {
  isOpen: boolean
  onClose: () => void
}

export function SuccessMessage({ isOpen, onClose }: SuccessMessageProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            <span className="text-4xl block mb-4">✓</span>
            Order Accepted!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-center">
          <p className="text-foreground text-base">
            Thank you for your order. Our team will contact you within <span className="font-semibold">24 hours</span> to confirm details.
          </p>

          <div className="bg-secondary p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
            <p className="text-lg font-semibold text-foreground">7-15 days</p>
          </div>

          <p className="text-sm text-muted-foreground">
            We'll send updates to your Telegram account as your order progresses.
          </p>
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 mt-4"
        >
          Continue Shopping
        </Button>
      </DialogContent>
    </Dialog>
  )
}
