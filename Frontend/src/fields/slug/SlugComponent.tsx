'use client'
import React, { useCallback } from 'react'
import { TextFieldClientProps } from 'payload'
import { useField, Button, TextInput, FieldLabel, useFormFields, useForm } from '@payloadcms/ui'
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
  const fieldPath = path || field.name
  
  // Add validation for required props
  if (!fieldPath) {
    console.error('SlugComponent: No field path provided')
    return <div>Error: No field path provided</div>
  }

  const checkboxFieldPath = path?.includes('.')
    ? `${path}.${checkboxFieldPathFromProps}`
    : checkboxFieldPathFromProps

  // Add error handling for useField
  let fieldHook
  try {
    fieldHook = useField<string>({ 
      path: fieldPath
    })
  } catch (error) {
    console.error('useField error:', error, { fieldPath, field })
    return <div>Error loading field: {fieldPath}</div>
  }

  if (!fieldHook) {
    console.error('useField returned undefined for path:', fieldPath)
    return <div>Error: Field not initialized</div>
  }

  const { value, setValue } = fieldHook
  const { dispatchFields, getDataByPath } = useForm()
  
  const isLocked = useFormFields(([fields]) => {
    return fields[checkboxFieldPath]?.value as boolean
  })

  const handleGenerate = useCallback(
    (e: React.MouseEvent<Element>) => {
      e.preventDefault()
      
      if (!getDataByPath) {
        console.error('getDataByPath not available')
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

  const handleLock = useCallback(
    (e: React.MouseEvent<Element>) => {
      e.preventDefault()
      
      if (!dispatchFields) {
        console.error('dispatchFields not available')
        return
      }

      dispatchFields({
        type: 'UPDATE',
        path: checkboxFieldPath,
        value: !isLocked,
      })
    },
    [isLocked, checkboxFieldPath, dispatchFields],
  )

  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper">
        <FieldLabel htmlFor={`field-${fieldPath}`} label={label} />
        {!isLocked && (
          <Button className="lock-button" buttonStyle="none" onClick={handleGenerate}>
            Generate
          </Button>
        )}
        <Button className="lock-button" buttonStyle="none" onClick={handleLock}>
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