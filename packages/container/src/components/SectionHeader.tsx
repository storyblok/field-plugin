import { FunctionComponent, ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

export const SectionHeader: FunctionComponent<{
  children: ReactNode
  property: string
}> = (props) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
    }}
  >
    <Typography variant="h3">{props.children}</Typography>
    <code>{props.property}</code>
  </Box>
)
