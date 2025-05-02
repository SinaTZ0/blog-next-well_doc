
- lets add `Vazir font`.
  -- the font add about 35 and 46 (82kb in total).
  -- right now the size is "237 kB transferred, 506 kB resources"
  -- **Final Size**: 82 kb

- lets see how much all compoennts of `Shadcn` adding to this. right now the first page is "237 kB transferred, 505 kB resources". lets see if that change. it shouldn't, right? because it does not have anything with Shadcn but we see.
  -- ok right now adding Shadcn and Themeing(dark mode inculded) the size is "286 kB transferred, 690 kB resources"
  -- so we can say roughly it's 50kb for UI Libarary which is acceptable but we are not even use any component in home page. let's check that!
  -- ok so after using some Shadcn component in main page the Size really didn't change that much. it's now "231 kB transferred, 622 kB resources"(it's even lower i know!).
  -- here is full compereations:
      All (199.03 KB) to (234.14 KB)
      static/chunks/framework-1158a0cb627c4f82.js (56.07 KB)------------------------- static/chunks/framework-1158a0cb627c4f82.js (56.07 KB)
      static/chunks/96e220d1-21a0fdc894793ec0.js (51.96 KB)				                    static/chunks/96e220d1-7e0261cec0f9534b.js (51.96 KB)
      static/chunks/770-76939705ff65587a.js (45.37 KB)------------------------------- static/chunks/770-1c5b685191ece963.js (45.37 KB)
      static/chunks/main-9cb474862ad2d729.js (31.32 KB)				                        static/chunks/main-9cb474862ad2d729.js (31.32 KB)
      static/chunks/299-3d800a9d82a8b555.js (5.31 KB)-------------------------------- static/chunks/299-92b93ecaf237f5da.js (5.31 KB)
      static/chunks/pages/_error-9d5608a271e6f010.js (2.42 KB)			                  static/chunks/pages/_error-9d5608a271e6f010.js (2.42 KB)
      static/chunks/441.30fe80b65ad1be69.js (2.34 KB)-------------------------------- static/chunks/441.30fe80b65ad1be69.js (2.34 KB)
      static/chunks/webpack-6ac6f898031cf2fb.js (1.69 KB)				                      static/chunks/webpack-8c79491ac338114d.js (1.7 KB)
      static/chunks/app/_not-found/page-fc03ad80c386bbf7.js (978 B)------------------ static/chunks/app/_not-found/page-2865d2bd57118ad5.js (978 B)
      static/chunks/pages/_app-14c753e7f0c2c952.js (509 B)				                    static/chunks/pages/_app-14c753e7f0c2c952.js (509 B)
      static/chunks/412.ecee15d245e22ef8.js (416 B)---------------------------------- static/chunks/412.ecee15d245e22ef8.js (416 B)
      static/chunks/app/layout-8e3870be5dba9e8a.js (314 B)				                    static/chunks/app/layout-18215f82f5377257.js (1.71 KB)
      static/chunks/main-app-bf6614cd17aa133e.js (219 B)----------------------------- static/chunks/main-app-bf6614cd17aa133e.js (219 B)
      static/chunks/app/page-f0e572f18e5c3473.js (172 B)				                      static/chunks/app/page-f0e572f18e5c3473.js (172 B)



      + static/chunks/148-229a557ea6ce12f7.js (33.69 KB)                => *newly added*
      + static/chunks/app/layout-8e3870be5dba9e8a.js (1.396 kb)         => increased from (314 B) to (1.71 KB)
  -- **Final Size**: 46 kb

- i added `React Scan` to project and suprizingly the project size reduced! from (234.14 KB) to (233.52 KB). Also the transfer size doesn't change because it doesn't included in build time.
  -- **Final Size**: 0 kb

- lets add Drizzle and see how much that add. this one shouldn't add much because it run on server but some type that would be share like schema might add to size.
  -- we have these two warring( WARN  2 deprecated subdependencies found: @esbuild-kit/core-utils@3.3.2, @esbuild-kit/esm-loader@2.6.5) but doesn't matter since it for drizzle-kit which is used in dev-dependency. you can check it with "pnpm why @esbuild-kit/core-utils".
  -- i added `Zod` for env as well but mark it server only. it look like this way it didn't add anything to bundle size.
  -- the size with `Drizzle` and `Zod` is now (233.52 KB). so not even 1 byte added!
  -- i removed all of chrome extension for measuring. now the current transfer size is => 278 kB transferred, 683 kB resources
  -- **Final Size**: 0 kb
