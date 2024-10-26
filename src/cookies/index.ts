/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRole } from "../models/role.model";
import { IUser } from "./../models/user.model";
import { setCookie, parseCookies, destroyCookie } from "nookies";

export const getWelcome = (): string | null => {
  const cookies = parseCookies();

  return cookies["@prados.welcome"] || null;
};

export const getToken = (): string | null => {
  const cookies = parseCookies();

  return cookies["@prados.token"] || null;
};

export const getRefreshToken = (): string | null => {
  const cookies = parseCookies();

  return cookies["@prados.refreshToken"] || null;
};

export const getUser = (): IUser | null => {
  const cookies = parseCookies();
  const useData = cookies["@prados.user"];

  return useData ? JSON.parse(useData) : null;
};

export const getRole = (): IRole | null => {
  const cookies = parseCookies();
  const roleData = cookies["@prados.role"];

  return roleData ? JSON.parse(roleData) : null;
};

export const getRoles = (): IRole[] | [] => {
  const cookies = parseCookies();
  const rolesData = cookies["@prados.roles"];

  return rolesData ? JSON.parse(rolesData) : [];
};

export const getCompany = (): any | null => {
  const cookies = parseCookies();
  const companyData = cookies["@prados.company"];

  return companyData ? JSON.parse(companyData) : null;
};

export const getCompanies = (): any | null => {
  const cookies = parseCookies();
  const companyData = cookies["@prados.companies"];

  return companyData ? JSON.parse(companyData) : [];
};

export const getPermissions = (): any | null => {
  const cookies = parseCookies();
  const permissionsData = cookies["@prados.permissions"];

  return permissionsData ? JSON.parse(permissionsData) : [];
};

export const getUseTerm = (): any | null => {
  const cookies = parseCookies();
  const termData = cookies["@prados.term"];

  return termData ? JSON.parse(termData) : [];
};

export const setDataCookie = ({
  key,
  value,
}: {
  key: string;
  value: string;
}) => {
  setCookie(null, key, value, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
};

export const removeAllCookies = (): void => {
  destroyCookie(null, "@prados.welcome");
  destroyCookie(null, "@prados.token");
  destroyCookie(null, "@prados.refreshToken");
  destroyCookie(null, "@prados.user");
  destroyCookie(null, "@prados.role");
  destroyCookie(null, "@prados.roles");
  destroyCookie(null, "@prados.company");
  destroyCookie(null, "@prados.companies");
  destroyCookie(null, "@prados.permissions");
  destroyCookie(null, "@prados.term");
};
