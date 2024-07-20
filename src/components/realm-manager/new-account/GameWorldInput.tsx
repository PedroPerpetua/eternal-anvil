import { SelectElement } from 'react-hook-form-mui';
import type { SelectElementProps } from 'react-hook-form-mui';

import { useRealmManagerGameWorldsList } from '../../../api/queries/realm-manager-game-worlds';

function GameWorldInput({ disabled, ...props }: Omit<SelectElementProps, 'options'>) {
  const { data: gameWorlds, isLoading } = useRealmManagerGameWorldsList();
  return (
    <SelectElement
      {...props}
      options={gameWorlds
        ?.sort(({ account_name: acc1 }, { account_name: acc2 }) => {
          if (acc1 === null && acc2 === null) return 0;
          if (acc1 === null) return -1;
          return 1;
        })
        .map(({ id, code, name, account_name }) => ({
          id,
          label: `[${code}] ${name}${account_name ? ` (${account_name})` : ''}`,
          disabled: account_name !== null,
        }))}
      disabled={disabled || isLoading}
    />
  );
}

export default GameWorldInput;
