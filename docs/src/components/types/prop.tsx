import React from 'react'
import Badge from '@pluralsight/ps-design-system-badge'
import Table from '@pluralsight/ps-design-system-table'
import { TableContext } from './table'

import * as styles from './prop.module.css'
interface PropProps {
  name: string
  type: React.ReactNode
  desc: React.ReactNode
  default?: React.ReactNode
  required?: boolean
}
export const Prop: React.FC<PropProps> = props => {
  const defaultColumn = React.useContext(TableContext)
  return (
    <Table.Row>
      <Table.Cell>
        <code className={styles.nameCode}>{props.name}</code>

        {props.required && (
          <span className={styles.required}>
            <Badge appearance={Badge.appearances.subtle}>Required</Badge>
          </span>
        )}
      </Table.Cell>

      <Table.Cell>
        <code className={styles.typeCode}>{props.type}</code>
      </Table.Cell>

      <Table.Cell className={styles.desc}>{props.desc}</Table.Cell>

      {defaultColumn ? (
        <Table.Cell>
          <code className={styles.defaultCode}>{props.default}</code>
        </Table.Cell>
      ) : null}
    </Table.Row>
  )
}
