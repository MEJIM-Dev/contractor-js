import { ExtendedHttpReuestMethods, RoutePermissions } from "../dto/types";

const configuredRoutes: Array<RoutePermissions> = [
    {
        url: "/api/auth/login",
        authenticationRequired: false,
        method: ExtendedHttpReuestMethods.POST
    },
    {
        url: "/api/users",
        authenticationRequired: true,
        method: ExtendedHttpReuestMethods.POST
    },
    {
        url: "/api/users/:id",
        authenticationRequired: false,
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
]

export function getAppRoutes (): Array<RoutePermissions>{
    return configuredRoutes;
}