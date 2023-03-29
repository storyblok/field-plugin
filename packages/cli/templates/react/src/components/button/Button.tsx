import './button.css'
import { FunctionComponent, ReactNode } from 'react'

type ButtonFunc = FunctionComponent<{
  children: ReactNode
  onClick: () => void
}>

const Button: ButtonFunc = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
)

export default Button
