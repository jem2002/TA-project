"use client"

import type React from "react"

import { useState, useCallback, type ChangeEvent } from "react"
import type { ValidationErrors } from "@/types/common.types"

interface UseFormOptions<T> {
  initialValues: T
  validate?: (values: T) => ValidationErrors
  onSubmit: (values: T) => Promise<void> | void
}

export const useForm = <T extends Record<string, any>>({ initialValues, validate, onSubmit }: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target
      const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value

      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }))

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }))
      }
    },
    [errors],
  )

  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }))

      // Validate single field on blur
      if (validate) {
        const fieldErrors = validate(values)
        if (fieldErrors[name]) {
          setErrors((prev) => ({
            ...prev,
            [name]: fieldErrors[name],
          }))
        }
      }
    },
    [values, validate],
  )

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      setIsSubmitting(true)

      // Validate all fields
      if (validate) {
        const validationErrors = validate(values)
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) {
          setIsSubmitting(false)
          return
        }
      }

      try {
        await onSubmit(values)
      } catch (error) {
        console.error("Form submission error:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validate, onSubmit],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }, [])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    isValid: Object.keys(errors).length === 0,
  }
}
