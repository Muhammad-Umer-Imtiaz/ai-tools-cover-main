'use client'
import React, { useCallback } from 'react'
import { TextFieldClientProps } from 'payload'
import {
  useField,
  Button,
  TextInput,
  FieldLabel,
  useFormFields,
  useForm,
} from '@payloadcms/ui'
import { formatSlug } from './formatSlug'
import './index.scss'

type SlugComponentProps = {
  fieldToUse: string
  checkboxFieldPath: string
} & TextFieldClientProps

export const SlugComponent: React.FC<SlugComponentProps> = ({
  field,
  fieldToUse,
  checkboxFieldPath: checkboxFieldPathFromProps,
  path,
  readOnly: readOnlyFromProps,
}) => {
  const { label } = field
  const fieldPath = path || field?.name

  // ✅ Ensure fieldPath exists BEFORE using useField
  if (!fieldPath) {
    console.error('SlugComponent: No field path provided')
    return <div>Error: No field path provided</div>
  }

  // ✅ Fixed usage of useField with proper error handling
  let fieldHook
  try {
    fieldHook = useField<string>({
      path: fieldPath,
    })
  } catch (error) {
    console.error('useField hook error:', error)
    return <div>Error: Failed to initialize field hook</div>
  }

  // ✅ Destructure with fallback values
  const { value = '', setValue } = fieldHook || {}

  const { dispatchFields, getDataByPath } = useForm()

  const isLocked = useFormFields(([fields]) => {
    return Boolean(fields[checkboxFieldPathFromProps]?.value)
  })

  // ✅ Generate slug from target field
  const handleGenerate = useCallback(
    (e: React.MouseEvent<Element>) => {
      e.preventDefault()

      if (!setValue) {
        console.error('setValue function not available')
        return
      }

      const targetFieldValue = getDataByPath(fieldToUse) as string

      if (targetFieldValue) {
        const formattedSlug = formatSlug(targetFieldValue)
        if (value !== formattedSlug) {
          setValue(formattedSlug)
        }
      } else {
        if (value !== '') {
          setValue('')
        }
      }
    },
    [setValue, value, fieldToUse, getDataByPath],
  )

  // ✅ Lock/unlock field
  const handleLock = useCallback(
    (e: React.MouseEvent<Element>) => {
      e.preventDefault()

      dispatchFields({
        type: 'UPDATE',
        path: checkboxFieldPathFromProps,
        value: !isLocked,
      })
    },
    [isLocked, checkboxFieldPathFromProps, dispatchFields],
  )

  // ✅ Render UI with additional safety checks
  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper">
        <FieldLabel htmlFor={`field-${fieldPath}`} label={label} />
        {!isLocked && (
          <Button
            className="lock-button"
            buttonStyle="none"
            onClick={handleGenerate}
          >
            Generate
          </Button>
        )}
        <Button
          className="lock-button"
          buttonStyle="none"
          onClick={handleLock}
        >
          {isLocked ? 'Unlock' : 'Lock'}
        </Button>
      </div>
      <TextInput
        value={value || ''}
        onChange={setValue}
        path={fieldPath}
        readOnly={Boolean(readOnlyFromProps || isLocked)}
      />
    </div>
  )
}