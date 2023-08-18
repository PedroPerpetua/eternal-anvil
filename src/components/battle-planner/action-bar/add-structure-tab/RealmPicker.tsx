import { HexColor } from '@hello-pangea/color-picker';
import ContentCopy from '@mui/icons-material/ContentCopy';
import {
  Avatar,
  CardHeader,
  FormControl,
  InputLabel, ListItemIcon, ListItemText, MenuItem, Select,
} from '@mui/material';

import useBattleMapStore from '../../../../hooks/useBattleMapStore';
import { Id } from '../../../../utils/types';

type RealmListItemProps = {
  name: string,
  color: HexColor
};

function RealmListItem({ name, color }: RealmListItemProps) {
  return (
    <CardHeader
      sx={{ padding: 0 }}
      avatar={<Avatar sx={{ bgcolor: color, height: 24, width: 24 }}>{ ' ' }</Avatar>}
      title={name}
    />
  );
}

type RealmPickerProps = {
  value: Id,
  onChange: (realmId: Id) => void
};
function RealmPicker({ value, onChange }: RealmPickerProps) {
  const { teams, getTeam } = useBattleMapStore();
  return (
    <FormControl fullWidth>
      <InputLabel id="realm-picker-label">Realm</InputLabel>
      <Select
        id="realm-picker"
        label="Realm"
        labelId="realm-picker-label"
        value={value}
        onChange={(e) => onChange(e.target.value as Id)}
        fullWidth
      >
        { teams.map((t) => (
          <MenuItem value={t.id}>
            <RealmListItem name={t.name} color={t.color} />
          </MenuItem>
        )) }
      </Select>
    </FormControl>
  );
}

export default RealmPicker;
