import React, {useMemo} from 'react'
import styled from 'styled-components'
import {IntervalNumber, Voicing} from '../../../types'
import {Colors, SPACING_LENGTHS} from '../../common/style-constants'
import {SuperScript} from '../../common/typography'
import classNames from 'classnames'
import {gridVoicingToVoicing, voicingToGridVoicing} from '../../../utils/music/chords'

const StyledTable = styled.table`
  border: none;
`

const TableRow = styled.tr`
  td {
    height: 1.75em;
    vertical-align: middle;
  }
  
  &.common {
    td {
      height: 2em;
    }
  }
  
  &.rare {
    td {
      height: 1.5em;
    }
  }
  
  td:first-child {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 1em;
    white-space: nowrap;
    border-left: none;
    font-size: 1em;
    min-width: 6.5em;
    color: #ffffff;
    
    span {
      opacity: 0.87;
    }
    
    span.common {
      opacity: 0.6;
    }
    
    span.rare {
      opacity: 0.4;
      font-size: 0.8em;
    }
    
    span.separator {
      padding: 0 ${SPACING_LENGTHS.xs};
    }
  }
  
  &.active {
    td:first-child{
      font-weight: bold;
    }
  }
 
  td:not(:first-child) {
    width: 2em;
  }
  
  td:last-child{
    border-right: none;
  }
  
  &:hover {
    td {
      filter: brightness(1.2);
    }
    td:first-child {
      background: #262626;
    }
  }
`

const ColoredTd = styled.td<{color: string}>`
  background: ${p => p.color};
  cursor: pointer;
`

interface IntervalName {
  name: React.ReactNode
  common?: boolean
  rare?: boolean
}

interface IntervalRowProps {
  interval: IntervalNumber
  primaryName: IntervalName
  secondaryName?: IntervalName
  selections: boolean[]
  onTableCellClicked: (col: number) => any
}

function IntervalRow({selections, primaryName, secondaryName, onTableCellClicked, interval}: IntervalRowProps) {
  const cols: IntervalNumber[] = [0, 1, 2, 3, 4, 5, 6]
  return (
    <TableRow
      className={classNames(
        {
          common: primaryName.common || secondaryName?.common,
          rare: primaryName.rare && secondaryName?.rare,
          active: selections.filter(Boolean).length > 0
        }
      )}
    >
      <td>
        <span className={classNames({ common: primaryName.common, rare: primaryName.rare })}>
          {primaryName.name}
        </span>
        {secondaryName && <span className='separator'>{' / '}</span>}
      
        {secondaryName && (
          <span className={classNames({ common: secondaryName.common, rare: secondaryName.rare })}>
          {secondaryName.name}
        </span>
        )}
      </td>
      {cols.map(col => (
        <ColoredTd
          key={col}
          color={selections[col] ? '#ffffff' : Colors.interval[interval]}
          onClick={() => onTableCellClicked(col)}
        />
      ))}
    </TableRow>
  )
}

interface VoicingEditorProps {
  voicing: Voicing
  onChange: (voicing: Voicing) => any
}

interface RowData {
  primaryName: IntervalName
  secondaryName?: IntervalName
}

const rowData: RowData[] = [
  {
    primaryName: {
      name: <span>Root</span>,
      common: true
    },
    secondaryName: {
      name: <span>Oct.</span>
    }
  },
  {
    primaryName: {
      name: <span><span>Min 2</span><SuperScript>nd</SuperScript></span>,
      rare: true
    },
    secondaryName: {
      name: <span>♭9</span>,
      rare: true
    }
  },
  {
    primaryName: {
      name: <span><span>Maj 2</span><SuperScript>nd</SuperScript></span>
    },
    secondaryName: {
      name: <span>9</span>
    }
  },
  {
    primaryName: {
      name: <span><span>Min 3</span><SuperScript>rd</SuperScript></span>,
      common: true
    },
    secondaryName: {
      name: <span>♯9</span>
    }
  },
  {
    primaryName: {
      name: <span><span>Maj 3</span><SuperScript>rd</SuperScript></span>,
      common: true
    }
  },
  {
    primaryName: {
      name: <span><span>4</span><SuperScript>th</SuperScript></span>
    },
    secondaryName: {
      name: <span>11</span>
    }
  },
  {
    primaryName: {
      name: <span><span>Dim 5</span><SuperScript>th</SuperScript></span>
    },
    secondaryName: {
      name: <span>♯11</span>,
      rare: true
    }
  },
  {
    primaryName: {
      name: <span><span>5</span><SuperScript>th</SuperScript></span>,
      common: true
    }
  },
  {
    primaryName: {
      name: <span><span>Aug 5</span><SuperScript>th</SuperScript></span>,
      rare: true
    },
    secondaryName: {
      name: <span>♭13</span>,
      rare: true
    }
  },
  {
    primaryName: {
      name: <span><span>Maj 6</span><SuperScript>th</SuperScript></span>,
      rare: true
    },
    secondaryName: {
      name: <span>13</span>,
      rare: true
    }
  },
  {
    primaryName: {
      name: <span><span>Min 7</span><SuperScript>th</SuperScript></span>
    }
  },
  {
    primaryName: {
      name: <span><span>Maj 7</span><SuperScript>th</SuperScript></span>
    }
  }
]

function VoicingEditor({voicing, onChange}: VoicingEditorProps) {
  const gridVoicing = useMemo(() => voicingToGridVoicing(voicing), [voicing])
  
  const onSelection = (voiceIndex: number, interval: IntervalNumber) => {
    const newVoicing = new Array(7).fill(0).map((_, i) => {
      if(i !== voiceIndex){
        return typeof gridVoicing[i] === 'number' ? gridVoicing[i] : null
      } else {
        return gridVoicing[i] === interval ? null : interval
      }
    })
    onChange(gridVoicingToVoicing(newVoicing))
  }
  
  return (
    <>
      <StyledTable>
        <tbody>
          {rowData.map(({primaryName, secondaryName}, interval) => (
            <IntervalRow
              key={interval}
              interval={interval as IntervalNumber}
              primaryName={primaryName}
              secondaryName={secondaryName}
              selections={gridVoicing.map(voiceIndex => voiceIndex === interval)}
              onTableCellClicked={voiceIndex => onSelection(voiceIndex, interval as IntervalNumber)}
            />
          ))}
        </tbody>
      </StyledTable>
    </>
  )
}

export default VoicingEditor
