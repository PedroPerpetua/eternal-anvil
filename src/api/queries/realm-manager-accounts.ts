/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * Eternal Anvil (Backend)
 * The backend server for the Eternal Anvil.
 * OpenAPI spec version: v0.0.1
 */
import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import type {
  AccountDetails,
  AccountDetailsRequest,
  JoinAccountRequest,
  ListCreateAccount,
  ListCreateAccountRequest,
  RealmManagerAccountsCreate403,
  RealmManagerAccountsCreateErrorResponse400,
  RealmManagerAccountsDestroy403,
  RealmManagerAccountsDestroyErrorResponse400,
  RealmManagerAccountsJoin403,
  RealmManagerAccountsJoinErrorResponse400,
  RealmManagerAccountsLeave403,
  RealmManagerAccountsLeaveErrorResponse400,
  RealmManagerAccountsListErrorResponse400,
  RealmManagerAccountsRemoveUser403,
  RealmManagerAccountsRemoveUserErrorResponse400,
  RealmManagerAccountsRetrieveErrorResponse400,
  RealmManagerAccountsUpdate403,
  RealmManagerAccountsUpdateErrorResponse400,
} from '../models';
import { queryInstance } from '../queryInstance';
import type { ErrorType, BodyType } from '../queryInstance';

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

/**
 * Endpoint to list Accounts.
 * @summary Get account list
 */
export const realmManagerAccountsList = (options?: SecondParameter<typeof queryInstance>, signal?: AbortSignal) => queryInstance<ListCreateAccount[]>(
  { url: '/realm-manager/accounts/', method: 'GET', signal },
  options,
);

export const getRealmManagerAccountsListQueryKey = () => ['/realm-manager/accounts/'] as const;

export const getRealmManagerAccountsListQueryOptions = <TData = Awaited<ReturnType<typeof realmManagerAccountsList>>, TError = ErrorType<RealmManagerAccountsListErrorResponse400>>(options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof realmManagerAccountsList>>, TError, TData>>, request?: SecondParameter<typeof queryInstance> },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getRealmManagerAccountsListQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof realmManagerAccountsList>>> = ({ signal }) => realmManagerAccountsList(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof realmManagerAccountsList>>, TError, TData> & { queryKey: QueryKey };
};

export type RealmManagerAccountsListQueryResult = NonNullable<Awaited<ReturnType<typeof realmManagerAccountsList>>>;
export type RealmManagerAccountsListQueryError = ErrorType<RealmManagerAccountsListErrorResponse400>;

/**
 * @summary Get account list
 */
export const useRealmManagerAccountsList = <TData = Awaited<ReturnType<typeof realmManagerAccountsList>>, TError = ErrorType<RealmManagerAccountsListErrorResponse400>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof realmManagerAccountsList>>, TError, TData>>, request?: SecondParameter<typeof queryInstance> },

): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getRealmManagerAccountsListQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * Endpoint to create Accounts.
 * @summary Create account
 */
export const realmManagerAccountsCreate = (
  listCreateAccountRequest: BodyType<ListCreateAccountRequest>,
  options?: SecondParameter<typeof queryInstance>,
) => queryInstance<ListCreateAccount>(
  { url: '/realm-manager/accounts/',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: listCreateAccountRequest },
  options,
);

export const getRealmManagerAccountsCreateMutationOptions = <TError = ErrorType<RealmManagerAccountsCreateErrorResponse400 | RealmManagerAccountsCreate403>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsCreate>>, TError, { data: BodyType<ListCreateAccountRequest> }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsCreate>>, TError, { data: BodyType<ListCreateAccountRequest> }, TContext> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof realmManagerAccountsCreate>>, { data: BodyType<ListCreateAccountRequest> }> = (props) => {
    const { data } = props ?? {};

    return realmManagerAccountsCreate(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RealmManagerAccountsCreateMutationResult = NonNullable<Awaited<ReturnType<typeof realmManagerAccountsCreate>>>;
export type RealmManagerAccountsCreateMutationBody = BodyType<ListCreateAccountRequest>;
export type RealmManagerAccountsCreateMutationError = ErrorType<RealmManagerAccountsCreateErrorResponse400 | RealmManagerAccountsCreate403>;

/**
 * @summary Create account
 */
export const useRealmManagerAccountsCreate = <TError = ErrorType<RealmManagerAccountsCreateErrorResponse400 | RealmManagerAccountsCreate403>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsCreate>>, TError, { data: BodyType<ListCreateAccountRequest> }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationResult<
  Awaited<ReturnType<typeof realmManagerAccountsCreate>>,
  TError,
  { data: BodyType<ListCreateAccountRequest> },
  TContext
  > => {
  const mutationOptions = getRealmManagerAccountsCreateMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Endpoint to retrieve an Account.
 * @summary Get account details
 */
export const realmManagerAccountsRetrieve = (
  id: string,
  options?: SecondParameter<typeof queryInstance>,
  signal?: AbortSignal,
) => queryInstance<AccountDetails>(
  { url: `/realm-manager/accounts/${id}/`, method: 'GET', signal },
  options,
);

export const getRealmManagerAccountsRetrieveQueryKey = (id: string) => [`/realm-manager/accounts/${id}/`] as const;

export const getRealmManagerAccountsRetrieveQueryOptions = <TData = Awaited<ReturnType<typeof realmManagerAccountsRetrieve>>, TError = ErrorType<RealmManagerAccountsRetrieveErrorResponse400>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof realmManagerAccountsRetrieve>>, TError, TData>>, request?: SecondParameter<typeof queryInstance> },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getRealmManagerAccountsRetrieveQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof realmManagerAccountsRetrieve>>> = ({ signal }) => realmManagerAccountsRetrieve(id, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!(id), ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof realmManagerAccountsRetrieve>>, TError, TData> & { queryKey: QueryKey };
};

export type RealmManagerAccountsRetrieveQueryResult = NonNullable<Awaited<ReturnType<typeof realmManagerAccountsRetrieve>>>;
export type RealmManagerAccountsRetrieveQueryError = ErrorType<RealmManagerAccountsRetrieveErrorResponse400>;

/**
 * @summary Get account details
 */
export const useRealmManagerAccountsRetrieve = <TData = Awaited<ReturnType<typeof realmManagerAccountsRetrieve>>, TError = ErrorType<RealmManagerAccountsRetrieveErrorResponse400>>(
  id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof realmManagerAccountsRetrieve>>, TError, TData>>, request?: SecondParameter<typeof queryInstance> },

): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getRealmManagerAccountsRetrieveQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * Endpoint to update an Account's owner. Only the owner can call this endpoint.
 * @summary Update account details
 */
export const realmManagerAccountsUpdate = (
  id: string,
  accountDetailsRequest: BodyType<AccountDetailsRequest>,
  options?: SecondParameter<typeof queryInstance>,
) => queryInstance<AccountDetails>(
  { url: `/realm-manager/accounts/${id}/`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: accountDetailsRequest },
  options,
);

export const getRealmManagerAccountsUpdateMutationOptions = <TError = ErrorType<RealmManagerAccountsUpdateErrorResponse400 | RealmManagerAccountsUpdate403>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsUpdate>>, TError, { id: string;data: BodyType<AccountDetailsRequest> }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsUpdate>>, TError, { id: string;data: BodyType<AccountDetailsRequest> }, TContext> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof realmManagerAccountsUpdate>>, { id: string;data: BodyType<AccountDetailsRequest> }> = (props) => {
    const { id, data } = props ?? {};

    return realmManagerAccountsUpdate(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RealmManagerAccountsUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof realmManagerAccountsUpdate>>>;
export type RealmManagerAccountsUpdateMutationBody = BodyType<AccountDetailsRequest>;
export type RealmManagerAccountsUpdateMutationError = ErrorType<RealmManagerAccountsUpdateErrorResponse400 | RealmManagerAccountsUpdate403>;

/**
 * @summary Update account details
 */
export const useRealmManagerAccountsUpdate = <TError = ErrorType<RealmManagerAccountsUpdateErrorResponse400 | RealmManagerAccountsUpdate403>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsUpdate>>, TError, { id: string;data: BodyType<AccountDetailsRequest> }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationResult<
  Awaited<ReturnType<typeof realmManagerAccountsUpdate>>,
  TError,
  { id: string;data: BodyType<AccountDetailsRequest> },
  TContext
  > => {
  const mutationOptions = getRealmManagerAccountsUpdateMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Endpoint to delete Accounts. Only the owner can call this endpoint.
 * @summary Delete account
 */
export const realmManagerAccountsDestroy = (
  id: string,
  options?: SecondParameter<typeof queryInstance>,
) => queryInstance<void>(
  { url: `/realm-manager/accounts/${id}/`, method: 'DELETE' },
  options,
);

export const getRealmManagerAccountsDestroyMutationOptions = <TError = ErrorType<RealmManagerAccountsDestroyErrorResponse400 | RealmManagerAccountsDestroy403>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsDestroy>>, TError, { id: string }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsDestroy>>, TError, { id: string }, TContext> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof realmManagerAccountsDestroy>>, { id: string }> = (props) => {
    const { id } = props ?? {};

    return realmManagerAccountsDestroy(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RealmManagerAccountsDestroyMutationResult = NonNullable<Awaited<ReturnType<typeof realmManagerAccountsDestroy>>>;

export type RealmManagerAccountsDestroyMutationError = ErrorType<RealmManagerAccountsDestroyErrorResponse400 | RealmManagerAccountsDestroy403>;

/**
 * @summary Delete account
 */
export const useRealmManagerAccountsDestroy = <TError = ErrorType<RealmManagerAccountsDestroyErrorResponse400 | RealmManagerAccountsDestroy403>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsDestroy>>, TError, { id: string }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationResult<
  Awaited<ReturnType<typeof realmManagerAccountsDestroy>>,
  TError,
  { id: string },
  TContext
  > => {
  const mutationOptions = getRealmManagerAccountsDestroyMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Endpoint to leave the Account.
 * @summary Leave account
 */
export const realmManagerAccountsLeave = (
  id: string,
  options?: SecondParameter<typeof queryInstance>,
) => queryInstance<void>(
  { url: `/realm-manager/accounts/${id}/leave/`, method: 'DELETE' },
  options,
);

export const getRealmManagerAccountsLeaveMutationOptions = <TError = ErrorType<RealmManagerAccountsLeaveErrorResponse400 | RealmManagerAccountsLeave403>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsLeave>>, TError, { id: string }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsLeave>>, TError, { id: string }, TContext> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof realmManagerAccountsLeave>>, { id: string }> = (props) => {
    const { id } = props ?? {};

    return realmManagerAccountsLeave(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RealmManagerAccountsLeaveMutationResult = NonNullable<Awaited<ReturnType<typeof realmManagerAccountsLeave>>>;

export type RealmManagerAccountsLeaveMutationError = ErrorType<RealmManagerAccountsLeaveErrorResponse400 | RealmManagerAccountsLeave403>;

/**
 * @summary Leave account
 */
export const useRealmManagerAccountsLeave = <TError = ErrorType<RealmManagerAccountsLeaveErrorResponse400 | RealmManagerAccountsLeave403>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsLeave>>, TError, { id: string }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationResult<
  Awaited<ReturnType<typeof realmManagerAccountsLeave>>,
  TError,
  { id: string },
  TContext
  > => {
  const mutationOptions = getRealmManagerAccountsLeaveMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Endpoint to remove a User from the Account. Only the owner can use this endpoint.
 * @summary Remove user from account
 */
export const realmManagerAccountsRemoveUser = (
  id: string,
  userId: string,
  options?: SecondParameter<typeof queryInstance>,
) => queryInstance<void>(
  { url: `/realm-manager/accounts/${id}/remove/${userId}/`, method: 'DELETE' },
  options,
);

export const getRealmManagerAccountsRemoveUserMutationOptions = <TError = ErrorType<RealmManagerAccountsRemoveUserErrorResponse400 | RealmManagerAccountsRemoveUser403>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsRemoveUser>>, TError, { id: string;userId: string }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsRemoveUser>>, TError, { id: string;userId: string }, TContext> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof realmManagerAccountsRemoveUser>>, { id: string;userId: string }> = (props) => {
    const { id, userId } = props ?? {};

    return realmManagerAccountsRemoveUser(id, userId, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RealmManagerAccountsRemoveUserMutationResult = NonNullable<Awaited<ReturnType<typeof realmManagerAccountsRemoveUser>>>;

export type RealmManagerAccountsRemoveUserMutationError = ErrorType<RealmManagerAccountsRemoveUserErrorResponse400 | RealmManagerAccountsRemoveUser403>;

/**
 * @summary Remove user from account
 */
export const useRealmManagerAccountsRemoveUser = <TError = ErrorType<RealmManagerAccountsRemoveUserErrorResponse400 | RealmManagerAccountsRemoveUser403>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsRemoveUser>>, TError, { id: string;userId: string }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationResult<
  Awaited<ReturnType<typeof realmManagerAccountsRemoveUser>>,
  TError,
  { id: string;userId: string },
  TContext
  > => {
  const mutationOptions = getRealmManagerAccountsRemoveUserMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Endpoint to join existing Accounts.
 * @summary Join account
 */
export const realmManagerAccountsJoin = (
  joinAccountRequest: BodyType<JoinAccountRequest>,
  options?: SecondParameter<typeof queryInstance>,
) => queryInstance<AccountDetails>(
  { url: '/realm-manager/accounts/join/',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: joinAccountRequest },
  options,
);

export const getRealmManagerAccountsJoinMutationOptions = <TError = ErrorType<RealmManagerAccountsJoinErrorResponse400 | RealmManagerAccountsJoin403>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsJoin>>, TError, { data: BodyType<JoinAccountRequest> }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsJoin>>, TError, { data: BodyType<JoinAccountRequest> }, TContext> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof realmManagerAccountsJoin>>, { data: BodyType<JoinAccountRequest> }> = (props) => {
    const { data } = props ?? {};

    return realmManagerAccountsJoin(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RealmManagerAccountsJoinMutationResult = NonNullable<Awaited<ReturnType<typeof realmManagerAccountsJoin>>>;
export type RealmManagerAccountsJoinMutationBody = BodyType<JoinAccountRequest>;
export type RealmManagerAccountsJoinMutationError = ErrorType<RealmManagerAccountsJoinErrorResponse400 | RealmManagerAccountsJoin403>;

/**
 * @summary Join account
 */
export const useRealmManagerAccountsJoin = <TError = ErrorType<RealmManagerAccountsJoinErrorResponse400 | RealmManagerAccountsJoin403>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof realmManagerAccountsJoin>>, TError, { data: BodyType<JoinAccountRequest> }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationResult<
  Awaited<ReturnType<typeof realmManagerAccountsJoin>>,
  TError,
  { data: BodyType<JoinAccountRequest> },
  TContext
  > => {
  const mutationOptions = getRealmManagerAccountsJoinMutationOptions(options);

  return useMutation(mutationOptions);
};
