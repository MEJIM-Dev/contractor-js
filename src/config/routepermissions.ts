import { ExtendedHttpReuestMethods, RoutePermissions } from "../dto/types";

const configuredRoutes: Array<RoutePermissions> = [
    {
        url: "/api/auth/login",
        authenticationRequired: false,
        method: ExtendedHttpReuestMethods.POST
    },
    {
        url: "/api/users",
        authenticationRequired: false,
        method: ExtendedHttpReuestMethods.POST
    },
    {
        url: "/api/users/:id",
        authenticationRequired: true,
        method: ExtendedHttpReuestMethods.GET
    },
    {
        url: "/api/users/:id",
        authenticationRequired: true,
        method: ExtendedHttpReuestMethods.PATCH
    },
    {
        url: "/api/users/:id",
        authenticationRequired: true,
        method: ExtendedHttpReuestMethods.DELETE
    },
    {
        url: "/api/jobs",
        authenticationRequired: true,
        method: ExtendedHttpReuestMethods.POST
    },
    {
        url: "/api/jobs/:id",
        authenticationRequired: true,
        method: ExtendedHttpReuestMethods.GET
    },
    {
        url: "/api/contracts",
        authenticationRequired: true,
        method: ExtendedHttpReuestMethods.POST
    },
    {
        url: "/api/contracts/:id",
        authenticationRequired: true,
        method: ExtendedHttpReuestMethods.GET
    },
    {
        url: "/api/contracts",
        authenticationRequired: true,
        method: ExtendedHttpReuestMethods.GET
    },
    {
        url: "/api/contracts/:id",
        authenticationRequired: true,
        method: ExtendedHttpReuestMethods.PATCH
    },
    {
        url: "/api/contracts/:id",
        authenticationRequired: true,
        method: ExtendedHttpReuestMethods.DELETE
    },
    {
        url: "/api/transactions/transfer",
        authenticationRequired: true,
        method: ExtendedHttpReuestMethods.POST
    },
]

export function getAppRoutes (): Array<RoutePermissions>{
    return configuredRoutes;
}