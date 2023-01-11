import { styled, Typography } from '@mui/material'

/**
 * Useful when inlining icons. Aligns items in center.
 */
export const FlexTypography = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  gap: theme.spacing(2),
}))
