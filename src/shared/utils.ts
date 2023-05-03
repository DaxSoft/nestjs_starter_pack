export function getKbSize(kb: number): number {
  return 1024 * 1024 * kb;
}

import { Response } from 'express';

export function getCookieValue(res: Response, cookieName: string): string | undefined {
  let rawHeaders = res.req.headers.cookie;
  rawHeaders += ';';
  let regex = new RegExp(`((${cookieName})=(.*?)((;|\\n)\\s?))`, 'gium');
  if (!regex.test(rawHeaders)) {
    return undefined;
  }
  const get = regex.exec(rawHeaders);
  return !!get ? get[2] : undefined;
}
