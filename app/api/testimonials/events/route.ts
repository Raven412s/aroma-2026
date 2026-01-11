import { connectToDb } from "@/lib/mongodb";
import  Testimonial  from "@/models/Testimonial";
import { NextResponse } from "next/server";

export async function GET() {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            try {
                await connectToDb();

                // Initial fetch of active testimonials
                const testimonials = await Testimonial.find({ isActive: true })
                    .sort({ createdAt: -1 })
                    .limit(3);

                // Send initial data
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(testimonials)}\n\n`)
                );

                // Set up change stream
                const changeStream = Testimonial.watch();

                // Listen for changes
                changeStream.on('change', async () => {
                    const updatedTestimonials = await Testimonial.find({ isActive: true })
                        .sort({ createdAt: -1 })
                        .limit(3);

                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify(updatedTestimonials)}\n\n`)
                    );
                });

                // Handle client disconnect
                return () => {
                    changeStream.close();
                };
            } catch (error) {
                console.error('Error in testimonials SSE:', error);
                controller.close();
            }
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
