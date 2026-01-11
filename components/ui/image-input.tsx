"use client"

import { useState, useRef } from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Image as ImageIcon, Upload, X } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface ImageInputProps {
    value?: string
    onChange: (value: string) => void
    onBlur?: () => void
    name?: string
    oldImageUrl?: string // For cleanup when updating
}

export function ImageInput({ value = "", onChange, onBlur, name, oldImageUrl }: ImageInputProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [previewError, setPreviewError] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image size should be less than 10MB')
            return
        }

        try {
            setIsUploading(true)
            const formData = new FormData()
            formData.append('file', file)

            // Include old image URL for cleanup if provided
            if (oldImageUrl) {
                formData.append('oldImageUrl', oldImageUrl)
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Upload failed')
            }

            const data = await response.json()
            onChange(data.url)
            setPreviewError(false)
            toast.success('Image uploaded successfully')
        } catch (error) {
            console.error('Error uploading file:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to upload image')
        } finally {
            setIsUploading(false)
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleImageError = () => {
        setPreviewError(true)
        toast.error('Failed to load image preview')
    }

    const handleClearImage = async () => {
        // If there's a current image URL and it's from Cloudinary, delete it
        if (value && value.includes('cloudinary.com')) {
            try {
                const response = await fetch('/api/upload', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ imageUrl: value }),
                })

                if (response.ok) {
                    toast.success('Previous image removed from storage')
                }
            } catch (error) {
                console.error('Error deleting image:', error)
                // Don't show error to user as this is cleanup
            }
        }

        onChange("")
        setPreviewError(false)
    }

    return (
        <div className="flex gap-2 items-center">
            <Input
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value)
                    setPreviewError(false)
                }}
                onBlur={onBlur}
                name={name}
                placeholder="Enter image URL or upload a file"
                className="flex-1"
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Upload image"
            >
                {isUploading ? (
                    <Upload className="h-4 w-4 animate-spin" />
                ) : (
                    <Upload className="h-4 w-4" />
                )}
            </Button>

            {value && (
                <>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleClearImage}
                        title="Clear image"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <div className="relative h-10 w-10">
                        {!previewError ? (
                            <Image
                                src={value}
                                alt="Preview"
                                fill
                                className="h-10 w-10 object-cover rounded-md"
                                onError={handleImageError}
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
