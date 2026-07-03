import { defineMiddleware } from "astro:middleware";
import { getTourRedirectTarget } from "./utils/tour-routes";

export const onRequest = defineMiddleware((context, next) => {
  const target = getTourRedirectTarget(context.url.pathname);

  if (target) {
    const search = context.url.search;
    const hash = context.url.hash;
    return context.redirect(`${target}${search}${hash}`, 301);
  }

  return next();
});
