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
  PatchedUserProfile,
  UserChangePassword,
  UserProfile,
  UserWhoami,
  UsersChangePasswordCreate401,
  UsersChangePasswordCreateErrorResponse400,
  UsersProfilePartialUpdateErrorResponse400,
  UsersProfileRetrieveErrorResponse400,
  UsersProfileUpdateErrorResponse400,
  UsersWhoamiRetrieveErrorResponse400,
} from '../../models';
import { queryInstance } from '../../queryInstance';

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

/**
 * Endpoint to change a user's password.
 */
export const usersChangePasswordCreate = (
  userChangePassword: UserChangePassword,
  options?: SecondParameter<typeof queryInstance>,
) => queryInstance<unknown>(
  { url: '/users/change_password',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: userChangePassword },
  options,
);

export const getUsersChangePasswordCreateMutationOptions = <TError = UsersChangePasswordCreateErrorResponse400 | UsersChangePasswordCreate401,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersChangePasswordCreate>>, TError, { data: UserChangePassword }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationOptions<Awaited<ReturnType<typeof usersChangePasswordCreate>>, TError, { data: UserChangePassword }, TContext> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof usersChangePasswordCreate>>, { data: UserChangePassword }> = (props) => {
    const { data } = props ?? {};

    return usersChangePasswordCreate(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UsersChangePasswordCreateMutationResult = NonNullable<Awaited<ReturnType<typeof usersChangePasswordCreate>>>;
export type UsersChangePasswordCreateMutationBody = UserChangePassword;
export type UsersChangePasswordCreateMutationError = UsersChangePasswordCreateErrorResponse400 | UsersChangePasswordCreate401;

export const useUsersChangePasswordCreate = <TError = UsersChangePasswordCreateErrorResponse400 | UsersChangePasswordCreate401,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersChangePasswordCreate>>, TError, { data: UserChangePassword }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationResult<
  Awaited<ReturnType<typeof usersChangePasswordCreate>>,
  TError,
  { data: UserChangePassword },
  TContext
  > => {
  const mutationOptions = getUsersChangePasswordCreateMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Endpoint to retrieve a user's details.
 */
export const usersProfileRetrieve = (options?: SecondParameter<typeof queryInstance>, signal?: AbortSignal) => queryInstance<UserProfile>(
  { url: '/users/profile/', method: 'GET', signal },
  options,
);

export const getUsersProfileRetrieveQueryKey = () => ['/users/profile/'] as const;

export const getUsersProfileRetrieveQueryOptions = <TData = Awaited<ReturnType<typeof usersProfileRetrieve>>, TError = UsersProfileRetrieveErrorResponse400>(options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersProfileRetrieve>>, TError, TData>>, request?: SecondParameter<typeof queryInstance> },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getUsersProfileRetrieveQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof usersProfileRetrieve>>> = ({ signal }) => usersProfileRetrieve(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof usersProfileRetrieve>>, TError, TData> & { queryKey: QueryKey };
};

export type UsersProfileRetrieveQueryResult = NonNullable<Awaited<ReturnType<typeof usersProfileRetrieve>>>;
export type UsersProfileRetrieveQueryError = UsersProfileRetrieveErrorResponse400;

export const useUsersProfileRetrieve = <TData = Awaited<ReturnType<typeof usersProfileRetrieve>>, TError = UsersProfileRetrieveErrorResponse400>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersProfileRetrieve>>, TError, TData>>, request?: SecondParameter<typeof queryInstance> },

): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getUsersProfileRetrieveQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * Endpoint to fully override a user's details.
 */
export const usersProfileUpdate = (
  userProfile: UserProfile,
  options?: SecondParameter<typeof queryInstance>,
) => queryInstance<UserProfile>(
  { url: '/users/profile/',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: userProfile },
  options,
);

export const getUsersProfileUpdateMutationOptions = <TError = UsersProfileUpdateErrorResponse400,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersProfileUpdate>>, TError, { data: UserProfile }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationOptions<Awaited<ReturnType<typeof usersProfileUpdate>>, TError, { data: UserProfile }, TContext> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof usersProfileUpdate>>, { data: UserProfile }> = (props) => {
    const { data } = props ?? {};

    return usersProfileUpdate(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UsersProfileUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof usersProfileUpdate>>>;
export type UsersProfileUpdateMutationBody = UserProfile;
export type UsersProfileUpdateMutationError = UsersProfileUpdateErrorResponse400;

export const useUsersProfileUpdate = <TError = UsersProfileUpdateErrorResponse400,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersProfileUpdate>>, TError, { data: UserProfile }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationResult<
  Awaited<ReturnType<typeof usersProfileUpdate>>,
  TError,
  { data: UserProfile },
  TContext
  > => {
  const mutationOptions = getUsersProfileUpdateMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Endpoint to partially update a user's details.
 */
export const usersProfilePartialUpdate = (
  patchedUserProfile: PatchedUserProfile,
  options?: SecondParameter<typeof queryInstance>,
) => queryInstance<UserProfile>(
  { url: '/users/profile/',
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    data: patchedUserProfile },
  options,
);

export const getUsersProfilePartialUpdateMutationOptions = <TError = UsersProfilePartialUpdateErrorResponse400,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersProfilePartialUpdate>>, TError, { data: PatchedUserProfile }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationOptions<Awaited<ReturnType<typeof usersProfilePartialUpdate>>, TError, { data: PatchedUserProfile }, TContext> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<Awaited<ReturnType<typeof usersProfilePartialUpdate>>, { data: PatchedUserProfile }> = (props) => {
    const { data } = props ?? {};

    return usersProfilePartialUpdate(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UsersProfilePartialUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof usersProfilePartialUpdate>>>;
export type UsersProfilePartialUpdateMutationBody = PatchedUserProfile;
export type UsersProfilePartialUpdateMutationError = UsersProfilePartialUpdateErrorResponse400;

export const useUsersProfilePartialUpdate = <TError = UsersProfilePartialUpdateErrorResponse400,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersProfilePartialUpdate>>, TError, { data: PatchedUserProfile }, TContext>, request?: SecondParameter<typeof queryInstance> },
  ): UseMutationResult<
  Awaited<ReturnType<typeof usersProfilePartialUpdate>>,
  TError,
  { data: PatchedUserProfile },
  TContext
  > => {
  const mutationOptions = getUsersProfilePartialUpdateMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Endpoint to retrieve the `USERNAME_FIELD` (usually `username` or `email`) of the currently logged in user.
 */
export const usersWhoamiRetrieve = (options?: SecondParameter<typeof queryInstance>, signal?: AbortSignal) => queryInstance<UserWhoami>(
  { url: '/users/whoami', method: 'GET', signal },
  options,
);

export const getUsersWhoamiRetrieveQueryKey = () => ['/users/whoami'] as const;

export const getUsersWhoamiRetrieveQueryOptions = <TData = Awaited<ReturnType<typeof usersWhoamiRetrieve>>, TError = UsersWhoamiRetrieveErrorResponse400>(options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersWhoamiRetrieve>>, TError, TData>>, request?: SecondParameter<typeof queryInstance> },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getUsersWhoamiRetrieveQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof usersWhoamiRetrieve>>> = ({ signal }) => usersWhoamiRetrieve(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<typeof usersWhoamiRetrieve>>, TError, TData> & { queryKey: QueryKey };
};

export type UsersWhoamiRetrieveQueryResult = NonNullable<Awaited<ReturnType<typeof usersWhoamiRetrieve>>>;
export type UsersWhoamiRetrieveQueryError = UsersWhoamiRetrieveErrorResponse400;

export const useUsersWhoamiRetrieve = <TData = Awaited<ReturnType<typeof usersWhoamiRetrieve>>, TError = UsersWhoamiRetrieveErrorResponse400>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersWhoamiRetrieve>>, TError, TData>>, request?: SecondParameter<typeof queryInstance> },

): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getUsersWhoamiRetrieveQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};
