import React from 'react'
import RefProvider from '../util/RefProvider'

const Modal = ({
  isActive,
  onClickOverlay,
  children
}) => {
  if (!isActive) return null 
  
  return (
    <RefProvider>{ref => {
      const handleClickOverlay = (e) => {
        if (e.target !== ref.current) return

        onClickOverlay(e)
      }
      
      return (
        <div 
          onClick={handleClickOverlay} 
          className="modal-wrapper"
          ref={ref}
        >
          <div className="modal">
            <div className="modal-content">
              {children}
            </div>
          </div>
        </div>
      )
    }}</RefProvider>
  )
}

export default Modal