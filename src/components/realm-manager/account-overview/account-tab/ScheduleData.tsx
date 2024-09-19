import { useMemo } from 'react';

import { useRealmManagerAccountsScheduleRetrieve, useRealmManagerAccountsScheduleUpdate } from '../../../../api/queries/realm-manager-accounts';
import Loading from '../../../website/Loading';
import Scheduler from '../../scheduler/Scheduler';
import { fromApiDTO, SchedulerValue, toApiDTO } from '../../scheduler/utils';

type ScheduleDataProps = {
  accountId: string,
};

/**
 * TODO: there's an issue here with the value and update passed down to the scheduler; when we try
 * to do an optimistic update of the schedule, the values will flicker for a moment. This appears
 * to be due to a single state update frame where the hover/starting state of the schedule has
 * finished, but the optimistic update hasn't kicked in, when these two changes should happen in
 * the same frame.
 */
function ScheduleData({ accountId }: ScheduleDataProps) {
  const {
    data: scheduleData,
    isLoading,
    refetch: refreshSchedule,
  } = useRealmManagerAccountsScheduleRetrieve(accountId);
  const {
    mutate: updateSchedule,
    isPending,
    variables,
  } = useRealmManagerAccountsScheduleUpdate({ mutation: {
    onSuccess: () => refreshSchedule(),
  } });

  const schedule: SchedulerValue = useMemo(() => {
    if (!scheduleData) return Array(7).fill([]) as SchedulerValue;
    if (isPending) return fromApiDTO(variables.data);
    return fromApiDTO(scheduleData);
  }, [isPending, scheduleData, variables]);

  if (isLoading) return (<Loading />);

  return (
    <Scheduler
      value={schedule}
      onChange={(v) => updateSchedule({ id: accountId, data: toApiDTO(v) })}
    />
  );
}

export default ScheduleData;
