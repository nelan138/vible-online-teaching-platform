### Folder directory: src/app/pages/

0. `/` should always reroute to `/login`, DO NOT navigate to `/`.
1. `/login` as entry point
2. after authenticated and authorized user is directed to either `/admin` or `/homepage` (there should be a CTA to redirect user to `/courses`)
3. courses are displayed in `/courses/my_courses`, click on one will redirect user to `/courses/[courseId]` (for example `/courses/1`)
4. user can access their profile at `/profile/my_profile` or check out other users' profiles at `/profile/[id]`
