import type { Payload } from 'payload'

export const seed = async (payload: Payload): Promise<void> => {
  // create super admin
  await payload.create({
    collection: 'users',
    data: {
      email: 'demo@payloadcms.com',
      password: 'demo',
      roles: ['super-admin'],
    },
  })

  // create tenants, use `*.localhost.com` so that accidentally forgotten changes the hosts file are acceptable
  const [abc, bbc] = await Promise.all([
    await payload.create({
      collection: 'tenants',
      data: {
        name: 'ABC',
        domains: [{ domain: 'abc.localhost.com:3000' }],
      },
    }),
    await payload.create({
      collection: 'tenants',
      data: {
        name: 'BBC',
        domains: [{ domain: 'bbc.localhost.com:3000' }],
      },
    }),
  ])

  // create tenant-scoped admins and users
  await Promise.all([
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@abc.com',
        password: 'test',
        roles: ['user'],
        tenants: [
          {
            tenant: abc.id,
            roles: ['admin'],
          },
        ],
      },
    }),
    await payload.create({
      collection: 'users',
      data: {
        email: 'user@abc.com',
        password: 'test',
        roles: ['user'],
        tenants: [
          {
            tenant: abc.id,
            roles: ['user'],
          },
        ],
      },
    }),
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@bbc.com',
        password: 'test',
        roles: ['user'],
        tenants: [
          {
            tenant: bbc.id,
            roles: ['admin'],
          },
        ],
      },
    }),
    await payload.create({
      collection: 'users',
      data: {
        email: 'user@bbc.com',
        password: 'test',
        roles: ['user'],
        tenants: [
          {
            tenant: bbc.id,
            roles: ['user'],
          },
        ],
      },
    }),
  ])

  // create tenant-scoped pages
  // await Promise.all([
  //   await payload.create({
  //     collection: 'pages',
  //     data: {
  //       tenant: abc.id,
  //       title: 'ABC Home',
  //       richText: [
  //         {
  //           text: 'Hello, ABC!',
  //         },
  //       ],
  //     },
  //   }),
  //   await payload.create({
  //     collection: 'pages',
  //     data: {
  //       title: 'BBC Home',
  //       tenant: bbc.id,
  //       richText: [
  //         {
  //           text: 'Hello, BBC!',
  //         },
  //       ],
  //     },
  //   }),
  // ])


  // await payload.create({
  //   collection: 'pages',
  //   data: {
  //     title: 'BBC Home',
  //     publishedAt: new Date().toISOString(),
  //     hero: {
  //       type: 'highImpact',
  //       richText: [
  //         {
  //           text: 'Welcome to BBC Home!',
  //         },
  //       ],
  //       links: [
  //         {
  //           link: {
  //             type: 'custom',
  //             newTab: true,
  //             url: 'https://www.bbc.com',
  //             label: 'Visit BBC',
  //             appearance: 'primary',
  //           },
  //         },
  //       ],
  //       media: 'some-media-id', // Assuming 'some-media-id' is a valid media ID in your database
  //     },
  //     layout: [
  //       {
  //         invertBackground: false,
  //         richText: [
  //           {
  //             text: 'This is a CTA block with some rich text content.',
  //           },
  //         ],
  //         links: [
  //           {
  //             link: {
  //               type: 'reference',
  //               newTab: false,
  //               reference: {
  //                 relationTo: 'pages',
  //                 value: 'some-page-id', // Assuming 'some-page-id' is a valid page ID in your database
  //               },
  //               label: 'Learn More',
  //               appearance: 'secondary',
  //             },
  //           },
  //         ],
  //         blockType: 'cta',
  //       },
  //       {
  //         invertBackground: true,
  //         columns: [
  //           {
  //             size: 'half',
  //             richText: [
  //               {
  //                 text: 'Column 1 content',
  //               },
  //             ],
  //             enableLink: true,
  //             link: {
  //               type: 'custom',
  //               newTab: false,
  //               url: 'https://example.com',
  //               label: 'Example Link',
  //               appearance: 'default',
  //             },
  //           },
  //           {
  //             size: 'half',
  //             richText: [
  //               {
  //                 text: 'Column 2 content',
  //               },
  //             ],
  //             enableLink: true,
  //             link: {
  //               type: 'reference',
  //               newTab: false,
  //               reference: {
  //                 relationTo: 'pages',
  //                 value: 'another-page-id', // Assuming 'another-page-id' is a valid page ID in your database
  //               },
  //               label: 'Another Page',
  //               appearance: 'primary',
  //             },
  //           },
  //         ],
  //         blockType: 'content',
  //       },
  //       {
  //         invertBackground: false,
  //         position: 'fullscreen',
  //         media: 'another-media-id', // Assuming 'another-media-id' is a valid media ID in your database
  //         blockType: 'mediaBlock',
  //       },
  //       {
  //         introContent: [
  //           {
  //             text: 'Introducing our latest projects and posts.',
  //           },
  //         ],
  //         populateBy: 'collection',
  //         relationTo: 'posts',
  //         categories: ['category-id-1', 'category-id-2'], // Assuming these are valid category IDs
  //         limit: 5,
  //         blockType: 'archive',
  //       },
  //     ],
  //     tenant: 'bbc-tenant-id', // Assuming 'bbc-tenant-id' is a valid tenant ID
  //     richText: [
  //       {
  //         text: 'Hello, BBC!',
  //       },
  //     ],
  //     slug: 'bbc-home',
  //     updatedAt: new Date().toISOString(),
  //     createdAt: new Date().toISOString(),
  //   },
  // });

}
