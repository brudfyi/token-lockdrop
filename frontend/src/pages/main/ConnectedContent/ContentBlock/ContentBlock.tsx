import React from 'react'
import {UseQueryResult} from 'react-query'
import {ApiError} from '../../../../api'
import {Button, Loading, Typography} from '../../../../components'

import './ContentBlock.css'

type ContentBlockProps = {
  values: (
    | {
        title: string
        isLabel?: boolean
        value?: string
        query: Pick<
          UseQueryResult<any, ApiError>,
          'isFetching' | 'isLoading' | 'error'
        >
      }
    | undefined
  )[][]
  action?: {
    title: string
    loading: boolean
    loadingText: string
    onClick: () => void
    disabled?: boolean
    actionColComponent?: React.ReactNode
  }
}

const ContentBlock = ({values, action}: ContentBlockProps) => {
  return (
    <div className="content-block">
      <div>
        {values.map((valuesRow, rowIndex) => (
          <div className="row" key={rowIndex}>
            {valuesRow.map((data, valueIndex) => {
              if (!data) return null
              const {
                title,
                isLabel,
                value,
                query: {isFetching, isLoading, error},
              } = data
              return (
                <div
                  className={`value ${action ? 'value-mb' : ''} ${
                    valueIndex < valuesRow.length - 1 ? 'mr-4' : ''
                  }`}
                  key={`${title}-${value}`}
                >
                  <div className="row">
                    <Typography variant={isLabel ? 'label' : 'title'}>
                      {title}
                    </Typography>
                    <div className="ml-1">
                      {value && isFetching && <Loading small />}
                    </div>
                  </div>
                  {!error && value !== undefined && !isLoading ? (
                    <Typography>{value}</Typography>
                  ) : isLoading || isFetching ? (
                    <Loading />
                  ) : (
                    <Typography>-</Typography>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {action && (
        <div className="action-col">
          {action.actionColComponent}
          <Button
            loading={action.loading}
            loadingText={action.loadingText}
            disabled={action.disabled}
            onClick={action.onClick}
          >
            {action.title}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ContentBlock
