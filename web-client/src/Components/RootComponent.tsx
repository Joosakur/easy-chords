import { cover } from 'polished'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { setSustainPedal } from '../state/actions'
import LeftSidebar from './LeftSidebar'
import MainView from './MainView'
import RightSidebar from './RightSidebar'

const RootContainer = styled.div`
  display: flex;
  ${cover()}
`

function RootComponent() {
  const dispatch = useDispatch()

  useEffect(() => {
    const keyDownListener = (event: KeyboardEvent) => {
      if (
        document.activeElement &&
        ['input'].includes(document.activeElement.tagName.toLowerCase())
      )
        return

      if (event.code === 'Space') {
        event.preventDefault()
      }

      if (event.repeat) return

      if (event.code === 'Space') {
        dispatch(setSustainPedal(true))
      }
    }

    const keyUpListener = (event: KeyboardEvent) => {
      if (
        document.activeElement &&
        ['input'].includes(document.activeElement.tagName.toLowerCase())
      )
        return

      if (event.code === 'Space') {
        dispatch(setSustainPedal(false))
      }
    }

    window.addEventListener('keydown', keyDownListener)
    window.addEventListener('keyup', keyUpListener)

    return () => {
      window.removeEventListener('keydown', keyDownListener)
      window.removeEventListener('keyup', keyUpListener)
    }
  }, [dispatch])

  return (
    <RootContainer>
      <LeftSidebar />
      <MainView />
      <RightSidebar />
    </RootContainer>
  )
}

export default RootComponent
