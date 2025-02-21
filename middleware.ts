import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);

export default clerkMiddleware(async (auth, request) => {
  const { userId, orgId } = await auth(); // Get authenticated user

  let path = '/select-org';

  // WHEN LOGGED IN AND ON PUBLIC ROUTE and has organization -> redirect to organization
  if (userId && isPublicRoute(request) && orgId) {
    path = `/organization/${orgId}`;

    const organizationPageUrl = new URL(path, request.url);

    return NextResponse.redirect(organizationPageUrl);
  }

  // WHEN NOT LOGGED IN AND ON NOT PUBLIC ROUTE -> redirect to public route
  if (!userId && !isPublicRoute(request)) {
    await auth.protect();

    return NextResponse.redirect(new URL('/', request.url));
  }

  // WHEN LOGGED IN WITHOUT ORG -> REDIRECT TO -> ' SELECT ORG ' TO CREATE ONE
  if (userId && !orgId && request.nextUrl.pathname !== '/select-org') {
    path = '/select-org';

    const selectOrgUrl = new URL(path, request.url);

    return NextResponse.redirect(selectOrgUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
