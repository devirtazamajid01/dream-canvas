import { useState, useCallback, useRef, useEffect } from 'react'
import { FormState } from '@/types/api'
import { validators } from '@/utils/validation'

interface UseFormOptions<T> {
    initialValues: T
    validators?: Record<keyof T, (value: unknown) => string | null>
    onSubmit?: (values: T) => void | Promise<void>
    validateOnChange?: boolean
    validateOnBlur?: boolean
}

export const useForm = <T extends Record<string, unknown>>(
    options: UseFormOptions<T>
) => {
    const {
        initialValues,
        validators: fieldValidators = {} as Record<
            keyof T,
            (value: unknown) => string | null
        >,
        onSubmit,
        validateOnChange = true,
        validateOnBlur = true,
    } = options

    const [formState, setFormState] = useState<FormState<T>>({
        values: initialValues,
        errors: [],
        isSubmitting: false,
        isValid: true,
    })

    const touchedFields = useRef<Set<keyof T>>(new Set())

    const validateField = useCallback(
        (field: keyof T, value: unknown): string | null => {
            const validator = fieldValidators[field]
            return validator ? validator(value) : null
        },
        [fieldValidators]
    )

    const validateAllFields = useCallback((): Record<keyof T, string> => {
        const errors: Record<keyof T, string> = {} as Record<keyof T, string>

        for (const field of Object.keys(initialValues) as (keyof T)[]) {
            const error = validateField(field, formState.values[field])
            if (error) {
                errors[field] = error
            }
        }

        return errors
    }, [formState.values, validateField, initialValues])

    const setFieldValue = useCallback(
        (field: keyof T, value: unknown) => {
            setFormState((prev) => ({
                ...prev,
                values: {
                    ...prev.values,
                    [field]: value,
                },
            }))

            if (validateOnChange && touchedFields.current.has(field)) {
                const error = validateField(field, value)
                setFormState((prev) => ({
                    ...prev,
                    errors: prev.errors
                        .filter((e) => e.field !== field)
                        .concat(
                            error
                                ? [{ field: field as string, message: error }]
                                : []
                        ),
                }))
            }
        },
        [validateField, validateOnChange]
    )

    const setFieldError = useCallback((field: keyof T, message: string) => {
        setFormState((prev) => ({
            ...prev,
            errors: prev.errors
                .filter((e) => e.field !== field)
                .concat([{ field: field as string, message }]),
        }))
    }, [])

    const clearFieldError = useCallback((field: keyof T) => {
        setFormState((prev) => ({
            ...prev,
            errors: prev.errors.filter((e) => e.field !== field),
        }))
    }, [])

    const handleBlur = useCallback(
        (field: keyof T) => {
            touchedFields.current.add(field)

            if (validateOnBlur) {
                const error = validateField(field, formState.values[field])
                setFormState((prev) => ({
                    ...prev,
                    errors: prev.errors
                        .filter((e) => e.field !== field)
                        .concat(
                            error
                                ? [{ field: field as string, message: error }]
                                : []
                        ),
                }))
            }
        },
        [formState.values, validateField, validateOnBlur]
    )

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault()

            // Mark all fields as touched
            Object.keys(initialValues).forEach((field) => {
                touchedFields.current.add(field as keyof T)
            })

            // Validate all fields
            const errors = validateAllFields()
            const errorEntries = Object.entries(errors).map(
                ([field, message]) => ({
                    field,
                    message,
                })
            )

            setFormState((prev) => ({
                ...prev,
                errors: errorEntries,
                isSubmitting: true,
                isValid: errorEntries.length === 0,
            }))

            if (errorEntries.length === 0 && onSubmit) {
                try {
                    await onSubmit(formState.values)
                } catch (error) {
                    console.error('Form submission error:', error)
                } finally {
                    setFormState((prev) => ({ ...prev, isSubmitting: false }))
                }
            } else {
                setFormState((prev) => ({ ...prev, isSubmitting: false }))
            }
        },
        [formState.values, validateAllFields, onSubmit, initialValues]
    )

    const reset = useCallback(() => {
        setFormState({
            values: initialValues,
            errors: [],
            isSubmitting: false,
            isValid: true,
        })
        touchedFields.current.clear()
    }, [initialValues])

    const setValues = useCallback((values: Partial<T>) => {
        setFormState((prev) => ({
            ...prev,
            values: { ...prev.values, ...values },
        }))
    }, [])

    // Update isValid whenever errors change
    useEffect(() => {
        setFormState((prev) => ({
            ...prev,
            isValid: prev.errors.length === 0,
        }))
    }, [formState.errors])

    return {
        values: formState.values,
        errors: formState.errors,
        isSubmitting: formState.isSubmitting,
        isValid: formState.isValid,
        setFieldValue,
        setFieldError,
        clearFieldError,
        handleBlur,
        handleSubmit,
        reset,
        setValues,
        getFieldError: (field: keyof T) =>
            formState.errors.find((e) => e.field === field)?.message || null,
        hasFieldError: (field: keyof T) =>
            formState.errors.some((e) => e.field === field),
    }
}

// Common form field hooks
export const useTextField = <T extends Record<string, unknown>>(
    form: ReturnType<typeof useForm<T>>,
    field: keyof T
) => {
    return {
        value: form.values[field] as string,
        error: form.getFieldError(field),
        hasError: form.hasFieldError(field),
        onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => form.setFieldValue(field, e.target.value),
        onBlur: () => form.handleBlur(field),
    }
}

export const useSelectField = <T extends Record<string, unknown>>(
    form: ReturnType<typeof useForm<T>>,
    field: keyof T
) => {
    return {
        value: form.values[field] as string,
        error: form.getFieldError(field),
        hasError: form.hasFieldError(field),
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
            form.setFieldValue(field, e.target.value),
        onBlur: () => form.handleBlur(field),
    }
}

// Export validators for convenience
export { validators }
