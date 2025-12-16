import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/product
export async function GET() {
  try {
    const products = await prisma.products.findMany({
      orderBy: { id: 'asc' },
    })
    return NextResponse.json(products)
  } catch (e) {
    console.error('GET /api/product error:', e)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST /api/product
export async function POST(req) {
  try {
    const data = await req.json()

    // Basic validation
    if (
      !data?.name ||
      !data?.category ||
      !data?.subcategory ||
      data?.price == null ||
      data?.stock == null ||
      !data?.code
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await prisma.products.create({
      data: {
        name: String(data.name),
        category: String(data.category),
        subcategory: String(data.subcategory),
        price: Number(data.price),
        stock: Number(data.stock),
        code: String(data.code),
        image: data.image ? String(data.image) : null,
        description: data.description ? String(data.description) : null,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (e) {
    console.error('POST /api/product error:', e)
    // Prisma unique constraint error code
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'Product code must be unique' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

// PUT /api/product
export async function PUT(req) {
  try {
    const data = await req.json()
    if (!data?.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const updated = await prisma.products.update({
      where: { id: Number(data.id) },
      data: {
        ...(data.name != null && { name: String(data.name) }),
        ...(data.category != null && { category: String(data.category) }),
        ...(data.subcategory != null && { subcategory: String(data.subcategory) }),
        ...(data.price != null && { price: Number(data.price) }),
        ...(data.stock != null && { stock: Number(data.stock) }),
        ...(data.code != null && { code: String(data.code) }),
        ...(data.image !== undefined && { image: data.image ? String(data.image) : null }),
        ...(data.description !== undefined && { description: data.description ? String(data.description) : null }),
      },
    })

    return NextResponse.json(updated)
  } catch (e) {
    console.error('PUT /api/product error:', e)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/product?id=123
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const idParam = searchParams.get('id')
    if (!idParam) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await prisma.products.delete({ where: { id: Number(idParam) } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('DELETE /api/product error:', e)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
