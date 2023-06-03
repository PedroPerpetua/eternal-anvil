import { useEffect, useState } from 'react';

type PasteAreaSingleProps = {
  onPaste: (file: File) => void,
  variant: 'single' | 'repeat'
};

type PasteAreaMultipleProps = {
  onPaste: (files: File[]) => void,
  variant: 'multiple',
};

type PasteAreaProps = React.PropsWithChildren<PasteAreaSingleProps | PasteAreaMultipleProps>;

function PasteArea({ onPaste, variant, children }: PasteAreaProps) {
  const [pasted, setPasted] = useState(false);
  const [multiFiles, setMultiFiles] = useState<File[]>([]);

  useEffect(() => {
    if (variant !== 'multiple') return;
    onPaste(multiFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiFiles.length, onPaste, variant]);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const newFiles = e.clipboardData.files;
    if (variant === 'multiple') {
      setMultiFiles([...multiFiles, ...Array.from(newFiles)]);
      return;
    }
    if (pasted && variant === 'single') return;
    onPaste(newFiles[0]);
    if (!pasted) setPasted(true);
  };

  return (
    <div onPaste={handlePaste}>
      { children }
    </div>
  );
}

export default PasteArea;
