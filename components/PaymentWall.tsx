'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getTelegramLoginUrl } from '@/lib/telegram'

interface PaymentWallProps {
  isOpen: boolean
  onClose: () => void
  adminUsername: string
}

export function PaymentWall({ isOpen, onClose, adminUsername }: PaymentWallProps) {
  const telegramUrl = getTelegramLoginUrl(adminUsername)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm p-6">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl text-center text-primary font-serif">
            Unlock Our Collection
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Pay 50% upfront to browse our exclusive clothing collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-secondary p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-2">Step 1:</p>
            <p className="text-foreground font-medium">Send 50% payment to our admin</p>
          </div>

          <Button
            asChild
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-medium"
          >
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
              Contact on Telegram
            </a>
          </Button>

          <div className="bg-secondary p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-2">Step 2:</p>
            <p className="text-foreground font-medium">Share payment proof with us</p>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Once payment is verified, you'll unlock access to our full collection
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onClose}
          className="w-full h-10"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}
