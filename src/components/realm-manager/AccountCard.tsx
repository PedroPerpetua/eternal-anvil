import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import type { ListCreateAccount as Account } from '../../api/models';
import DwarfBanner from '../../assets/dwarf-banner.png';
import DwarfCard from '../../assets/dwarf-card.png';
import ElfBanner from '../../assets/elf-banner.png';
import ElfCard from '../../assets/elf-card.png';

type AccountCardProps = {
  account: Account
};

function AccountCard({ account }: AccountCardProps) {
  const isElf = account.race === 'ELF';
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: 'green',
        background: `url(${isElf ? ElfCard : DwarfCard}) center`,
        backgroundSize: '100% 100%',
        padding: 'min(5%, 20px) min(8%, 50px)',
        color: 'primary.contrastText',
        transition: 'all .2s ease-in-out',
        ':hover': { transform: 'scale(1.01)' },
      }}
      className="clickable"
      onClick={() => navigate(`/realm-manager/${account.id}`)}
    >
      <Stack direction="row">
        <img
          src={isElf ? ElfBanner : DwarfBanner}
          alt="dwarf"
          style={{ width: 'min(35%, 120px)', height: 'auto' }}
        />
        <Stack justifyContent="center">
          <Typography variant="h6">{ account.name }</Typography>
          { account.realm && <Typography variant="subtitle1">{ account.realm.name }</Typography> }
          <Typography variant="subtitle2">
            { `[${account.game_world.code}] ${account.game_world.name}` }
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default AccountCard;
