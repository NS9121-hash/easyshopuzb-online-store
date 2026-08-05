import admin from 'firebase-admin'

// NOTE:
// This route is a server (Node) route that calls the edge poster generator
// (app/api/telegram-poster/route.ts) using a fetch to receive a binary PNG.
// Then it uploads the resulting image to Firebase Storage and updates the
// Firestore product document with poster_url. If poster generation fails,
// it falls back to the original image_url.

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT && JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  })
}

const bucket = admin.storage().bucket()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, title, price, imageUrl } = body

    let posterUrl = imageUrl || null

    try {
      // Call edge poster generator
      const ogUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/telegram-poster`)
      ogUrl.searchParams.set('title', title)
      ogUrl.searchParams.set('price', `${price} so'm`)
      if (imageUrl) ogUrl.searchParams.set('imageUrl', imageUrl)

      const res = await fetch(ogUrl.toString())
      if (!res.ok) throw new Error('OG generator failed')

      const arrayBuffer = await res.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const filePath = `posters/${id}-${Date.now()}.png`
      const file = bucket.file(filePath)
      await file.save(buffer, {
        metadata: {
          contentType: 'image/png',
        },
        public: true,
      })

      posterUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filePath}`
    } catch (err) {
      console.error('Poster creation/upload failed, falling back to original image', err)
    }

    // Update Firestore document
    const db = admin.firestore()
    await db.collection('products').doc(id).set({ poster_url: posterUrl }, { merge: true })

    return new Response(JSON.stringify({ ok: true, posterUrl }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ ok: false }), { status: 500 })
  }
}
