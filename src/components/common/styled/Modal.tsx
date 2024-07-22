import { forwardRef, PropsWithChildren } from 'react';
import { Box, Modal as MUIModal, styled } from '@mui/material';
import type { ModalProps as MUIModalProps, SxProps, Theme } from '@mui/material';

type ModalProps = Omit<MUIModalProps, 'children'> & PropsWithChildren<{
  containerSx?: SxProps<Theme>
}>;

const StyledContainer = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '5px',
  width: 'min(700px, 90vw)',
  maxHeight: '90dvh',
  overflowY: 'auto',
});

const Modal = forwardRef<HTMLDivElement, ModalProps>(({ containerSx, children, ...props }, ref) => (
  <MUIModal ref={ref} {...props}>
    <StyledContainer sx={containerSx}>
      { children }
    </StyledContainer>
  </MUIModal>
));

export default Modal;
