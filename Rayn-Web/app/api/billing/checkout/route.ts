import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

// Initialize Stripe with the secret key from environment
const stripeSecret = process.env.STRIPE_SECRET_KEY || ""
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2025-01-27.acacia" as any }) : null

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe API is not configured. Please add STRIPE_SECRET_KEY to your environment variables." },
        { status: 501 }
      )
    }

    const session = await getServerSession()
    const tenantId = (session?.user as any)?.tenantId || "rayn"
    
    const { plan } = await req.json()
    if (!plan || !["professional", "enterprise", "unlimited"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    const appUrl = process.env.APP_URL || "http://localhost:3000"

    // Map plans to mock Stripe Price IDs (or use user configured values)
    const priceMap: Record<string, string> = {
      professional: process.env.STRIPE_PRICE_PROFESSIONAL || "price_mock_professional_2500",
      enterprise: process.env.STRIPE_PRICE_ENTERPRISE || "price_mock_enterprise_4500",
      unlimited: process.env.STRIPE_PRICE_UNLIMITED || "price_mock_unlimited_9500",
    }

    const priceId = priceMap[plan]

    // Create a Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        tenantId,
        plan,
      },
      success_url: `${appUrl}/settings?billing_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/settings?billing_cancel=true`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error("Stripe checkout session error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
