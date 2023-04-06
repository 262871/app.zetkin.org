import { FC } from 'react';
import { Box, Typography } from '@mui/material';

export interface ZUIIconLabelProps {
  icon: JSX.Element;
  label: string | JSX.Element;
  color?: string;
  size?: 'sm' | 'md';
}

const FONT_SIZES = {
  md: '1.1em',
  sm: '1em',
} as const;

const ZUIIconLabel: FC<ZUIIconLabelProps> = ({
  icon,
  label,
  color,
  size = 'md',
}) => {
  return (
    <Box
      alignItems="center"
      color={color}
      display="flex"
      fontSize={FONT_SIZES[size]}
      gap={1}
    >
      {icon}
      <Typography color={color ? color : 'inherit'} fontSize="inherit">
        {label}
      </Typography>
    </Box>
  );
};

export default ZUIIconLabel;
