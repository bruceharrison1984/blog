## Development

### Content

Content goes in the `content` folder.

### Build

- `npm run build` will compile all pages and markdown. It will also generate the `sitemap.xml` files.
- All images in the public folder will be scanned, and all `img` tags will automatically have their height/width values added by `rehype-img-size`. This only applies to pages generated from Markdown.
