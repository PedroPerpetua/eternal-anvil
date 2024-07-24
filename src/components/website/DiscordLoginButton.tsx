import { useTranslation } from 'react-i18next';

import DiscordLogo from '../../assets/discord.png';
import CustomIcon from '../common/CustomIcon';
import GameButton from '../common/styled/GameButton';

const DISCORD_OAUTH_URL = import.meta.env.VITE_DISCORD_OAUTH_URL;

function DiscordLoginButton() {
  const { t } = useTranslation();
  return (
    <GameButton
      color="discord"
      startIcon={(<CustomIcon src={DiscordLogo} size="small" />)}
      href={DISCORD_OAUTH_URL}
      size="large"
      sx={{ borderColor: 'white' }}
    >
      { t('auth.discordLogin.label') }
    </GameButton>
  );
}

export default DiscordLoginButton;
