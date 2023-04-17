import { Button, Box } from '@mui/material';
import { useState } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import useCustomMapStore from '../../hooks/useCustomMapStore';
import CustomMapDisplay from './CustomMapDisplay';
import './CustomMapDialog.scss';


function CustomMapDialog() { // TODO: Replace with Modal
  const [isOpen, setIsOpen] = useState(false);
  const { setImage, addMarker } = useCustomMapStore();
  return (
    <>
      <Box>
        <CustomMapDisplay />
        <Button
          startIcon={<FileUploadIcon />}
          variant="contained"
          component="label"
        >
          Upload Image
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={(e) => setImage(e.target.files?.[0])}
          />
        </Button>
        <Button onClick={addMarker}>Add marker</Button>
      </Box>
      <Button onClick={() => setIsOpen(true)}>
        Custom Map
      </Button>
    </>
  );
}

export default CustomMapDialog;
