import EditTestimonialForm from "@/components/forms/EditTestimonialForm"
import { Types } from "mongoose"

interface PageProps {
    params: Promise<{
        id: Types.ObjectId
    }>
}

export default async function EditTestimonialPage({ params }: PageProps) {
    const { id } = await params
    return <EditTestimonialForm id={id} />
}
