'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Product } from '@/lib/supabase'
import { orderFormSchema, OrderFormData } from '@/lib/form-schema'

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onSuccess: () => void
}

export function OrderForm({ isOpen, onClose, product, onSuccess }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
  })

  const onSubmit = async (data: OrderFormData) => {
    if (!product) return

    setIsSubmitting(true)
    try {
      // Submit order via API
      const response = await fetch('/api/webhooks/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: data.customerName,
          phone: data.phone,
          address: data.address,
          telegram_username: data.telegramUsername,
          product_id: product.id,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit order')

      reset()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Order submission error:', error)
      alert('Failed to submit order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary font-serif">
            Complete Your Order
          </DialogTitle>
          <DialogDescription>
            Enter your details to place the order. We'll contact you within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="customerName">Full Name</FieldLabel>
              <Input
                id="customerName"
                {...register('customerName')}
                placeholder="John Doe"
                minLength={16}
                disabled={isSubmitting}
              />
              {errors.customerName && (
                <FieldError>{errors.customerName.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+998901234567"
                minLength={16}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <FieldError>{errors.phone.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="address">Delivery Address</FieldLabel>
              <Textarea
                id="address"
                {...register('address')}
                placeholder="Street, Building, Apartment, City, Postal Code"
                minLength={16}
                disabled={isSubmitting}
                className="min-h-24"
              />
              {errors.address && (
                <FieldError>{errors.address.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="telegramUsername">Telegram Username</FieldLabel>
              <Input
                id="telegramUsername"
                {...register('telegramUsername')}
                placeholder="username"
                minLength={16}
                disabled={isSubmitting}
              />
              {errors.telegramUsername && (
                <FieldError>{errors.telegramUsername.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <div className="bg-secondary p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Order Summary</p>
            <p className="text-lg font-semibold text-foreground">
              ${product?.price.toFixed(2) || '0.00'}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Submitting...
                </>
              ) : (
                'Place Order'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
