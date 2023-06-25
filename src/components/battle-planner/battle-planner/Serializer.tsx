import { Button } from '@mui/material';
import { saveAs } from 'file-saver';

import useBattleMapStore from '../../../hooks/useBattleMapStore';
import { readFileAsString } from '../../../utils/utilities';

function Serializer() {
  const { serialize, deserialize } = useBattleMapStore();

  const handleSerialize = () => {
    const serializedData = serialize();
    const blob = new Blob([serializedData], { type: 'application/json' });
    saveAs(blob, 'ArkheimBattle.json');
  };

  const handleDeserialize = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await readFileAsString(file);
    deserialize(content);
  };

  return (
    <>
      <Button onClick={handleSerialize}>Serialize</Button>
      <Button component="label">
        Deserialize
        <input hidden type="file" onChange={handleDeserialize} />
      </Button>
    </>
  );
}

export default Serializer;
