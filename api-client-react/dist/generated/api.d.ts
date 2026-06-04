import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { DashboardSummary, HealthStatus, PublicReport, ShareToken, Subject, SubjectInput, SubjectUpdate } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetSubjectsUrl: () => string;
/**
 * @summary Get all subjects for the current user
 */
export declare const getSubjects: (options?: RequestInit) => Promise<Subject[]>;
export declare const getGetSubjectsQueryKey: () => readonly ["/api/subjects"];
export declare const getGetSubjectsQueryOptions: <TData = Awaited<ReturnType<typeof getSubjects>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSubjects>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSubjects>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSubjectsQueryResult = NonNullable<Awaited<ReturnType<typeof getSubjects>>>;
export type GetSubjectsQueryError = ErrorType<void>;
/**
 * @summary Get all subjects for the current user
 */
export declare function useGetSubjects<TData = Awaited<ReturnType<typeof getSubjects>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSubjects>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateSubjectUrl: () => string;
/**
 * @summary Create a new subject
 */
export declare const createSubject: (subjectInput: SubjectInput, options?: RequestInit) => Promise<Subject>;
export declare const getCreateSubjectMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSubject>>, TError, {
        data: BodyType<SubjectInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createSubject>>, TError, {
    data: BodyType<SubjectInput>;
}, TContext>;
export type CreateSubjectMutationResult = NonNullable<Awaited<ReturnType<typeof createSubject>>>;
export type CreateSubjectMutationBody = BodyType<SubjectInput>;
export type CreateSubjectMutationError = ErrorType<void>;
/**
* @summary Create a new subject
*/
export declare const useCreateSubject: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSubject>>, TError, {
        data: BodyType<SubjectInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createSubject>>, TError, {
    data: BodyType<SubjectInput>;
}, TContext>;
export declare const getGetSubjectUrl: (id: number) => string;
/**
 * @summary Get a subject by ID
 */
export declare const getSubject: (id: number, options?: RequestInit) => Promise<Subject>;
export declare const getGetSubjectQueryKey: (id: number) => readonly [`/api/subjects/${number}`];
export declare const getGetSubjectQueryOptions: <TData = Awaited<ReturnType<typeof getSubject>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSubjectQueryResult = NonNullable<Awaited<ReturnType<typeof getSubject>>>;
export type GetSubjectQueryError = ErrorType<void>;
/**
 * @summary Get a subject by ID
 */
export declare function useGetSubject<TData = Awaited<ReturnType<typeof getSubject>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateSubjectUrl: (id: number) => string;
/**
 * @summary Update a subject
 */
export declare const updateSubject: (id: number, subjectUpdate: SubjectUpdate, options?: RequestInit) => Promise<Subject>;
export declare const getUpdateSubjectMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSubject>>, TError, {
        id: number;
        data: BodyType<SubjectUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSubject>>, TError, {
    id: number;
    data: BodyType<SubjectUpdate>;
}, TContext>;
export type UpdateSubjectMutationResult = NonNullable<Awaited<ReturnType<typeof updateSubject>>>;
export type UpdateSubjectMutationBody = BodyType<SubjectUpdate>;
export type UpdateSubjectMutationError = ErrorType<void>;
/**
* @summary Update a subject
*/
export declare const useUpdateSubject: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSubject>>, TError, {
        id: number;
        data: BodyType<SubjectUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateSubject>>, TError, {
    id: number;
    data: BodyType<SubjectUpdate>;
}, TContext>;
export declare const getDeleteSubjectUrl: (id: number) => string;
/**
 * @summary Delete a subject
 */
export declare const deleteSubject: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteSubjectMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSubject>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteSubject>>, TError, {
    id: number;
}, TContext>;
export type DeleteSubjectMutationResult = NonNullable<Awaited<ReturnType<typeof deleteSubject>>>;
export type DeleteSubjectMutationError = ErrorType<void>;
/**
* @summary Delete a subject
*/
export declare const useDeleteSubject: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSubject>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteSubject>>, TError, {
    id: number;
}, TContext>;
export declare const getMarkPresentUrl: (id: number) => string;
/**
 * @summary Mark attendance as present for a subject
 */
export declare const markPresent: (id: number, options?: RequestInit) => Promise<Subject>;
export declare const getMarkPresentMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markPresent>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof markPresent>>, TError, {
    id: number;
}, TContext>;
export type MarkPresentMutationResult = NonNullable<Awaited<ReturnType<typeof markPresent>>>;
export type MarkPresentMutationError = ErrorType<void>;
/**
* @summary Mark attendance as present for a subject
*/
export declare const useMarkPresent: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markPresent>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof markPresent>>, TError, {
    id: number;
}, TContext>;
export declare const getMarkAbsentUrl: (id: number) => string;
/**
 * @summary Mark attendance as absent for a subject
 */
export declare const markAbsent: (id: number, options?: RequestInit) => Promise<Subject>;
export declare const getMarkAbsentMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markAbsent>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof markAbsent>>, TError, {
    id: number;
}, TContext>;
export type MarkAbsentMutationResult = NonNullable<Awaited<ReturnType<typeof markAbsent>>>;
export type MarkAbsentMutationError = ErrorType<void>;
/**
* @summary Mark attendance as absent for a subject
*/
export declare const useMarkAbsent: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markAbsent>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof markAbsent>>, TError, {
    id: number;
}, TContext>;
export declare const getUndoPresentUrl: (id: number) => string;
/**
 * @summary Undo the last present mark for a subject (decrement by 1, min 0)
 */
export declare const undoPresent: (id: number, options?: RequestInit) => Promise<Subject>;
export declare const getUndoPresentMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof undoPresent>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof undoPresent>>, TError, {
    id: number;
}, TContext>;
export type UndoPresentMutationResult = NonNullable<Awaited<ReturnType<typeof undoPresent>>>;
export type UndoPresentMutationError = ErrorType<void>;
/**
* @summary Undo the last present mark for a subject (decrement by 1, min 0)
*/
export declare const useUndoPresent: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof undoPresent>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof undoPresent>>, TError, {
    id: number;
}, TContext>;
export declare const getUndoAbsentUrl: (id: number) => string;
/**
 * @summary Undo the last absent mark for a subject (decrement by 1, min 0)
 */
export declare const undoAbsent: (id: number, options?: RequestInit) => Promise<Subject>;
export declare const getUndoAbsentMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof undoAbsent>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof undoAbsent>>, TError, {
    id: number;
}, TContext>;
export type UndoAbsentMutationResult = NonNullable<Awaited<ReturnType<typeof undoAbsent>>>;
export type UndoAbsentMutationError = ErrorType<void>;
/**
* @summary Undo the last absent mark for a subject (decrement by 1, min 0)
*/
export declare const useUndoAbsent: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof undoAbsent>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof undoAbsent>>, TError, {
    id: number;
}, TContext>;
export declare const getGetDashboardSummaryUrl: () => string;
/**
 * @summary Get overall dashboard stats for the current user
 */
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<void>;
/**
 * @summary Get overall dashboard stats for the current user
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateShareTokenUrl: () => string;
/**
 * @summary Generate or regenerate a shareable report token for the current user
 */
export declare const createShareToken: (options?: RequestInit) => Promise<ShareToken>;
export declare const getCreateShareTokenMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createShareToken>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createShareToken>>, TError, void, TContext>;
export type CreateShareTokenMutationResult = NonNullable<Awaited<ReturnType<typeof createShareToken>>>;
export type CreateShareTokenMutationError = ErrorType<void>;
/**
* @summary Generate or regenerate a shareable report token for the current user
*/
export declare const useCreateShareToken: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createShareToken>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createShareToken>>, TError, void, TContext>;
export declare const getRevokeShareTokenUrl: () => string;
/**
 * @summary Revoke the current user's shareable report token
 */
export declare const revokeShareToken: (options?: RequestInit) => Promise<void>;
export declare const getRevokeShareTokenMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof revokeShareToken>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof revokeShareToken>>, TError, void, TContext>;
export type RevokeShareTokenMutationResult = NonNullable<Awaited<ReturnType<typeof revokeShareToken>>>;
export type RevokeShareTokenMutationError = ErrorType<void>;
/**
* @summary Revoke the current user's shareable report token
*/
export declare const useRevokeShareToken: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof revokeShareToken>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof revokeShareToken>>, TError, void, TContext>;
export declare const getDeleteDashboardUrl: () => string;
/**
 * @summary Delete the current user's dashboard and all subjects
 */
export declare const deleteDashboard: (options?: RequestInit) => Promise<void>;
export declare const getDeleteDashboardMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteDashboard>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteDashboard>>, TError, void, TContext>;
export type DeleteDashboardMutationResult = NonNullable<Awaited<ReturnType<typeof deleteDashboard>>>;
export type DeleteDashboardMutationError = ErrorType<void>;
/**
* @summary Delete the current user's dashboard and all subjects
*/
export declare const useDeleteDashboard: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteDashboard>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteDashboard>>, TError, void, TContext>;
export declare const getGetPublicReportUrl: (token: string) => string;
/**
 * @summary Get a public read-only attendance report by share token (no auth required)
 */
export declare const getPublicReport: (token: string, options?: RequestInit) => Promise<PublicReport>;
export declare const getGetPublicReportQueryKey: (token: string) => readonly [`/api/reports/${string}`];
export declare const getGetPublicReportQueryOptions: <TData = Awaited<ReturnType<typeof getPublicReport>>, TError = ErrorType<void>>(token: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPublicReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPublicReport>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPublicReportQueryResult = NonNullable<Awaited<ReturnType<typeof getPublicReport>>>;
export type GetPublicReportQueryError = ErrorType<void>;
/**
 * @summary Get a public read-only attendance report by share token (no auth required)
 */
export declare function useGetPublicReport<TData = Awaited<ReturnType<typeof getPublicReport>>, TError = ErrorType<void>>(token: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPublicReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map