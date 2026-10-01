# CMS setup (Sanity)

The website remains a static site on Cloudflare Pages. Sanity Studio is the editor dashboard; its Content Lake stores the published news, achievements, and albums. The public page only reads published content. Do not add a Sanity write token to `js/` or any other public website file.

## 1. Create a Sanity project

1. Create/sign in to an account at [sanity.io](https://www.sanity.io/).
2. Create a project and a `production` dataset.
3. In the dataset access settings, allow **public read** access. The website needs this to fetch published content without a secret. Do not enable public write access.
4. In API / CORS settings, allow the website's origin (for local development, `http://localhost:5500`; after deployment, add the exact Pages/custom-domain origin). Credentials are not needed.
5. Copy the project ID.

## 2. Connect the public website

The public website is configured in `js/cms-config.js`. Keep its project ID and dataset in sync with your Sanity project. The Studio's local environment is configured in the ignored `cms/.env` file. Commit and deploy the site; Cloudflare Pages needs no build command and uses the repository root as its output directory.

If Sanity is not configured or its API is unavailable, the existing sample content remains visible.

## 3. Run and publish the editor dashboard

The `cms/.env` file is already populated for this project. From the `cms/` directory, run:

```sh
npm install
npm run dev
```

Sign in when prompted. To publish the dashboard at a Sanity-hosted URL, run `npm run deploy` and follow the CLI prompts. Add the account(s) that should edit content as project members in Sanity; only trusted staff should have edit permissions.

## 4. Add content

Use the Studio sections:

- **Informasi terbaru**: title, date, optional summary, photo, and optional external article URL. The website shows the three newest published entries.
- **Kebanggaan sekolah**: award, level, year, icon, and display order. The website shows up to six.
- **Momen sekolah**: create an album, set its order, and add photos with captions. The existing photo viewer works with CMS albums too.

Sanity drafts are not returned by the website's public read queries; publish a document in Studio for it to appear. Existing hardcoded/sample content is used for a section until that section has published CMS entries.

## Content security

Public-read access means visitors can read published content, which is expected for a public school website. Studio editing remains authenticated. Never place a private or write-capable API token in frontend JavaScript. Review uploads for student privacy and obtain school/guardian approval where applicable before publishing identifiable student photos.
