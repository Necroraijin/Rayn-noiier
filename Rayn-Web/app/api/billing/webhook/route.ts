import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

const stripeSecret = process.env.STRIPE_SECRET_KEY || ""
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2025-01-27.acacia" as any }) : null
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 501 })
    }

    const body = await req.text()
    const signature = req.headers.get("stripe-signature") || ""

    let event: Stripe.Event

    try {
      if (webhookSecret && signature) {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      } else {
        // Fallback or dry-run mode for development if webhook secret is not set yet
        const rawJson = JSON.parse(body)
        event = rawJson as Stripe.Event
      }
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the specific event types
    if (event.type === "checkout.session.completed" || event.type === "customer.subscription.updated") {
      const session = event.data.object as Stripe.Checkout.Session
      const metadata = session.metadata || {}
      const tenantId = metadata.tenantId
      const plan = metadata.plan

      if (tenantId && plan) {
        // Sync limits to database
        const limits: Record<string, { ctx: number; budget: number; seats: number }> = {
          professional: { ctx: 100000, budget: 20000000, seats: 10 },
          enterprise: { ctx: 200000, budget: 50000000, seats: 25 },
          unlimited: { ctx: 500000, budget: 200000000, seats: 99 },
        }

        const selectedLimits = limits[plan] || limits.professional

        // Update database
        await prisma.tenant.update({
          where: { id: tenantId },
          data: {
            plan,
            seatsTotal: selectedLimits.seats,
            aiContextLimit: selectedLimits.ctx,
            aiMonthlyBudget: selectedLimits.budget,
          },
        })

        // Log the event
        await prisma.auditLog.create({
          data: {
            tenantId,
            category: "BILLING",
            event: "SUBSCRIPTION_SYNCHRONIZED",
            actor: "Stripe Webhook",
            ip: "127.0.0.1",
            severity: "INFO",
            details: `Stripe event ${event.type} processed. Upgraded tenant ${tenantId} to plan ${plan} with ${selectedLimits.seats} seats.`,
          },
        })

        console.log(`Successfully updated billing plan for tenant: ${tenantId} to ${plan}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Stripe webhook process error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
