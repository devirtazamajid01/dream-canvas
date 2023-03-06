import React from 'react'
import { useForm, validators } from '@/hooks/useForm'
import { useAsync } from '@/hooks/useAsync'
import { useTextField, useSelectField } from '@/hooks/useForm'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SizeSelector from '@/components/SizeSelector'
import { IMAGE_SIZES } from '@/constant'
import imageService from '@/services/image.service'
import { Image } from '@/types/api'
import { sanitizePrompt } from '@/utils/validation'

interface ImageGeneratorProps {
    onImageGenerated: (image: Image) => void
    onError: (error: string) => void
}

interface FormValues extends Record<string, unknown> {
    prompt: string
    size: string
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
    onImageGenerated,
    onError,
}) => {
    const form = useForm<FormValues>({
        initialValues: {
            prompt: '',
            size: IMAGE_SIZES[0]?.value || 'Small',
        },
        validators: {
            prompt: (value) => {
                const error = validators.required(value)
                if (error) return error

                const sanitized = sanitizePrompt(value as string)
                if (sanitized.length < 3) {
                    return 'Prompt must be at least 3 characters long'
                }
                if (sanitized.length > 1000) {
                    return 'Prompt must be less than 1000 characters'
                }
                return null
            },
            size: validators.required,
        },
        onSubmit: async (values) => {
            const sanitizedPrompt = sanitizePrompt(values.prompt)
            const response = await imageService.generateImage({
                prompt: sanitizedPrompt,
                size: values.size as 'Small' | 'Medium' | 'Large',
            })

            if (response.success && response.data) {
                onImageGenerated(response.data)
                form.reset()
            } else {
                onError(response.message || 'Failed to generate image')
            }
        },
    })

    const promptField = useTextField(form, 'prompt')
    const sizeField = useSelectField(form, 'size')

    const { execute, isLoading, error } = useAsync(
        async () => {
            await form.handleSubmit()
        },
        {
            onError: (error: string) => onError(error),
        }
    )

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        await execute()
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <Input
                        {...promptField}
                        label="Describe your image"
                        placeholder="A beautiful sunset over mountains..."
                        helperText="Be creative and descriptive for better results"
                        fullWidth
                        rows={3}
                        as="textarea"
                        error={promptField.error || ''}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Image Size
                    </label>
                    <SizeSelector
                        value={sizeField.value}
                        onValueChange={form.setFieldValue.bind(null, 'size')}
                    />
                </div>

                {error && <ErrorMessage message={error} onRetry={execute} />}

                <Button
                    type="submit"
                    loading={isLoading}
                    loadingText="Generating image..."
                    fullWidth
                    size="lg"
                    disabled={!form.isValid}
                    onClick={() => execute()}
                >
                    Generate Image
                </Button>
            </form>
        </div>
    )
}

export default ImageGenerator
